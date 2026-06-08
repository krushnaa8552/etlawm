"use strict";
import dotenv from "dotenv";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import * as wa from "./scrap.js";
import axios from "axios";
import * as otpService from "./services/otp.js";
import { signToken, requireAuth, requireAdmin, optionalAuth } from "./middleware/auth.js";
import * as db from "./pgdb.js";
import { askGemini } from "./gemini.js";
import { getHistory, saveMessage } from "./chatMemory.js";
import path from "path";
import fs from "fs";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ─── File Uploads Config ───────────────────────────────────────────────────────
const UPLOADS_DIR = "./uploads";
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "product-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });


async function resolveCart(req) {
  if (req.user?.id) {
    const {
      rows: [cart],
    } = await db.carts.getOrCreateForUser(req.user.id);

    return {
      cart,
      type: "user",
    };
  }

  const guestId = req.headers["x-guest-id"];

  if (!guestId || typeof guestId !== "string" || guestId.length > 128) {
    const error = new Error("Guest ID is required.");
    error.status = 400;
    throw error;
  }

  const {
    rows: [cart],
  } = await db.carts.getOrCreateForGuest(guestId);

  return {
    cart,
    type: "guest",
  };
}


// ─── Connect DB ───────────────────────────────────────────────────────────────
db.connectPG();

// ─── Rate Limiters ────────────────────────────────────────────────────────────
// Limits OTP sends to 3 per IP per 10 minutes — prevents SMS/WhatsApp spam.
const sendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please wait 10 minutes.",
  },
});

// Limits verify attempts to 5 per IP per 5 minutes — prevents brute-force.
const verifyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many verification attempts. Please wait 5 minutes.",
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH — OTP FLOW
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/auth/send-otp
 * Body: { phone_number, country_code }
 *
 * Validates the phone number, generates + hashes an OTP, stores it,
 * and delivers it via WhatsApp (or console in dev).
 * Always returns a generic response to avoid disclosing account existence.
 */
app.post("/api/auth/send-otp", sendOtpLimiter, async (req, res) => {
  const { phone_number, country_code = "+91" } = req.body;

  // ── Input validation ──────────────────────────────────────────────────────
  if (!phone_number) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required." });
  }

  // Strip non-digits and validate length (9–15 digits per ITU E.164)
  const digits = phone_number.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format." });
  }

  // Build E.164 format: strip leading zeros, prepend country code digits
  const ccDigits = country_code.replace(/\D/g, "");
  const e164phone = ccDigits + digits.replace(/^0+/, "");

  try {
    // Delete any existing unexpired OTPs for this number (fresh start)
    await db.otpCodes.deleteByPhone(e164phone);

    // Generate OTP
    const otp = otpService.generateOtp();
    const otp_hash = await otpService.hashOtp(otp);
    const expires_at = new Date(
      Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 5) * 60_000,
    );

    // Persist hashed OTP
    await db.otpCodes.create({ phone_number: e164phone, otp_hash, expires_at });

    // Deliver OTP (WhatsApp or console fallback)
    await otpService.sendOtp(e164phone, otp);

    // Generic response — never reveal whether the number exists
    res.json({
      success: true,
      message: "If the number is valid, an OTP has been sent.",
    });
  } catch (err) {
    console.error("[send-otp]", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { phone_number, country_code, otp }
 *
 * Verifies the OTP. On success:
 *   - If user exists → issue JWT, return user + isNewUser: false
 *   - If new user    → create user record, issue JWT, return isNewUser: true
 *                      (frontend then shows the name-entry onboarding step)
 */
app.post("/api/auth/verify-otp", verifyOtpLimiter, async (req, res) => {
  const { phone_number, country_code = "+91", otp } = req.body;

  if (!phone_number || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "phone_number and otp are required." });
  }

  const digits = phone_number.replace(/\D/g, "");
  const ccDigits = country_code.replace(/\D/g, "");
  const e164phone = ccDigits + digits.replace(/^0+/, "");

  try {
    // ── Find latest valid OTP ─────────────────────────────────────────────
    const { rows: otpRows } = await db.otpCodes.findLatest(e164phone);
    if (!otpRows.length) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No valid OTP found. Please request a new one.",
        });
    }

    const otpRecord = otpRows[0];

    // Guard: max 5 attempts per OTP record
    if (otpRecord.attempts >= 5) {
      return res
        .status(429)
        .json({
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP.",
        });
    }

    // Increment attempt counter before verifying
    await db.otpCodes.incrementAttempts(otpRecord.id);

    // ── Verify hash ───────────────────────────────────────────────────────
    const isValid = await otpService.verifyOtp(String(otp), otpRecord.otp_hash);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    // OTP is valid — delete it immediately (single-use)
    await db.otpCodes.deleteByPhone(e164phone);

    // ── Find or create user ───────────────────────────────────────────────
    const shouldBeAdmin = await db.adminPhones.isAdmin(e164phone);
    let { rows: userRows } = await db.users.findByPhone(e164phone);
    let isNewUser = false;

    if (!userRows.length) {
      // New user: create a minimal record
      const { rows } = await db.users.create({
        phone_number: e164phone,
        phone_verified: true,
        onboarding_step: 0,
        is_admin: shouldBeAdmin,
      });
      userRows = rows;
      isNewUser = true;
    } else {
      // Existing user: mark phone verified + update last login
      await db.users.markPhoneVerified(e164phone);
      await db.users.touchLastLogin(userRows[0].id);
      if (userRows[0].is_admin !== shouldBeAdmin) {
        const { rows: updatedUserRows } = await db.users.update(
          userRows[0].id,
          { is_admin: shouldBeAdmin },
        );
        userRows = updatedUserRows;
      }
    }

    const user = userRows[0];

    // ── Issue JWT ─────────────────────────────────────────────────────────
    const token = signToken({
      id: user.id,
      phone_number: user.phone_number,
      onboarding_step: user.onboarding_step,
      is_admin: user.is_admin ?? false,
    });

    // Store a lightweight session record (for future revocation)
    // refresh_token_hash is NOT NULL in schema — store a hashed random token
    // as a placeholder until refresh-token rotation is implemented.
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60_000); // 7 days
    const rawRefreshToken = crypto.randomBytes(32).toString("hex");
    const refresh_token_hash = await bcrypt.hash(rawRefreshToken, 10);
    await db.userSessions.create({
      user_id: user.id,
      refresh_token_hash,
      user_agent: req.headers["user-agent"] ?? null,
      ip_address: req.ip ?? null,
      expires_at: expiresAt,
    });

    res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_step: user.onboarding_step,
        is_admin: user.is_admin ?? false,
      },
    });
  } catch (err) {
    console.error("[verify-otp]", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

/**
 * POST /api/auth/onboard
 * Body: { first_name, last_name? }   — requires valid JWT
 *
 * Called after OTP verification for new users to save their name.
 * Sets onboarding_step = 1 (basic profile complete).
 */
app.post("/api/auth/onboard", requireAuth, async (req, res) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !first_name.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "first_name is required." });
  }

  try {
    const { rows } = await db.users.update(req.user.id, {
      first_name: first_name.trim(),
      last_name: last_name ? last_name.trim() : undefined,
      onboarding_step: 1,
    });

    const user = rows[0];

    // Re-issue token with updated onboarding_step
    const token = signToken({
      id: user.id,
      phone_number: user.phone_number,
      onboarding_step: user.onboarding_step,
      is_admin: user.is_admin ?? false,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_step: user.onboarding_step,
        is_admin: user.is_admin ?? false,
      },
    });
  } catch (err) {
    console.error("[onboard]", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

/**
 * GET /api/auth/me
 * Returns the current user's profile from the JWT.  — requires valid JWT
 * Used on app load to rehydrate auth state.
 */
app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.users.findById(req.user.id);
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const user = rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_step: user.onboarding_step,
        is_admin: user.is_admin ?? false,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    console.error("[me]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * POST /api/auth/logout
 * Deletes all server-side sessions for the current user.  — requires valid JWT
 */
app.post("/api/auth/logout", requireAuth, async (req, res) => {
  try {
    await db.userSessions.deleteByUserId(req.user.id);
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("[logout]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════════════════════════════════════

// Register a new user
// Body: { first_name, last_name, email, password }
app.post("/api/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "first_name, email and password are required.",
      });
  }

  try {
    const { rows } = await db.users.findByEmail(email);
    if (rows.length) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const {
      rows: [user],
    } = await db.users.create({ first_name, last_name, email, password_hash });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      userId: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (err) {
    console.error("[register]", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

// Login
// Body: { email, password }
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const { rows } = await db.users.findByEmail(email);
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const user = rows[0];

    if (!user.password_hash) {
      return res.status(400).json({
        success: false,
        message: "This account uses phone-number login.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    await db.users.touchLastLogin(user.id);

    const token = signToken({
      id: user.id,
      phone_number: user.phone_number,
      onboarding_step: user.onboarding_step,
      is_admin: user.is_admin ?? false,
    });

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_admin: user.is_admin ?? false,
      },
    });
  } catch (err) {
    console.error("[login]", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

// Get user profile
app.get("/api/users/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.users.findById(req.user.id);
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("[get user]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ADDRESSES
// ═══════════════════════════════════════════════════════════════════════════════

// Add an address
app.post("/api/addresses", requireAuth, async (req, res) => {
  const { line1, city, state, pincode, is_default } = req.body;

  if (!line1 || !city || !state || !pincode) {
    return res
      .status(400)
      .json({ success: false, message: "All address fields are required." });
  }

  try {
    const {
      rows: [address],
    } = await db.addresses.create({
      user_id: req.user.id,
      line1,
      city,
      state,
      pincode,
      is_default,
    });
    res.status(201).json({ success: true, address });
  } catch (err) {
    console.error("[add address]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get all addresses for a user
app.get("/api/addresses", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.addresses.findByUser(req.user.id);
    res.json({ success: true, addresses: rows });
  } catch (err) {
    console.error("[get addresses]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Set default address
app.patch("/api/addresses/:id/default", requireAuth, async (req, res) => {
  try {
    const {
      rows: [address],
    } = await db.addresses.setDefault(req.params.id, req.user.id);
    res.json({ success: true, address });
  } catch (err) {
    console.error("[set default address]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Delete an address
app.delete("/api/addresses/:id", requireAuth, async (req, res) => {
  try {
    await db.addresses.delete(req.params.id, req.user.id);
    res.json({ success: true, message: "Address deleted." });
  } catch (err) {
    console.error("[delete address]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

// Get all categories

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const { rows } = await db.categories.findAll();

    res.json({
      success: true,
      categories: rows,
    });
  } catch (err) {
    console.error("[get categories]", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

// Get all products (optional ?category_id=&limit=&offset=)
app.get("/api/products", async (req, res) => {
  const { category_id, limit, offset } = req.query;
  try {
    const { rows } = await db.products.findAll({
      category_id: category_id ? parseInt(category_id) : undefined,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    });
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error("[get products]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.post("/api/categories", requireAdmin, async (req, res) => {
  const { name, slug, subtitle, description, image_url, is_active } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Category name is required.",
    });
  }

  try {
    const {
      rows: [cat],
    } = await db.categories.create({
      name,
      slug,
      subtitle,
      description,
      image_url,
      is_active,
    });

    res.status(201).json({
      success: true,
      category: cat,
    });
  } catch (err) {
    console.error("[create category]", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error.",
    });
  }
});

app.patch("/api/categories/:id", requireAdmin, async (req, res) => {
  try {
    const {
      rows: [category],
    } = await db.categories.update(req.params.id, req.body);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (err) {
    console.error("[update category]", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error.",
    });
  }
});

app.delete("/api/categories/:id", requireAdmin, async (req, res) => {
  try {
    await db.categories.delete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted.",
    });
  } catch (err) {
    console.error("[delete category]", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

// Get a single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const { rows } = await db.products.findById(req.params.id);
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    const {
      rows: [rating],
    } = await db.reviews.avgRating(req.params.id);
    res.json({ success: true, product: { ...rows[0], ...rating } });
  } catch (err) {
    console.error("[get product]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Create a product
// Body: { name, category_id, price, stock_qty, description }
// Note: images are managed separately via POST /api/products/:id/images
app.post("/api/products", requireAdmin, async (req, res) => {
  const {
    name,
    slug,
    code,
    category_id,
    badge,

    price,
    original_price,
    discount_value,
    discount_type,

    stock_qty,

    size_value,
    size_unit,

    description,
    ingredients,
    usage_instructions,
    benefits,

    status,
    is_active,
    is_draft,

    seo_title,
    seo_description,

    is_new,
    concerns,
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: "Name and price are required.",
    });
  }

  try {
    const {
      rows: [product],
    } = await db.products.create({
      name,
      slug,
      code,
      category_id,
      badge,

      price,
      original_price,
      discount_value,
      discount_type,

      stock_qty,
      size_value,
      size_unit,

      description,
      ingredients,
      usage_instructions,
      benefits,

      status,
      is_active,
      is_draft,

      seo_title,
      seo_description,

      is_new,
      concerns,
    });

    // Initialise inventory row for this product
    await db.inventory.init(product.id, stock_qty ?? 0);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    console.error("[create product]", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

// Update a product
app.patch("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const {
      rows: [product],
    } = await db.products.update(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (err) {
    console.error("[update product]", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error." });
  }
});

// Delete a product
app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    await db.products.delete(req.params.id);
    res.json({ success: true, message: "Product deleted." });
  } catch (err) {
    console.error("[delete product]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── Product Images ───────────────────────────────────────────────────────────

// ─── Admin File Upload ────────────────────────────────────────────────────────
app.post(
  "/api/admin/upload",
  requireAdmin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  },
);

// Add an image to a product
// Body: { image_url, is_primary, sort_order }
app.post("/api/products/:id/images", requireAdmin, async (req, res) => {
  const { image_url, is_primary, sort_order } = req.body;
  if (!image_url)
    return res
      .status(400)
      .json({ success: false, message: "image_url is required." });
  try {
    const {
      rows: [img],
    } = await db.productImages.add({
      product_id: req.params.id,
      image_url,
      is_primary,
      sort_order,
    });
    res.status(201).json({ success: true, image: img });
  } catch (err) {
    console.error("[add product image]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get all images for a product
app.get("/api/products/:id/images", async (req, res) => {
  try {
    const { rows } = await db.productImages.findByProduct(req.params.id);
    res.json({ success: true, images: rows });
  } catch (err) {
    console.error("[get product images]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Set an image as primary
app.patch("/api/products/:product_id/images/:id/primary", requireAdmin, async (req, res) => {
  try {
    const {
      rows: [img],
    } = await db.productImages.setPrimary(req.params.id, req.params.product_id);
    res.json({ success: true, image: img });
  } catch (err) {
    console.error("[set primary image]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Delete a product image
app.delete("/api/products/:product_id/images/:id", requireAdmin, async (req, res) => {
  try {
    await db.productImages.delete(req.params.id, req.params.product_id);
    res.json({ success: true, message: "Image deleted." });
  } catch (err) {
    console.error("[delete product image]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════════════════════════════

// Place an order
// Body: {
//   user_id,
//   shipping: { name, line1, city, state, pincode },
//   items: [{ product_id, quantity, unit_price }]
// }
app.post("/api/orders", requireAuth, async (req, res) => {
  const { shipping, items } = req.body;

  if (!shipping || !Array.isArray(items) || !items.length) {
    return res.status(400).json({
      success: false,
      message: "shipping and at least one item are required.",
    });
  }

  const { name, line1, city, state, pincode } = shipping;
  if (!name || !line1 || !city || !state || !pincode) {
    return res.status(400).json({
      success: false,
      message: "All shipping fields are required.",
    });
  }

  try {
    const trustedItems = [];

    for (const item of items) {
      const productId = item.product_id;
      const quantity = Number(item.quantity);

      if (!isValidUuid(productId) || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Every item must contain a valid product_id and positive quantity.",
        });
      }

      const { rows } = await db.products.findById(productId);
      const product = rows[0];

      if (!product || !product.is_active) {
        return res.status(404).json({
          success: false,
          message: `Product ${productId} was not found.`,
        });
      }

      if (quantity > Number(product.stock_qty)) {
        return res.status(409).json({
          success: false,
          message: `Only ${product.stock_qty} item(s) of ${product.name} are available.`,
        });
      }

      trustedItems.push({
        product_id: product.id,
        quantity,
        unit_price: Number(product.price),
      });
    }

    const {
      rows: [order],
    } = await db.orders.create({
      user_id: req.user.id,
      shipping,
      items: trustedItems,
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("[place order]", err);
    if (err.message?.startsWith("Insufficient stock")) {
      return res.status(409).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get all orders for a user
app.get("/api/orders", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.orders.findByUser(req.user.id);
    res.json({ success: true, orders: rows });
  } catch (err) {
    console.error("[get orders]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get a single order with its items
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  try {
    const { rows } = await db.orders.findById(req.params.id);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const order = rows[0];
    if (order.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const { rows: items } = await db.orders.getItems(req.params.id);
    res.json({ success: true, order: { ...order, items } });
  } catch (err) {
    console.error("[get order]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Update order status — Body: { status: 'paid' | 'shipped' | 'delivered' | 'cancelled' }
app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!status)
    return res
      .status(400)
      .json({ success: false, message: "Status is required." });
  try {
    const {
      rows: [order],
    } = await db.orders.updateStatus(req.params.id, status);
    res.json({ success: true, order });
  } catch (err) {
    console.error("[update order status]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  REVIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// Add / update a review
// Body: { user_id, product_id, rating, comment }
app.post("/api/reviews", requireAuth, async (req, res) => {
  const { product_id, rating, comment } = req.body;

  if (!product_id || !rating) {
    return res
      .status(400)
      .json({
        success: false,
        message: "product_id and rating are required.",
      });
  }
  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5." });
  }

  try {
    const {
      rows: [review],
    } = await db.reviews.upsert({ user_id: req.user.id, product_id, rating, comment });
    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error("[upsert review]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get all reviews for a product
app.get("/api/reviews/:product_id", async (req, res) => {
  try {
    const { rows: reviews } = await db.reviews.findByProduct(
      req.params.product_id,
    );
    const {
      rows: [rating],
    } = await db.reviews.avgRating(req.params.product_id);
    res.json({ success: true, reviews, ...rating });
  } catch (err) {
    console.error("[get reviews]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Delete a review
app.delete("/api/reviews", requireAuth, async (req, res) => {
  const { product_id } = req.body;
  try {
    await db.reviews.delete(req.user.id, product_id);
    res.json({ success: true, message: "Review deleted." });
  } catch (err) {
    console.error("[delete review]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  WHATSAPP OPT-IN
// ═══════════════════════════════════════════════════════════════════════════════

const WA_API_URL = `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

/**
 * Sends a text message via WhatsApp Cloud API.
 */
const sendWAMessage = async (to, message) => {
  await axios({
    url: WA_API_URL,
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });
};

/**
 * Calls the AI agent with a prompt and returns its text reply.
 * Set AGENT_URL + AGENT_API_KEY in your .env.
 */
// const callAiAgent = async (prompt) => {
//     const response = await axios({
//         url: process.env.GEMINI_URL,
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
//             'Content-Type': 'application/json',
//         },
//         data: JSON.stringify({ prompt }),
//     });
//     return response.data?.reply ?? response.data?.message ?? '';
// };

/**
 * PATCH /api/user/whatsapp-optin
 * Body: { consent: true | false }
 *
 * Persists the user's WhatsApp marketing consent in the DB.
 * When consent === true, sends a personalised welcome via WhatsApp Cloud API
 * (message text generated by the AI agent) to enrol the user in order-update
 * and promotional flows.
 */
app.patch("/api/user/whatsapp-optin", requireAuth, async (req, res) => {
  const { consent } = req.body;

  if (typeof consent !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "`consent` must be a boolean." });
  }

  try {
    // Persist preference
    const { rows } = await db.users.setWhatsappOptIn(req.user.id, consent);
    const user = rows[0];

    // On opt-in: generate a welcome message via AI agent and send it over WhatsApp
    if (consent) {
      try {
        const prompt = `Say hi to ${user.first_name}`;
        const welcomeText = await askGemini(prompt);
        await sendWAMessage(user.phone_number, welcomeText);
        // await sendWAMessage(917030577234, "welcome");
      } catch (msgErr) {
        // Non-fatal — preference is already saved; log and continue
        console.error(
          "[whatsapp-optin] message delivery failed:",
          msgErr.response?.data ?? msgErr.message,
        );
      }
    }

    res.json({
      success: true,
      whatsapp_opt_in: user.whatsapp_opt_in,
    });
  } catch (err) {
    console.error("[whatsapp-optin]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const userText = message.text?.body;

    if (!userText) {
      await wa.sendTextMessage(from, "Please send a text message.");
      return res.sendStatus(200);
    }

    const history = getHistory(from);

    saveMessage(from, "user", userText);

    const aiReply = await askGemini(userText, history);

    saveMessage(from, "bot", aiReply);

    await wa.sendTextMessage(from, aiReply);

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.sendStatus(200);
  }
});

// ─── ADMIN PROFILE & SYSTEM SETTINGS ROUTES ───────────────────────────────────

// Retrieve profile of the logged-in admin
app.get("/api/admin/profile", requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.users.findById(req.user.id);
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found." });
    }
    const user = rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_step: user.onboarding_step,
        is_admin: user.is_admin,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    console.error("[get-admin-profile]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Update profile details of the logged-in admin and issue a new JWT token
app.patch("/api/admin/profile", requireAdmin, async (req, res) => {
  const { first_name, last_name, email } = req.body;

  if (!first_name || !first_name.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "First name is required." });
  }

  try {
    // If email is changing, check for uniqueness (excluding current user)
    if (email && email.trim()) {
      const trimmedEmail = email.trim();
      const { rows: emailCheck } = await db.users.findByEmail(trimmedEmail);
      if (emailCheck.length > 0 && emailCheck[0].id !== req.user.id) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Email address already in use by another account.",
          });
      }
    }

    const { rows } = await db.users.update(req.user.id, {
      first_name: first_name.trim(),
      last_name: last_name ? last_name.trim() : null,
      email: email ? email.trim() : null,
    });

    const user = rows[0];

    // Re-issue token with updated name
    const token = signToken({
      id: user.id,
      phone_number: user.phone_number,
      onboarding_step: user.onboarding_step,
      is_admin: user.is_admin ?? false,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_step: user.onboarding_step,
        is_admin: user.is_admin ?? false,
      },
    });
  } catch (err) {
    console.error("[update-admin-profile]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Retrieve all admin settings as key-value pairs
app.get("/api/admin/settings", requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.adminSettings.getAll();
    const settingsObj = {};
    rows.forEach((r) => {
      settingsObj[r.key] = r.value;
    });
    res.json({ success: true, settings: settingsObj });
  } catch (err) {
    console.error("[get-admin-settings]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Update settings (accepts key-value pairs in request body)
app.patch("/api/admin/settings", requireAdmin, async (req, res) => {
  const settings = req.body;
  if (!settings || typeof settings !== "object") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid settings body." });
  }

  try {
    const keys = Object.keys(settings);
    const updated = {};
    for (const key of keys) {
      const { rows } = await db.adminSettings.set(key, String(settings[key]));
      if (rows.length) {
        updated[rows[0].key] = rows[0].value;
      }
    }
    res.json({
      success: true,
      settings: updated,
      message: "Settings updated successfully.",
    });
  } catch (err) {
    console.error("[update-admin-settings]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// dev-only route to flag a user as admin by phone number
app.post("/api/admin/make-admin", requireAdmin, async (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) {
    return res
      .status(400)
      .json({ success: false, message: "phone_number is required." });
  }
  const digits = phone_number.replace(/\D/g, "");
  try {
    await db.adminPhones.add(digits);
    const { rows } = await db.users.findByPhone(digits);
    if (rows.length > 0) {
      await db.users.update(rows[0].id, { is_admin: true });
    }
    res.json({
      success: true,
      message: `Phone number ${digits} is now reserved for admin and marked in user profile.`,
    });
  } catch (err) {
    console.error("[make-admin]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// route to add a phone number to admin_phones table (requires authenticated admin)
app.post("/api/admin/register-phone", requireAdmin, async (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) {
    return res
      .status(400)
      .json({ success: false, message: "phone_number is required." });
  }
  const digits = phone_number.replace(/\D/g, "");
  try {
    await db.adminPhones.add(digits);
    const { rows } = await db.users.findByPhone(digits);
    if (rows.length > 0) {
      await db.users.update(rows[0].id, { is_admin: true });
    }
    res.json({
      success: true,
      message: `Phone number ${digits} is now reserved for admin.`,
    });
  } catch (err) {
    console.error("[register-phone]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// route to list all reserved admin phone numbers (requires authenticated admin)
app.get("/api/admin/phones", requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.adminPhones.findAll();
    res.json({ success: true, phones: rows });
  } catch (err) {
    console.error("[get-admin-phones]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// route to remove a phone number from reserved admin_phones table (requires authenticated admin)
app.delete(
  "/api/admin/phones/:phone_number",
  requireAdmin,
  async (req, res) => {
    const { phone_number } = req.params;
    if (!phone_number) {
      return res
        .status(400)
        .json({ success: false, message: "phone_number is required." });
    }
    const digits = phone_number.replace(/\D/g, "");
    try {
      await db.adminPhones.remove(digits);
      // Sync is_admin flag: set it to false on the user record if they exist
      const { rows } = await db.users.findByPhone(digits);
      if (rows.length > 0) {
        await db.users.update(rows[0].id, { is_admin: false });
      }
      res.json({
        success: true,
        message: `Phone number ${digits} is no longer reserved for admin.`,
      });
    } catch (err) {
      console.error("[remove-admin-phone]", err);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },
);


// ─── Cart ------------------------───────────────────────────────────

app.get("/api/cart", optionalAuth, async (req, res) => {
  try {
    const { cart, type } = await resolveCart(req);
    const { rows: items } = await db.cartItems.findByCart(cart.id);

    const itemCount = items.reduce(
      (total, item) => total + Number(item.quantity),
      0,
    );

    const subtotal = items.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0,
    );

    res.json({
      success: true,
      cart: {
        id: cart.id,
        type,
        items,
        item_count: itemCount,
        subtotal,
      },
    });
  } catch (err) {
    console.error("[get cart]", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Server error.",
    });
  }
});


app.post("/api/cart/items", optionalAuth, async (req, res) => {
  const productId = req.body.product_id ?? req.body.productId;
  const quantity = Number(req.body.quantity ?? 1);

  if (!isValidUuid(productId)) {
    return res.status(400).json({
      success: false,
      message: "A valid product_id UUID is required.",
    });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive integer.",
    });
  }

  try {
    const { rows: productRows } = await db.products.findById(productId);
    const product = productRows[0];

    if (!product || !product.is_active) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const { cart } = await resolveCart(req);
    const { rows: currentItems } = await db.cartItems.findByCart(cart.id);

    const existingItem = currentItems.find(
      (item) => item.product_id === productId,
    );

    const newQuantity =
      Number(existingItem?.quantity ?? 0) + quantity;

    if (newQuantity > Number(product.stock_qty)) {
      return res.status(409).json({
        success: false,
        message: `Only ${product.stock_qty} item(s) are currently available.`,
      });
    }

    await db.cartItems.upsert({
      cart_id: cart.id,
      product_id: productId,
      quantity: newQuantity,
    });

    const { rows: items } = await db.cartItems.findByCart(cart.id);

    res.status(201).json({
      success: true,
      cart: {
        id: cart.id,
        items,
      },
    });
  } catch (err) {
    console.error("[add cart item]", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Server error.",
    });
  }
});


app.post("/api/cart/items/remove-selected", optionalAuth, async (req, res) => {
  const productIds = req.body.product_ids ?? req.body.productIds ?? req.body.cartItemIds;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "product_ids must be a non-empty array.",
    });
  }

  const invalidProductId = productIds.find((productId) => !isValidUuid(productId));

  if (invalidProductId) {
    return res.status(400).json({
      success: false,
      message: "Every product ID must be a valid UUID.",
    });
  }

  try {
    const { cart } = await resolveCart(req);

    await Promise.all(
      productIds.map((productId) =>
        db.cartItems.remove({
          cart_id: cart.id,
          product_id: productId,
        }),
      ),
    );

    const { rows: items } = await db.cartItems.findByCart(cart.id);

    res.json({
      success: true,
      cart: {
        id: cart.id,
        items,
      },
    });
  } catch (err) {
    console.error("[remove selected cart items]", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Server error.",
    });
  }
});


app.patch(
  "/api/cart/items/:productId",
  optionalAuth,
  async (req, res) => {
    const productId = req.params.productId;
    const quantity = Number(req.body.quantity);

    if (!isValidUuid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be zero or a positive integer.",
      });
    }

    try {
      const { cart } = await resolveCart(req);

      if (quantity === 0) {
        await db.cartItems.remove({
          cart_id: cart.id,
          product_id: productId,
        });
      } else {
        const { rows: productRows } =
          await db.products.findById(productId);

        const product = productRows[0];

        if (!product || !product.is_active) {
          return res.status(404).json({
            success: false,
            message: "Product not found.",
          });
        }

        if (quantity > Number(product.stock_qty)) {
          return res.status(409).json({
            success: false,
            message: `Only ${product.stock_qty} item(s) are currently available.`,
          });
        }

        const { rows: updatedRows } =
          await db.cartItems.updateQuantity({
            cart_id: cart.id,
            product_id: productId,
            quantity,
          });

        if (!updatedRows.length) {
          return res.status(404).json({
            success: false,
            message: "Item is not present in the cart.",
          });
        }
      }

      const { rows: items } = await db.cartItems.findByCart(cart.id);

      res.json({
        success: true,
        cart: {
          id: cart.id,
          items,
        },
      });
    } catch (err) {
      console.error("[update cart item]", err);

      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Server error.",
      });
    }
  },
);


app.delete(
  "/api/cart/items/:productId",
  optionalAuth,
  async (req, res) => {
    const productId = req.params.productId;

    if (!isValidUuid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    try {
      const { cart } = await resolveCart(req);

      await db.cartItems.remove({
        cart_id: cart.id,
        product_id: productId,
      });

      const { rows: items } = await db.cartItems.findByCart(cart.id);

      res.json({
        success: true,
        cart: {
          id: cart.id,
          items,
        },
      });
    } catch (err) {
      console.error("[remove cart item]", err);

      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Server error.",
      });
    }
  },
);


app.delete("/api/cart", optionalAuth, async (req, res) => {
  try {
    const { cart } = await resolveCart(req);

    await db.cartItems.clearCart(cart.id);

    res.json({
      success: true,
      cart: {
        id: cart.id,
        items: [],
      },
    });
  } catch (err) {
    console.error("[clear cart]", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Server error.",
    });
  }
});


app.post("/api/cart/merge", requireAuth, async (req, res) => {
  const { guest_id } = req.body;

  if (!guest_id || typeof guest_id !== "string" || guest_id.length > 128) {
    return res.status(400).json({
      success: false,
      message: "guest_id is required.",
    });
  }

  try {
    const {
      rows: [cart],
    } = await db.carts.mergeGuestToUser(
      guest_id,
      req.user.id,
    );

    const { rows: items } = await db.cartItems.findByCart(cart.id);

    res.json({
      success: true,
      cart: {
        id: cart.id,
        type: "user",
        items,
      },
    });
  } catch (err) {
    console.error("[merge cart]", err);

    res.status(500).json({
      success: false,
      message: "Could not merge the guest cart.",
    });
  }
});





// ═══════════════════════════════════════════════════════════════════════════════
//  START SERVER
// ═══════════════════════════════════════════════════════════════════════════════
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);