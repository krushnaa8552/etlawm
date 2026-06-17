import db from "../pgdb.js";
import otpService from "../services/otpService.js";
import { signToken } from "../middleware/auth.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

//post
const sendOtp = async (req, res) => {
  const { phone_number, country_code = "+91" } = req.body;

  if (!phone_number) {
    return res.status(400).json({ success: false, message: "Phone number is required." });
  }

  const digits = phone_number.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return res.status(400).json({ success: false, message: "Invalid phone number format." });
  }

  const ccDigits = country_code.replace(/\D/g, "");
  const e164phone = ccDigits + digits.replace(/^0+/, "");

  try {
    await db.otpCodes.deleteByPhone(e164phone);

    const otp = otpService.generateOtp();
    const otp_hash = await otpService.hashOtp(otp);
    const expires_at = new Date(
      Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 5) * 60_000,
    );

    await db.otpCodes.create({ phone_number: e164phone, otp_hash, expires_at });

    await otpService.sendOtp(e164phone, otp); //IMPORTANT

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
}

//post
const verifyOtp = async (req, res) => {
  const { phone_number, country_code = "+91", otp } = req.body;
  
  if (!phone_number || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Phone Number and OTP are required." });
  }

  const digits = phone_number.replace(/\D/g, "");
  const ccDigits = country_code.replace(/\D/g, "");
  const e164phone = ccDigits + digits.replace(/^0+/, "");
  
  try {
    const { rows: otpRows } = await db.otpCodes.findLatest(e164phone);
    if (!otpRows.length) {
      return res.status(400).json({
          success: false,
          message: "No valid OTP found. Please request a new one.",
        });
    }

    const otpRecord = otpRows[0];

    if (otpRecord.attempts >= 5) {
      return res
        .status(429)
        .json({
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP.",
        });
    }

    await db.otpCodes.incrementAttempts(otpRecord.id);

    const isValid = await otpService.verifyOtp(String(otp), otpRecord.otp_hash);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    await db.otpCodes.deleteByPhone(e164phone);

    const shouldBeAdmin = await db.adminPhones.isAdmin(e164phone);
    let { rows: userRows } = await db.users.findByPhone(e164phone);
    let isNewUser = false;

    if (!userRows.length) {
      const { rows } = await db.users.create({
        phone_number: e164phone,
        phone_verified: true,
        onboarding_step: 0,
        is_admin: shouldBeAdmin,
      });
      userRows = rows;
      isNewUser = true;
    } else {
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

    const token = signToken({
      id: user.id,
      phone_number: user.phone_number,
      onboarding_step: user.onboarding_step,
      is_admin: user.is_admin ?? false,
    });

    // Store a lightweight session record (for future revocation)
    // refresh_token_hash is NOT NULL in schema — store a hashed random token
    // as a placeholder until refresh-token rotation is implemented.
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60_000); // 14 days
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
        whatsapp_opt_in: user.whatsapp_opt_in,
      },
    });
  } catch (err) {
    console.error("[verify-otp]", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
}

//post
const onBoard = async (req, res) => {
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
        whatsapp_opt_in: user.whatsapp_opt_in,
      },
    });
  } catch (err) {
    console.error("[onboard]", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
}

//get
const me = async (req, res) => {
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
        whatsapp_opt_in: user.whatsapp_opt_in,
      },
    });
  } catch (err) {
    console.error("[me]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

//post
const logOut = async (req, res) => {
  try {
    await db.userSessions.deleteByUserId(req.user.id);
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("[logout]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}


export { sendOtp, verifyOtp, onBoard, me, logOut };