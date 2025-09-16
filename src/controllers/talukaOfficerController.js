import logger from "../config/logger.js";
import { generateToken } from "../middleware/authentication.js";
import TalukaOfficer from "../models/TalukaOfficer.js";
import bcrypt from "bcryptjs";

export const talukaOfficerRegister = async (req, res, next) => {
  try {
    const body = req.body;

    // const existingTalukaOfficer = await TalukaOfficer.findOne({
    //   email: body.email,
    // });

    const existingTalukaOfficer = await TalukaOfficer.findOne({
      $or: [
        { email: body.email },
        { contact: body.contact },
        { aadhaarNumber: body.aadhaarNumber },
      ],
    });

    if (existingTalukaOfficer) {
      return res.status(409).json({
        message: "Taluka Officer already registered with this email, contact, or Aadhaar",
      });
    }

    // Hash password before saving
    if (body.password) {
      const saltRounds = 10;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }

    const talukaOfficer = await TalukaOfficer.create(body);
    const token = generateToken({ id: talukaOfficer._id });

    return res.status(201).json({
      message: "New Taluka Officer Created",
      talukaOfficer,
      token,
    });
  } catch (err) {
    logger.error(err);
    console.error(err);
    return res.status(500).json({
      error: "Error while taluka officer register",
      err,
    });
  }
};

export const getTalukaOfficer = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({
        message: "Please pass a valid ID",
      });
    }

    const talukaOfficer = await TalukaOfficer.findById(id);

    if (!talukaOfficer) {
      return res.status(409).json({
        message: "Taluka Officer not found",
      });
    }

    return res.status(200).json({
      message: "Taluka Officer found",
      talukaOfficer,
    });
  } catch (err) {
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching taluka officer",
      error: err.message,
    });
  }
};

export const updateTalukaOfficer = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existingTalukaOfficer = await TalukaOfficer.findById(id);
    if (!existingTalukaOfficer) {
      return res.status(402).json({
        message: "Taluka Officer does not exist , no taluka officer found",
      });
    }

    // Hash password if it's being updated
    if (req.body.password) {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    const updatedTalukaOfficer = await TalukaOfficer.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedTalukaOfficer) {
      return res.status(402).json({
        message: "Error while updating taluka officer",
      });
    }

    return res.status(200).json({
      message: "Taluka Officer Updated Successfully",
      talukaOfficer: updatedTalukaOfficer,
    });
  } catch (err) {
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching taluka officer",
      error: err.message,
    });
  }
};

export const getTalukaOfficers = async (req, res, next) => {
  try {
    const talukaOfficers = await TalukaOfficer.find();

    if (talukaOfficers.length === 0) {
      return res.status(409).json({
        message: "No taluka officers found",
      });
    }

    return res.status(200).json({
      message: "Taluka officers fetched successfully",
      data: talukaOfficers,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while fetching taluka officers",
      error: err.message,
    });
  }
};

export const talukaOfficerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).json({
        error: "please send email and password",
      });
    }
    const existingTalukaOfficer = await TalukaOfficer.findOne({ email });
    if (!existingTalukaOfficer) {
      return res.status(409).json({
        error: "No taluka officer found",
      });
    }

    // Compare hashed password
    const confirmPassword = await bcrypt.compare(
      password,
      existingTalukaOfficer.password
    );
    if (!confirmPassword) {
      return res.status(409).json({
        message: "Password does not match",
      });
    }

    const token = generateToken({ id: existingTalukaOfficer._id });
    if (!token) {
      return res.status(409).json({
        error: "error while generating token",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      talukaOfficer: {
        id: existingTalukaOfficer._id,
        name: existingTalukaOfficer.name,
        email: existingTalukaOfficer.email,
        role: existingTalukaOfficer.role,
      },
      existingTalukaOfficer: existingTalukaOfficer,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while taluka officer login",
      error: err.message,
    });
  }
};

export const getUnverifiedTalukaOfficers = async (req, res) => {
  try {
    const { flag } = req.query;
    const isVerified = flag === "true";

    const talukaOfficers = await TalukaOfficer.find({ isVerified });

    if (!talukaOfficers || talukaOfficers.length === 0) {
      return res.status(409).json({
        message: "No taluka officers found",
        talukaOfficers: [],
      });
    }

    return res.status(200).json({
      message: "Taluka officers fetched successfully",
      talukaOfficers,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error while fetching taluka officers",
      error: err.message,
    });
  }
};

export const deleteTalukaOfficer = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Taluka Officer ID is required" });
  }

  try {
    const talukaOfficer = await TalukaOfficer.findByIdAndDelete(id);

    if (!talukaOfficer) {
      return res.status(409).json({ message: "Taluka Officer not found" });
    }

    return res
      .status(200)
      .json({ message: "Taluka Officer deleted successfully", talukaOfficer });
  } catch (err) {
    console.error("Error deleting taluka officer:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const countTalukaOfficer = async (req, res) => {
  try {
    const count = await TalukaOfficer.countDocuments();

    if (!count) {
      return res.status(409).json({
        message: "Could not calculate count for taluka officer",
      });
    }

    return res.status(200).json({
      message: "Count calculated for taluka officer",
      count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while calculating count for taluka officers",
    });
  }
};

const formatInput = (value) => {
  if (!value) return value;
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const talukaOfficerFiltering = async (req, res) => {
  try {
    const { state, village, taluka, district } = req.query;

    const query = {};

    if (state) query.state = formatInput(state);
    if (village) query.village = formatInput(village);
    if (taluka) query.taluka = formatInput(taluka);
    if (district) query.district = formatInput(district);

    const talukaOfficers = await TalukaOfficer.find(query);

    if (!talukaOfficers || talukaOfficers.length === 0) {
      return res.status(404).json({
        message: "No taluka officers found",
      });
    }

    res.status(200).json({
      message: "Taluka officers found",
      talukaOfficers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Error while filtering taluka officers",
      message: err.message,
    });
  }
};

export const getTalukaOfficerByPhone = async (req, res) => {
  const { contact } = req.query;

  if (!contact) {
    return res.status(409).json({
      message: "Please provide contact",
    });
  }

  const talukaOfficer = await TalukaOfficer.findOne({ contact: contact });
  if (!talukaOfficer) {
    return res.status(409).json({
      message: "No Taluka Officer found with given contact",
    });
  }

  // For phone-based login, you might want to handle password verification differently
  // Currently, it just generates a token without password check for phone login
  const token = generateToken({ id: talukaOfficer._id });
  try {
    if (!token) {
      return res.status(404).json({
        error: "error while generating token",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      talukaOfficer: talukaOfficer,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while fetching taluka officer",
      error: err.message,
    });
  }
};

// import bcrypt from 'bcrypt';
// import Taluka from '../models/TalukaOfficer.js';
// import { generateTokens } from '../utils/generateToken.js';

// // REGISTER Taluka Officer
// export const registerTaluka = async (req, res) => {
//   try {
//     const { name, email, contact, aadhaarNumber, password, ...rest } = req.body;

//     // Check if email exists
//     const existing = await Taluka.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create Taluka Officer
//     const talukaOfficer = new Taluka({
//       name,
//       email,
//       contact,
//       aadhaarNumber,
//       password: hashedPassword, // store hashed
//       ...rest
//     });

//     await talukaOfficer.save();

//     res.status(201).json({ message: 'Taluka Officer registered successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // LOGIN Taluka Officer
// export const loginTaluka = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const talukaOfficer = await Taluka.findOne({ email });
//     if (!talukaOfficer) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, talukaOfficer.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate Tokens (role is fixed as 'talukaOfficer' here)
//     const { accessToken, refreshToken } = generateTokens(talukaOfficer._id, 'talukaOfficer');

//     // Store refresh token in HTTP-only cookie
//     res.cookie('jwt', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     res.json({
//       message: 'Login successful',
//       accessToken
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
