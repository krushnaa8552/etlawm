import db from "../pgdb.js";
import bcrypt from 'bcrypt';
import { signToken } from "../middleware/auth.js";

//post
const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !email || !password) {
    return res.status(400).json({
        success: false,
        message: "first_name, email and password are required.",
      });
  }

  try {
    const { rows } = await db.users.findByEmail(email);
    if (rows.length) {
      return res.status(409).json({
        success: false,
        message: "Email already registered."
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { rows: [user] } = await db.users.create({ first_name, last_name, email, password_hash });

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
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
}

//post
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const { rows } = await db.users.findByEmail(email);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const user = rows[0];

    if (!user.password_hash) {
      return res.status(400).json({success: false, message: "This account uses phone-number login.",});
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
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
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
}

//get
const profile = async (req, res) => {
  try {
    const { rows } = await db.users.findById(req.user.id);
    if (!rows.length)
      return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("[get user]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

//post
const addAddress = async (req, res) => {
  const { line1, city, state, pincode, is_default } = req.body;

  if (!line1 || !city || !state || !pincode) {
    return res.status(400).json({ success: false, message: "All address fields are required." });
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
}

//get
const getAddress = async (req, res) => {
  try {
    const { rows } = await db.addresses.findByUser(req.user.id);
    res.json({ success: true, addresses: rows });
  } catch (err) {
    console.error("[get addresses]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

//patch profile
const updateProfile = async (req, res) => {
  const { first_name, last_name, email } = req.body;

  try {
    const fieldsToUpdate = {};
    if (first_name !== undefined) fieldsToUpdate.first_name = first_name.trim();
    if (last_name !== undefined) fieldsToUpdate.last_name = last_name.trim();
    
    if (email !== undefined) {
      const emailTrimmed = email.trim().toLowerCase();
      if (emailTrimmed) {
        // check if email is taken
        const { rows: existing } = await db.users.findByEmail(emailTrimmed);
        if (existing.length && existing[0].id !== req.user.id) {
          return res.status(409).json({ success: false, message: "Email already registered to another account." });
        }
        fieldsToUpdate.email = emailTrimmed;
      } else {
        fieldsToUpdate.email = null;
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ success: false, message: "No profile fields provided to update." });
    }

    const { rows } = await db.users.update(req.user.id, fieldsToUpdate);
    const updatedUser = rows[0];

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        phone_number: updatedUser.phone_number,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        onboarding_step: updatedUser.onboarding_step,
        is_admin: updatedUser.is_admin ?? false,
        is_active: updatedUser.is_active,
      }
    });
  } catch (err) {
    console.error("[update profile]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

//patch
const updateAddress = async (req, res) => {
  try {
    const {
      rows: [address],
    } = await db.addresses.setDefault(req.params.id, req.user.id);
    res.json({ success: true, address });
  } catch (err) {
    console.error("[set default address]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

//delete
const deleteAddress = async (req, res) => {
  try {
    await db.addresses.delete(req.params.id, req.user.id);
    res.json({ success: true, message: "Address deleted." });
  } catch (err) {
    console.error("[delete address]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

//post complaint
const submitComplaint = async (req, res) => {
  const { complaint } = req.body;

  if (!complaint || !complaint.trim()) {
    return res.status(400).json({ success: false, message: "Complaint is required." });
  }

  try {
    const { rows } = await db.customerComplaints.create({
      user_id: req.user.id,
      complaint: complaint.trim()
    });
    res.status(201).json({ success: true, complaint: rows[0] });
  } catch (err) {
    console.error("[submit complaint]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export { register, login, profile, addAddress, getAddress, updateProfile, updateAddress, deleteAddress, submitComplaint };
