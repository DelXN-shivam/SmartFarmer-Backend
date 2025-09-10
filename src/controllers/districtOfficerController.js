import logger from "../config/logger.js";
import { generateToken } from "../middleware/authentication.js";
import DistrictOfficer from "../models/DistrictOfficer.js";
import bcrypt from "bcryptjs";

export const districtOfficerRegister = async (req, res, next) => {
  try {
    const body = req.body;

    const existingDistrictOfficer = await DistrictOfficer.findOne({
      $or: [
        { email: body.email },
        { contact: body.contact },
        { aadhaarNumber: body.aadhaarNumber },
      ],
    });

    if (existingDistrictOfficer) {
      return res.status(409).json({
        message:
          "District Officer already registered with this email, contact, or Aadhaar",
      });
    }

    // Hash password before saving
    if (body.password) {
      const saltRounds = 10;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }

    const districtOfficer = await DistrictOfficer.create(body);
    const token = generateToken({ id: districtOfficer._id });

    return res.status(201).json({
      message: "New District Officer Created",
      districtOfficer,
      token,
    });
  } catch (err) {
    logger.error(err);
    console.error(err);
    return res.status(500).json({
      error: "Error while district officer register",
      message: err.message,
    });
  }
};

export const getDistrictOfficer = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({
        message: "Please pass a valid ID",
      });
    }

    const districtOfficer = await DistrictOfficer.findById(id)
      .populate("farmerId")
      .populate("talukaOfficersId");

    if (!districtOfficer) {
      return res.status(409).json({
        message: "District Officer not found",
      });
    }

    return res.status(200).json({
      message: "District Officer found",
      districtOfficer,
    });
  } catch (err) {
    console.error(err);
    logger.error(err);
    return res.status(500).json({
      message: "Error while fetching district officer",
      error: err.message,
    });
  }
};

export const updateDistrictOfficer = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existingDistrictOfficer = await DistrictOfficer.findById(id);
    if (!existingDistrictOfficer) {
      return res.status(402).json({
        message: "District Officer does not exist",
      });
    }

    // Hash password if it's being updated
    if (req.body.password) {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    const updatedDistrictOfficer = await DistrictOfficer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("farmerId")
      .populate("talukaOfficersId");

    if (!updatedDistrictOfficer) {
      return res.status(402).json({
        message: "Error while updating district officer",
      });
    }

    return res.status(200).json({
      message: "District Officer Updated Successfully",
      districtOfficer: updatedDistrictOfficer,
    });
  } catch (err) {
    console.error(err);
    logger.error(err);
    return res.status(500).json({
      message: "Error while updating district officer",
      error: err.message,
    });
  }
};

export const getDistrictOfficers = async (req, res, next) => {
  try {
    const districtOfficers = await DistrictOfficer.find()
      .populate("farmerId")
      .populate("talukaOfficersId");

    if (districtOfficers.length === 0) {
      return res.status(409).json({
        message: "No district officers found",
      });
    }

    return res.status(200).json({
      message: "District officers fetched successfully",
      data: districtOfficers,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);
    return res.status(500).json({
      message: "Error while fetching district officers",
      error: err.message,
    });
  }
};

export const districtOfficerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).json({
        error: "Please provide email and password",
      });
    }

    const existingDistrictOfficer = await DistrictOfficer.findOne({ email })
      .populate("farmerId")
      .populate("talukaOfficersId");

    if (!existingDistrictOfficer) {
      return res.status(409).json({
        error: "No district officer found with this email",
      });
    }

    // Compare hashed password
    const confirmPassword = await bcrypt.compare(
      password,
      existingDistrictOfficer.password
    );
    if (!confirmPassword) {
      return res.status(409).json({
        message: "Password does not match",
      });
    }

    const token = generateToken({ id: existingDistrictOfficer._id });
    if (!token) {
      return res.status(409).json({
        error: "Error while generating token",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      districtOfficer: {
        id: existingDistrictOfficer._id,
        name: existingDistrictOfficer.name,
        email: existingDistrictOfficer.email,
        district: existingDistrictOfficer.district,
        role: "districtOfficer",
      },
      existingDistrictOfficer: existingDistrictOfficer,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);
    return res.status(500).json({
      message: "Error while district officer login",
      error: err.message,
    });
  }
};

export const deleteDistrictOfficer = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "District Officer ID is required" });
  }

  try {
    const districtOfficer = await DistrictOfficer.findByIdAndDelete(id);

    if (!districtOfficer) {
      return res.status(409).json({ message: "District Officer not found" });
    }

    return res.status(200).json({
      message: "District Officer deleted successfully",
      districtOfficer,
    });
  } catch (err) {
    console.error("Error deleting district officer:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const countDistrictOfficer = async (req, res) => {
  try {
    const count = await DistrictOfficer.countDocuments();

    return res.status(200).json({
      message: "Count calculated for district officers",
      count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while calculating count for district officers",
      error: err.message,
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

export const districtOfficerFiltering = async (req, res) => {
  try {
    const { state, village, taluka, district } = req.query;
    const query = {};

    if (state) query.state = formatInput(state);
    if (village) query.village = formatInput(village);
    if (taluka) query.taluka = formatInput(taluka);
    if (district) query.district = formatInput(district);

    const districtOfficers = await DistrictOfficer.find(query)
      .populate("farmerId")
      .populate("talukaOfficersId");

    if (!districtOfficers || districtOfficers.length === 0) {
      return res.status(404).json({
        message: "No district officers found",
      });
    }

    res.status(200).json({
      message: "District officers found",
      districtOfficers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Error while filtering district officers",
      message: err.message,
    });
  }
};

export const getDistrictOfficerByPhone = async (req, res) => {
  const { contact } = req.query;

  if (!contact) {
    return res.status(409).json({
      message: "Please provide contact number",
    });
  }

  try {
    const districtOfficer = await DistrictOfficer.findOne({ contact })
      .populate("farmerId")
      .populate("talukaOfficersId");

    if (!districtOfficer) {
      return res.status(409).json({
        message: "No District Officer found with given contact",
      });
    }

    const token = generateToken({ id: districtOfficer._id });
    if (!token) {
      return res.status(404).json({
        error: "Error while generating token",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      districtOfficer: districtOfficer,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);
    return res.status(500).json({
      message: "Error while fetching district officer",
      error: err.message,
    });
  }
};

export const addTalukaOfficerToDistrict = async (req, res) => {
  try {
    const { districtOfficerId, talukaOfficerId } = req.body;

    if (!districtOfficerId || !talukaOfficerId) {
      return res.status(400).json({
        message: "District Officer ID and Taluka Officer ID are required",
      });
    }

    const districtOfficer = await DistrictOfficer.findById(districtOfficerId);
    if (!districtOfficer) {
      return res.status(404).json({
        message: "District Officer not found",
      });
    }

    // Check if taluka officer already exists in the array
    if (districtOfficer.talukaOfficersId.includes(talukaOfficerId)) {
      return res.status(409).json({
        message: "Taluka Officer already assigned to this District Officer",
      });
    }

    districtOfficer.talukaOfficersId.push(talukaOfficerId);
    await districtOfficer.save();

    const updatedDistrictOfficer = await DistrictOfficer.findById(
      districtOfficerId
    ).populate("talukaOfficersId");

    return res.status(200).json({
      message: "Taluka Officer added successfully",
      districtOfficer: updatedDistrictOfficer,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while adding taluka officer",
      error: err.message,
    });
  }
};

// import DistrictOfficer from "../models/DistrictOfficer.js";
// import bcrypt from "bcrypt";
// import { generateTokens } from "../utils/generateToken.js";

// export const registerDistrictOfficer = async (req, res) => {
//   try {
//     const body = req.body;

//     if (!body) {
//       return res.status(403).json({
//         messsage: "Please pass in the required fields",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);
//     if (!hashedPassword) {
//       return res.status(400).json({
//         message: "Error while hashing password",
//       });
//     }
//     const newDistrictOfficer = await DistrictOfficer.create({
//       name: body.name,
//       email: body.email,
//       password: hashedPassword,
//       age: body.age,
//       contact: body.contact,
//     });

//     if (!newDistrictOfficer) {
//       return res.status(400).json({
//         message: "Error while creating district officer",
//       });
//     }

//     const officerData = newDistrictOfficer.toObject();
//     delete officerData.password;

//     return res.status(201).json({
//       message: "District officer created",
//       data: officerData,
//     });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       message: "Error while fetching farmer",
//       error: err.message,
//     });
//   }
// };

// export const loginDistrictOfficer = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const officer = await DistrictOfficer.findOne({ email });
//     if (!officer) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, officer.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate tokens (pass user ID & role)
//     const { accessToken, refreshToken } = generateTokens(
//       officer._id,
//       officer.role
//     );

//     // Store refresh token in cookie
//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.json({
//       message: "Login successful",
//       accessToken,
//       role: officer.role,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
