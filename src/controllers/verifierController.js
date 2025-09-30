import logger from '../config/logger.js';
import { generateToken } from '../middleware/authentication.js';
import Verifier from "../models/Verifier.js";
import TalukaOfficer from "../models/TalukaOfficer.js"; // Import TalukaOfficer model
import Crop from "../models/Crop.js";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose"; // Import mongoose for ObjectId validation
import { assignExistingCropsToVerifier } from '../utils/verifierAssignment.js';

// src/controllers/verifierController.js

// export const verifierRegister = async (req, res) => {
//   try {
//     const body = req.body;

//     // Prevent duplicate email
//     const existingVerifier = await Verifier.findOne({ email: body.email });
//     if (existingVerifier) {
//       return res.status(409).json({ message: "Verifier already registered" });
//     }

//     // Create verifier (MongoDB auto-generates _id)
//     const verifier = await Verifier.create(body);
//     const token = generateToken({ id: verifier._id });

//     // Assign existing crops if any
//     let cropAssignment = null;
//     if (verifier.district && verifier.allocatedTaluka?.length > 0) {
//       cropAssignment = await assignExistingCropsToVerifier(
//         verifier._id,
//         verifier.district,
//         verifier.allocatedTaluka
//       );
//     }

//     // 🔗 Auto-link verifier to TalukaOfficer based on taluka + district
//     const linkedOfficer = await TalukaOfficer.findOneAndUpdate(
//       {
//         taluka: { $regex: new RegExp(`^${verifier.taluka}$`, "i") },
//         district: { $regex: new RegExp(`^${verifier.district}$`, "i") },
//       },
//       { $addToSet: { verifierId: verifier._id } },
//       { new: true }
//     );

//     // Update verifier with linked talukaOfficerId for reference
//     if (linkedOfficer) {
//       await Verifier.findByIdAndUpdate(verifier._id, {
//         talukaOfficerId: linkedOfficer._id,
//       });
//     }

//     return res.status(201).json({
//       message: linkedOfficer
//         ? "New Verifier Created & Linked to Taluka Officer"
//         : "New Verifier Created (No matching Taluka Officer found)",
//       verifier: {
//         ...verifier.toObject(),
//         talukaOfficerId: linkedOfficer?._id || null,
//       },
//       token,
//       cropAssignment,
//       linkedTo: linkedOfficer ? linkedOfficer._id : null,
//     });
//   } catch (err) {
//     console.error("Error in verifierRegister:", err);
//     return res.status(500).json({
//       error: "Error while verifier register",
//       details: err.message,
//     });
//   }
// };
export const verifierRegister = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const body = req.body;

    // Duplicate check
    const existingVerifier = await Verifier.findOne({ 
      $or: [
        { email: body.email },
        { contact: body.contact },
        { aadhaarNumber: body.aadhaarNumber }
      ]
    });
    
    if (existingVerifier) {
      return res.status(409).json({ 
        message: "Verifier with same email, contact or Aadhaar already exists" 
      });
    }

    // ID validation
    const talukaOfficerId = body.talukaOfficerId;
    if (!talukaOfficerId) {
      return res.status(400).json({ 
        message: "Taluka Officer ID is required" 
      });
    }

    // Create verifier
    const verifier = await Verifier.create(body);

    // Link to taluka officer
    const linkedOfficer = await TalukaOfficer.findByIdAndUpdate(
      talukaOfficerId,
      { $addToSet: { verifierId: verifier._id } },
      { new: true }
    );

    if (!linkedOfficer) {
      // Agar taluka officer nahi mila, toh verifier delete karo
      await Verifier.findByIdAndDelete(verifier._id);
      return res.status(404).json({ 
        message: "Taluka Officer not found with provided ID" 
      });
    }

    // Verifier update with officer ID
    await Verifier.findByIdAndUpdate(verifier._id, {
      talukaOfficerId: linkedOfficer._id,
    });

    return res.status(201).json({
      message: "New Verifier Created & Linked to Taluka Officer",
      data: {
        ...verifier.toObject(),
        talukaOfficerId: linkedOfficer._id,
      },
    });
  } catch (err) {
    console.error("Error in verifierRegister:", err);
    return res.status(500).json({
      error: "Error while registering verifier",
      details: err.message,
    });
  }
};



// export const addVerifierToTalukaOfficer = async (req, res) => {
//   try {
//     const { id } = req.params; // TalukaOfficer ID
//     const { verifierId } = req.body; // Verifier ID to add

//     if (!verifierId) {
//       return res.status(400).json({ message: "verifierId is required" });
//     }

//     // Convert verifierId to ObjectId
//     const verifierObjectId = mongoose.Types.ObjectId(verifierId);

//     const talukaOfficer = await TalukaOfficer.findById(id);
//     if (!talukaOfficer) {
//       return res.status(404).json({ message: "Taluka Officer not found" });
//     }

//     // Avoid duplicates
//     if (talukaOfficer.verifierId.includes(verifierObjectId)) {
//       return res.status(409).json({ message: "Verifier already added" });
//     }

//     // Add verifierId to array
//     talukaOfficer.verifierId.push(verifierObjectId);

//     // Save document
//     await talukaOfficer.save();

//     return res.status(200).json({
//       message: "Verifier added successfully",
//       talukaOfficer,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error adding verifier", error: err.message });
//   }
// };

export const getVerifier = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({
        message: "Please pass a valid ID",
      });
    }

    const verifier = await Verifier.findById(id);

    if (!verifier) {
      return res.status(409).json({
        message: "Verifier not found",
      });
    }

    return res.status(200).json({
      message: "Verifier found",
      verifier,
    });
  } catch (err) {
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching verifier",
      error: err.message,
    });
  }
};

export const updateVerifier = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existingVerifier = await Verifier.findById(id);
    if (!existingVerifier) {
      return res.status(402).json({
        message: "Verifier does not exist , no verifier found",
      });
    }

    const updatedVerifier = await Verifier.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedVerifier) {
      return res.status(402).json({
        message: "Error while updating verifier",
      });
    }

    // Check if district or taluka were updated and relink to taluka officer if needed
    let linkedOfficer = null;
    const districtChanged = req.body.district && req.body.district !== existingVerifier.district;
    const talukaChanged = req.body.taluka && req.body.taluka !== existingVerifier.taluka;
    
    if (districtChanged || talukaChanged) {
      // Remove verifier from previous taluka officer
      if (existingVerifier.talukaOfficerId) {
        await TalukaOfficer.findByIdAndUpdate(
          existingVerifier.talukaOfficerId,
          { $pull: { verifierId: id } }
        );
      }

      // Find and link to new taluka officer based on updated taluka/district
      linkedOfficer = await TalukaOfficer.findOneAndUpdate(
        { 
          taluka: { $regex: new RegExp(`^${updatedVerifier.taluka}$`, 'i') },
          district: { $regex: new RegExp(`^${updatedVerifier.district}$`, 'i') }
        },
        { $addToSet: { verifierId: id } },
        { new: true }
      );

      // Update verifier with new talukaOfficerId
      if (linkedOfficer) {
        await Verifier.findByIdAndUpdate(id, {
          talukaOfficerId: linkedOfficer._id
        });
      }
    }

    // Existing crop assignment logic remains the same
    let cropAssignment = null;
    const districtChangedForCrops = req.body.district && req.body.district !== existingVerifier.district;
    const talukasChanged = req.body.allocatedTaluka && 
      JSON.stringify(req.body.allocatedTaluka.sort()) !== JSON.stringify(existingVerifier.allocatedTaluka.sort());
    
    if (districtChangedForCrops || talukasChanged) {
      await Crop.updateMany(
        { verifierId: id },
        { $unset: { verifierId: 1 } }
      );
      
      await Verifier.findByIdAndUpdate(id, { $set: { cropId: [] } });
      
      if (updatedVerifier.district && updatedVerifier.allocatedTaluka && updatedVerifier.allocatedTaluka.length > 0) {
        cropAssignment = await assignExistingCropsToVerifier(
          updatedVerifier._id,
          updatedVerifier.district,
          updatedVerifier.allocatedTaluka
        );
      }
    }

    return res.status(200).json({
      message: "Verifier Updated Successfully",
      verifier: updatedVerifier,
      cropAssignment,
      linkedTo: linkedOfficer ? linkedOfficer._id : updatedVerifier.talukaOfficerId
    });
  } catch (err) {
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while updating verifier",
      error: err.message,
    });
  }
};

export const getVerifiers = async (req, res, next) => {
  try {
      const verifiers = await Verifier.find();
      console.log("Fetched verifiers:", verifiers);
      
    if (verifiers.length === 0) {
      return res.status(409).json({
        message: "No verifiers found",
      });
    }

    return res.status(200).json({
      message: "verifiers fetched successfully",
      data: verifiers,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while fetching verifiers",
      error: err.message,
    });
  }
};

export const verifierLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).json({
        error: "please send email and password",
      });
    }
    const existingVerifier = await Verifier.findOne({ email });
    if (!existingVerifier) {
      return res.status(409).json({
        error: "No verifier found",
      });
    }
    const confirmPassword = bcrypt.compare(password, existingVerifier.password);
    if (!confirmPassword) {
      return res.status(409).json({
        message: "Password does not match",
      });
    }

    const token = generateToken({ id: existingVerifier._id });
    if (!token) {
      return res.status(409).json({
        error: "error while generating token",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      verifier: {
        id: existingVerifier._id,
        name: existingVerifier.name,
        email: existingVerifier.email,
      },
      existingVerifier: existingVerifier,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while verifier login",
      error: err.message,
    });
  }
};

export const getUnverifiedVerifiers = async (req, res) => {
  try {
    const { flag } = req.query;
    const isVerified = flag === "true";

    const verifiers = await Verifier.find({ isVerified });

    if (!verifiers || verifiers.length === 0) {
      return res.status(409).json({
        message: "No verifiers found",
        verifiers: [],
      });
    }

    return res.status(200).json({
      message: "Verifiers fetched successfully",
      verifiers,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error while fetching verifiers",
      error: err.message,
    });
  }
};

export const deleteVerifier = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Verifier ID is required" });
  }

  try {
    const verifier = await Verifier.findByIdAndDelete(id);

    if (!verifier) {
      return res.status(409).json({ message: "Verifier not found" });
    }

    // NEW: Remove verifier ID from taluka officer when verifier is deleted
    try {
      await TalukaOfficer.updateMany(
        { verifierId: id },
        { $pull: { verifierId: id } }
      );
      console.log('Verifier ID removed from taluka officers');
    } catch (updateError) {
      console.error('Failed to remove verifier from taluka officers:', updateError);
    }

    return res
      .status(200)
      .json({ message: "Verifier deleted successfully", verifier });
  } catch (err) {
    console.error("Error deleting verifier:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const countVerifier = async (req, res) => {
  try {
    const count = await Verifier.countDocuments();

    if (!count) {
      return res.status(409).json({
        message: "Could not calculate count for verifier",
      });
    }

    return res.status(200).json({
      message: "Count caluclated for verifier",
      count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while calculating counr for verifiers",
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

export const verifierFiletring = async (req, res) => {
  try {
    const { state, village, taluka, district } = req.query;

    const query = {};

    if (state) query.state = formatInput(state);
    if (village) query.village = formatInput(village);
    if (taluka) query.taluka = formatInput(taluka);
    if (district) query.district = formatInput(district);

    const verifiers = await Verifier.find(query);

    if (!verifiers || verifiers.length === 0) {
      return res.status(404).json({
        message: "No verifiers found",
      });
    }

    res.status(200).json({
      message: "verifiers found",
      verifiers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Error while filtering verifiers",
      message: err.message,
    });
  }
};

export const getVerifierByPhone = async (req, res) => {
  const { contact } = req.query;

  if (!contact) {
    return res.status(409).json({
      message: "Please provide contact",
    });
  }

  const verifier = await Verifier.findOne({ contact: contact });
  if (!verifier) {
    return res.status(409).json({
      message: "No Verifier found with given contact",
    });
  }
  const token = generateToken({ id: verifier._id });
  try {
    if (!token) {
      return res.status(404).json({
        error: "error while generating token",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      verifier: verifier,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while fetching verifier",
      error: err.message,
    });
  }
};

// New function to fetch verifiers by multiple IDs
export const getVerifiersByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Please provide a valid array of verifier IDs",
      });
    }

    // Validate that all IDs are valid MongoDB ObjectIds
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return res.status(400).json({
        message: "No valid verifier IDs provided",
      });
    }

    const verifiers = await Verifier.find({
      _id: { $in: validIds },
    });

    if (verifiers.length === 0) {
      return res.status(404).json({
        message: "No verifiers found for the provided IDs",
      });
    }

    // Check if any requested IDs were not found
    const foundIds = verifiers.map((verifier) => verifier._id.toString());
    const notFoundIds = validIds.filter((id) => !foundIds.includes(id));

    return res.status(200).json({
      message: "Verifiers fetched successfully",
      data: verifiers,
      metadata: {
        totalRequested: ids.length,
        validIds: validIds.length,
        found: verifiers.length,
        notFound: notFoundIds.length,
        notFoundIds: notFoundIds.length > 0 ? notFoundIds : undefined,
      },
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while fetching verifiers by IDs",
      error: err.message,
    });
  }
};











// import logger from '../config/logger.js';
// import { generateToken } from '../middleware/authentication.js';
// import Verifier from "../models/Verifier.js";
// import Crop from "../models/Crop.js";
// import bcrypt from 'bcryptjs';
// import mongoose from "mongoose"; // Import mongoose for ObjectId validation
// import { assignExistingCropsToVerifier } from '../utils/verifierAssignment.js';

// export const verifierRegister = async (req, res, next) => {
//   try {
//     const body = req.body;

//     const existingVerifier = await Verifier.findOne({ email: body.email });
//     if (existingVerifier) {
//       return res.status(409).json({
//         message: "Verifier already registered",
//       });
//     }
//     const verifier = await Verifier.create(body);
//     const token = generateToken({ id: verifier._id });

//     // Assign existing crops to the new verifier if district and allocated talukas are provided
//     let cropAssignment = null;
//     if (verifier.district && verifier.allocatedTaluka && verifier.allocatedTaluka.length > 0) {
//       cropAssignment = await assignExistingCropsToVerifier(
//         verifier._id,
//         verifier.district,
//         verifier.allocatedTaluka
//       );
//     }

//     return res.status(201).json({
//       message: "New Verifier Created",
//       verifier,
//       token,
//       cropAssignment
//     });
//   } catch (err) {
//     logger.error(err);
//     console.error(err);
//     return res.status(500).json({
//       error: "Error while verifier register",
//       err,
//     });
//   }
// };

// export const getVerifier = async (req, res, next) => {
//   try {
//     const id = req.params.id;

//     if (!id) {
//       return res.status(403).json({
//         message: "Please pass a valid ID",
//       });
//     }

//     const verifier = await Verifier.findById(id);

//     if (!verifier) {
//       return res.status(409).json({
//         message: "Verifier not found",
//       });
//     }

//     return res.status(200).json({
//       message: "Verifier found",
//       verifier,
//     });
//   } catch (err) {
//     console.error(err);
//     logger.error(err);

//     return res.status(500).json({
//       message: "Error while fetching verifier",
//       error: err.message,
//     });
//   }
// };

// export const updateVerifier = async (req, res, next) => {
//   try {
//     const id = req.params.id;

//     const existingVerifier = await Verifier.findById(id);
//     if (!existingVerifier) {
//       return res.status(402).json({
//         message: "Verifier does not exist , no verifier found",
//       });
//     }

//     const updatedVerifier = await Verifier.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedVerifier) {
//       return res.status(402).json({
//         message: "Error while updating verifier",
//       });
//     }

//     // Check if district or allocated talukas were updated and reassign crops if needed
//     let cropAssignment = null;
//     const districtChanged = req.body.district && req.body.district !== existingVerifier.district;
//     const talukasChanged = req.body.allocatedTaluka && 
//       JSON.stringify(req.body.allocatedTaluka.sort()) !== JSON.stringify(existingVerifier.allocatedTaluka.sort());
    
//     if (districtChanged || talukasChanged) {
//       // Clear verifierId from crops that were previously assigned to this verifier
//       await Crop.updateMany(
//         { verifierId: id },
//         { $unset: { verifierId: 1 } }
//       );
      
//       // Clear existing crop assignments from verifier
//       await Verifier.findByIdAndUpdate(id, { $set: { cropId: [] } });
      
//       // Reassign crops based on new district/talukas
//       if (updatedVerifier.district && updatedVerifier.allocatedTaluka && updatedVerifier.allocatedTaluka.length > 0) {
//         cropAssignment = await assignExistingCropsToVerifier(
//           updatedVerifier._id,
//           updatedVerifier.district,
//           updatedVerifier.allocatedTaluka
//         );
//       }
//     }

//     return res.status(200).json({
//       message: "Verifier Updated Successfully",
//       verifier: updatedVerifier,
//       cropAssignment
//     });
//   } catch (err) {
//     console.error(err);
//     logger.error(err);

//     return res.status(500).json({
//       message: "Error while updating verifier",
//       error: err.message,
//     });
//   }
// };

// export const getVerifiers = async (req, res, next) => {
//   try {
//     const verifiers = await Verifier.find();

//     if (verifiers.length === 0) {
//       return res.status(409).json({
//         message: "No verifiers found",
//       });
//     }

//     return res.status(200).json({
//       message: "verifiers fetched successfully",
//       data: verifiers,
//     });
//   } catch (err) {
//     console.error(err);
//     logger?.error?.(err);

//     return res.status(500).json({
//       message: "Error while fetching verifiers",
//       error: err.message,
//     });
//   }
// };

// export const verifierLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(409).json({
//         error: "please send email and password",
//       });
//     }
//     const existingVerifier = await Verifier.findOne({ email });
//     if (!existingVerifier) {
//       return res.status(409).json({
//         error: "No verifier found",
//       });
//     }
//     const confirmPassword = bcrypt.compare(password, existingVerifier.password);
//     if (!confirmPassword) {
//       return res.status(409).json({
//         message: "Password does not match",
//       });
//     }

//     const token = generateToken({ id: existingVerifier._id });
//     if (!token) {
//       return res.status(409).json({
//         error: "error while generating token",
//       });
//     }

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       verifier: {
//         id: existingVerifier._id,
//         name: existingVerifier.name,
//         email: existingVerifier.email,
//       },
//       existingVerifier: existingVerifier,
//     });
//   } catch (err) {
//     console.error(err);
//     logger?.error?.(err);

//     return res.status(500).json({
//       message: "Error while verifier login",
//       error: err.message,
//     });
//   }
// };

// export const getUnverifiedVerifiers = async (req, res) => {
//   try {
//     const { flag } = req.query;
//     const isVerified = flag === "true";

//     const verifiers = await Verifier.find({ isVerified });

//     if (!verifiers || verifiers.length === 0) {
//       return res.status(409).json({
//         message: "No verifiers found",
//         verifiers: [],
//       });
//     }

//     return res.status(200).json({
//       message: "Verifiers fetched successfully",
//       verifiers,
//     });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       message: "Error while fetching verifiers",
//       error: err.message,
//     });
//   }
// };

// export const deleteVerifier = async (req, res) => {
//   const { id } = req.params;

//   if (!id) {
//     return res.status(400).json({ message: "Verifier ID is required" });
//   }

//   try {
//     const verifier = await Verifier.findByIdAndDelete(id);

//     if (!verifier) {
//       return res.status(409).json({ message: "Verifier not found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Verifier deleted successfully", verifier });
//   } catch (err) {
//     console.error("Error deleting verifier:", err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const countVerifier = async (req, res) => {
//   try {
//     const count = await Verifier.countDocuments();

//     if (!count) {
//       return res.status(409).json({
//         message: "Could not calculate count for verifier",
//       });
//     }

//     return res.status(200).json({
//       message: "Count caluclated for verifier",
//       count,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Error while calculating counr for verifiers",
//     });
//   }
// };

// const formatInput = (value) => {
//   if (!value) return value;
//   return value
//     .toLowerCase()
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// export const verifierFiletring = async (req, res) => {
//   try {
//     const { state, village, taluka, district } = req.query;

//     const query = {};

//     if (state) query.state = formatInput(state);
//     if (village) query.village = formatInput(village);
//     if (taluka) query.taluka = formatInput(taluka);
//     if (district) query.district = formatInput(district);

//     const verifiers = await Verifier.find(query);

//     if (!verifiers || verifiers.length === 0) {
//       return res.status(404).json({
//         message: "No verifiers found",
//       });
//     }

//     res.status(200).json({
//       message: "verifiers found",
//       verifiers,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       error: "Error while filtering verifiers",
//       message: err.message,
//     });
//   }
// };

// export const getVerifierByPhone = async (req, res) => {
//   const { contact } = req.query;

//   if (!contact) {
//     return res.status(409).json({
//       message: "Please provide contact",
//     });
//   }

//   const verifier = await Verifier.findOne({ contact: contact });
//   if (!verifier) {
//     return res.status(409).json({
//       message: "No Verifier found with given contact",
//     });
//   }
//   const token = generateToken({ id: verifier._id });
//   try {
//     if (!token) {
//       return res.status(404).json({
//         error: "error while generating token",
//       });
//     }

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       verifier: verifier,
//     });
//   } catch (err) {
//     console.error(err);
//     logger?.error?.(err);

//     return res.status(500).json({
//       message: "Error while fetching verifier",
//       error: err.message,
//     });
//   }
// };

// // New function to fetch verifiers by multiple IDs
// export const getVerifiersByIds = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         message: "Please provide a valid array of verifier IDs",
//       });
//     }

//     // Validate that all IDs are valid MongoDB ObjectIds
//     const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

//     if (validIds.length === 0) {
//       return res.status(400).json({
//         message: "No valid verifier IDs provided",
//       });
//     }

//     const verifiers = await Verifier.find({
//       _id: { $in: validIds },
//     });

//     if (verifiers.length === 0) {
//       return res.status(404).json({
//         message: "No verifiers found for the provided IDs",
//       });
//     }

//     // Check if any requested IDs were not found
//     const foundIds = verifiers.map((verifier) => verifier._id.toString());
//     const notFoundIds = validIds.filter((id) => !foundIds.includes(id));

//     return res.status(200).json({
//       message: "Verifiers fetched successfully",
//       data: verifiers,
//       metadata: {
//         totalRequested: ids.length,
//         validIds: validIds.length,
//         found: verifiers.length,
//         notFound: notFoundIds.length,
//         notFoundIds: notFoundIds.length > 0 ? notFoundIds : undefined,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     logger?.error?.(err);

//     return res.status(500).json({
//       message: "Error while fetching verifiers by IDs",
//       error: err.message,
//     });
//   }
// };