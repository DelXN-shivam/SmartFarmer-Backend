
import bcrypt from 'bcrypt';
import SuperAdmin from "../models/SuperAdmin.js";
import { generateTokens } from "../utils/generateToken.js";

// REGISTER Super Admin
export const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if email exists
    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Super Admin
    const superAdmin = new SuperAdmin({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await superAdmin.save();

    res
      .status(201)
      .json({
        message: "Super Admin registered successfully",
        data: superAdmin,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN Super Admin
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      superAdmin._id,
      superAdmin.role
    );

    // Store refresh token in HTTP-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      superAdmin: superAdmin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
