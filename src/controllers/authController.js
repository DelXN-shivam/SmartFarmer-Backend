import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import DistrictOfficer from "../models/DistrictOfficer.js";
import TalukaOfficer from "../models/TalukaOfficer.js";
import SuperAdmin from "../models/SuperAdmin.js";
import Farmer from "../models/Farmer.js";
import Verifier from "../models/Verifier.js";

const userModels = [DistrictOfficer, TalukaOfficer, SuperAdmin];
const mobileUserModels = [Farmer, Verifier];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    for (const Model of userModels) {
      user = await Model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a single JWT token (can be short-lived or long-lived)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // adjust expiry as needed
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: false,
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      talukaId: user.talukaId || null,
      districtId: user.districtId || null,
    };

    // You can optionally return user info (not token)
    return res.json({
      message: "Login successful",
      role: user.role,
      data: user,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const mobileLoginByContact = async (req, res) => {
  const { contact } = req.query;

  if (!contact) {
    return res.status(409).json({
      message: "Please provide contact",
    });
  }

  try {
    let user = null;
    for (const Model of mobileUserModels) {
      user = await Model.findOne({ contact });
      if (user) break;
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    // Create a single JWT token (can be short-lived or long-lived)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // adjust expiry as needed
    );

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      talukaId: user.talukaId || null,
      districtId: user.districtId || null,
    };

    // You can optionally return user info (not token)
    return res.json({
      message: "Login successful",
      role: user.role,
      data: user,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const refreshTokenHandler = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "No refresh token" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};

export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });
  res.json({ message: "Logged out successfully" });
};
