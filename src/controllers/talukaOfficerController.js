import bcrypt from 'bcrypt';
import Taluka from '../models/TalukaOfficer.js';
import { generateTokens } from '../utils/generateToken.js';


// REGISTER Taluka Officer
export const registerTaluka = async (req, res) => {
  try {
    const { name, email, contact, aadhaarNumber, password, ...rest } = req.body;

    // Check if email exists
    const existing = await Taluka.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Taluka Officer
    const talukaOfficer = new Taluka({
      name,
      email,
      contact,
      aadhaarNumber,
      password: hashedPassword, // store hashed
      ...rest
    });

    await talukaOfficer.save();

    res.status(201).json({ message: 'Taluka Officer registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// LOGIN Taluka Officer
export const loginTaluka = async (req, res) => {
  try {
    const { email, password } = req.body;

    const talukaOfficer = await Taluka.findOne({ email });
    if (!talukaOfficer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, talukaOfficer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Tokens (role is fixed as 'talukaOfficer' here)
    const { accessToken, refreshToken } = generateTokens(talukaOfficer._id, 'talukaOfficer');

    // Store refresh token in HTTP-only cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
