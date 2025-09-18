
// controllers/cropController.js
import mongoose from 'mongoose';
import Crop from '../models/Crop.js';
import Farmer from '../models/Farmer.js';
import Verifier from '../models/Verifier.js';
import TalukaOfficer from "../models/TalukaOfficer.js";
import { assignCropToVerifiers, removeCropFromVerifiers } from '../utils/verifierAssignment.js';

export const addCrop = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (!farmerId) {
      return res.json({ message: "Please provide valid FarmerId" });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(409).json({ error: "Farmer with given id does not exist" });
    }

    const cropData = req.body;
    cropData.farmerId = farmerId;

    const newCrop = await Crop.create(cropData);

    await Farmer.findByIdAndUpdate(farmerId, {
      $push: { crops: newCrop._id }
    });

    // Find taluka officers in the same taluka
    const matchingTalukaOfficers = await TalukaOfficer.find(
      { taluka: farmer.taluka },
      { _id: 1 }
    );

    const talukaOfficerIds = matchingTalukaOfficers.map(officer => officer._id);

    // Update the matching taluka officers with the crop ID
    const updatedTalukaOfficers = await TalukaOfficer.updateMany(
      { taluka: farmer.taluka },
      { $addToSet: { cropId: newCrop._id } }
    );

    // Assign crop to verifiers based on district and allocated talukas
    const verifierAssignment = await assignCropToVerifiers(farmer, newCrop._id);

    return res.status(201).json({
      message: "Crop added and linked to farmer successfully",
      data: newCrop,
      updatedTalukaOfficerIds: talukaOfficerIds,
      talukaOfficerDetails: updatedTalukaOfficers,
      verifierAssignment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to add crop",
      error: err.message
    });
  }
};

export const updateCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(409).json({
        message: "Crop with given ID does not exist"
      });
    }

    let updateData = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(typeof value === "object" && Object.keys(value).length === 0)
      ) {
        updateData[key] = value;
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid data provided to update." });
    }

    const updatedCrop = await Crop.findByIdAndUpdate(cropId, { $set: updateData }, { new: true });

    return res.status(200).json({
      message: "Crop updated successfully",
      updatedCrop
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Error while updating crop",
      message: err.message
    });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const { cropId } = req.params;

    if (!cropId) {
      return res.status(409).json({
        message: "Please pass a cropId"
      })
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(409).json({
        message: "Crop dose not exist for the given Id"
      })
    }

    // Remove crop from verifiers before deleting
    const verifierRemoval = await removeCropFromVerifiers(cropId);

    // Remove crop from farmer's crops array
    await Farmer.findByIdAndUpdate(crop.farmerId, {
      $pull: { crops: cropId }
    });

    // Remove crop from taluka officers
    await TalukaOfficer.updateMany(
      { cropId: cropId },
      { $pull: { cropId: cropId } }
    );

    const deletedCrop = await Crop.findByIdAndDelete(cropId);
    if (!deletedCrop) {
      return res.status(409).json({
        message: "Cannot delete Crop , please try again"
      })
    }

    return res.status(200).json({
      message: "Crop deleted successfully",
      verifierRemoval
    })
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while deleting Crop"
    })
  }
};

const formatInput = (value) => {
  if (!value) return value;
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const filterCrop = async (req, res) => {
  try {
    const { state, district, taluka, village } = req.query;
    const query = {};

    if (state) query.state = formatInput(state);
    if (district) query.district = formatInput(district);
    if (taluka) query.taluka = formatInput(taluka);
    if (village) query.village = formatInput(village);

    const crops = await Crop.find(query);

    if (!crops || crops.length === 0) {
      return res.status(404).json({
        message: "No crops found for the given filters"
      });
    }

    return res.status(200).json({
      message: "Crops found",
      crops
    });

  } catch (err) {
    console.error("Crop filtering error:", err);
    return res.status(500).json({
      error: "Error while filtering crops",
      message: err.message
    });
  }
};

export const getCrop = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({
        message: "Please pass a valid ID"
      });
    }

    const crop = await Crop.findById(id);

    if (!crop) {
      return res.status(404).json({
        message: "crop not found"
      });
    }

    return res.status(200).json({
      message: "crop found",
      crop
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error while fetching crop",
      error: err.message
    });
  }
};

export const getCropsByIds = async (req, res) => {
  try {
    let ids = req.body.ids || req.query.ids;

    if (!ids) {
      return res.status(400).json({ message: "No crop IDs provided" });
    }

    if (typeof ids === 'string') {
      ids = ids.split(',').map(id => id.trim());
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid crop IDs provided" });
    }

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return res.status(400).json({ message: "No valid MongoDB Object IDs provided" });
    }

    const crops = await Crop.find({ _id: { $in: validIds } });

    return res.status(200).json({
      message: "Crops fetched successfully",
      crops,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while fetching crops by IDs",
      error: err.message,
    });
  }
};

export const getCropsByFarmerId = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (!farmerId) {
      return res.status(400).json({ message: "No farmerId provided" });
    }
    const crops = await Crop.find({ farmerId });
    return res.status(200).json({
      message: "Crops fetched successfully",
      crops
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while fetching crops by farmerId",
      error: err.message
    });
  }
};

export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    return res.status(200).json({
      message: "All crops fetched successfully",
      crops
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while fetching all crops",
      error: err.message
    });
  }
};

// ✅ New: Get Recent Crops
export const getRecentCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .sort({ createdAt: -1 }) // Sort by most recent first
      .limit(5)
      .populate('farmerId', 'name'); // Optional: populate farmer name

    console.log("Fetched recent crops:", crops);

    return res.status(200).json({
      message: "Recent crops fetched successfully",
      crops
    });
  } catch (err) {
    console.error("Error fetching recent crops:", err);
    return res.status(500).json({
      message: "Error while fetching recent crops",
      error: err.message
    });
  }
};

// Test endpoint to verify verifier-crop assignments
export const testVerifierAssignments = async (req, res) => {
  try {
    const verifiers = await Verifier.find()
      .populate('cropId', 'name farmerId')
      .populate({
        path: 'cropId',
        populate: {
          path: 'farmerId',
          select: 'name district taluka'
        }
      });

    const assignmentSummary = verifiers.map(verifier => ({
      verifierId: verifier._id,
      verifierName: verifier.name,
      district: verifier.district,
      allocatedTalukas: verifier.allocatedTaluka,
      assignedCropsCount: verifier.cropId.length,
      assignedCrops: verifier.cropId.map(crop => ({
        cropId: crop._id,
        cropName: crop.name,
        farmerName: crop.farmerId?.name,
        farmerDistrict: crop.farmerId?.district,
        farmerTaluka: crop.farmerId?.taluka
      }))
    }));

    return res.status(200).json({
      message: "Verifier-crop assignments retrieved successfully",
      data: assignmentSummary
    });
  } catch (err) {
    console.error("Error testing verifier assignments:", err);
    return res.status(500).json({
      message: "Error while testing verifier assignments",
      error: err.message
    });
  }
};


















// // controllers/cropController.js
// import mongoose from 'mongoose';
// import Crop from '../models/Crop.js';
// import Farmer from '../models/Farmer.js';
// import Verifier from '../models/Verifier.js';
// import TalukaOfficer from "../models/TalukaOfficer.js"


// export const addCrop = async (req, res) => {
//   try {
//     const { farmerId } = req.params;
//     if (!farmerId) {
//       return res.json({ message: "Please provide valid FarmerId" });
//     }

//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(409).json({ error: "Farmer with given id does not exist" });
//     }

//     const cropData = req.body;
//     cropData.farmerId = farmerId;

//     const newCrop = await Crop.create(cropData);

//     await Farmer.findByIdAndUpdate(farmerId, {
//       $push: { crops: newCrop._id }
//     });

//     // Find taluka officers in the same taluka
//     const matchingTalukaOfficers = await TalukaOfficer.find(
//       { taluka: farmer.taluka },
//       { _id: 1 }
//     );

//     const talukaOfficerIds = matchingTalukaOfficers.map(officer => officer._id);

//     // Update the matching taluka officers with the crop ID
//     const updatedTalukaOfficers = await TalukaOfficer.updateMany(
//       { taluka: farmer.taluka },
//       { $addToSet: { cropId: newCrop._id } } // fixed field name
//     );

//     return res.status(201).json({
//       message: "Crop added and linked to farmer successfully",
//       data: newCrop,
//       updatedTalukaOfficerIds: talukaOfficerIds,
//       talukaOfficerDetails: updatedTalukaOfficers
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Failed to add crop",
//       error: err.message
//     });
//   }
// };



// export const updateCrop = async (req, res) => {
//   try {
//     const { cropId } = req.params;

//     // 1. Check if crop exists
//     const crop = await Crop.findById(cropId);
//     if (!crop) {
//       return res.status(409).json({
//         message: "Crop with given ID does not exist"
//       });
//     }

//     let updateData = {};
//     Object.entries(req.body).forEach(([key, value]) => {
//       if (
//         value !== "" &&
//         value !== null &&
//         value !== undefined &&
//         !(typeof value === "object" && Object.keys(value).length === 0)
//       ) {
//         updateData[key] = value;
//       }
//     });

//     if (Object.keys(updateData).length === 0) {
//       return res.status(400).json({ message: "No valid data provided to update." });
//     }

//     // 3. Perform update
//     const updatedCrop = await Crop.findByIdAndUpdate(cropId, { $set: updateData }, { new: true });

//     return res.status(200).json({
//       message: "Crop updated successfully",
//       updatedCrop
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       error: "Error while updating crop",
//       message: err.message
//     });
//   }
// };

// export const deleteCrop = async (req, res) => {
//   try {
//     const { cropId } = req.params;

//     if (!cropId) {
//       return res.status(409).json({
//         message: "Please pass a cropId"
//       })
//     }

//     const crop = await Crop.findById(cropId);
//     if (!crop) {
//       return res.status(409).json({
//         message: "Crop dose not exist for the given Id"
//       })
//     }

//     const deletedCrop = await Crop.findByIdAndDelete(cropId);
//     if (!deletedCrop) {
//       return res.status(409).json({
//         message: "Cannot delete Crop , please try again"
//       })
//     }

//     return res.status(200).json({
//       message: "Crop deleted Succesfully"
//     })
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Erro while deleting Crop"
//     })
//   }
// }

// const formatInput = (value) => {
//   if (!value) return value;
//   return value
//     .toLowerCase()
//     .split(' ')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// export const filterCrop = async (req, res) => {
//   try {
//     const {
//       state,
//       district,
//       taluka,
//       village,
//     } = req.query;

//     const query = {};

//     // Apply location filters
//     if (state) query.state = formatInput(state);
//     if (district) query.district = formatInput(district);
//     if (taluka) query.taluka = formatInput(taluka);
//     if (village) query.village = formatInput(village);

//     const crops = await Crop.find(query);

//     if (!crops || crops.length === 0) {
//       return res.status(404).json({
//         message: "No crops found for the given filters"
//       });
//     }

//     return res.status(200).json({
//       message: "Crops found",
//       crops
//     });

//   } catch (err) {
//     console.error("Crop filtering error:", err);
//     return res.status(500).json({
//       error: "Error while filtering crops",
//       message: err.message
//     });
//   }
// };


// export const getCrop = async (req, res) => {
//   try {
//     const id = req.params.id;

//     if (!id) {
//       return res.status(403).json({
//         message: "Please pass a valid ID"
//       });
//     }

//     const crop = await Crop.findById(id);

//     if (!crop) {
//       return res.status(404).json({
//         message: "crop not found"
//       });
//     }

//     return res.status(200).json({
//       message: "crop found",
//       crop
//     });

//   } catch (err) {
//     console.error(err);
//     logger.error(err);

//     return res.status(500).json({
//       message: "Error while fetching crop",
//       error: err.message
//     });
//   }
// };

// export const getCropsByIds = async (req, res) => {
//   try {
//     let ids = req.body.ids || req.query.ids;

//     if (!ids) {
//       return res.status(400).json({ message: "No crop IDs provided" });
//     }

//     // If ids is a string (e.g. "id1,id2,id3"), split it
//     if (typeof ids === 'string') {
//       ids = ids.split(',').map(id => id.trim());
//     }

//     // Ensure it's an array and not empty
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: "Invalid crop IDs provided" });
//     }

//     // Optional: Validate ObjectId format
//     const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

//     if (validIds.length === 0) {
//       return res.status(400).json({ message: "No valid MongoDB Object IDs provided" });
//     }

//     const crops = await Crop.find({ _id: { $in: validIds } });

//     return res.status(200).json({
//       message: "Crops fetched successfully",
//       crops,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Error while fetching crops by IDs",
//       error: err.message,
//     });
//   }
// };

// export const getCropsByFarmerId = async (req, res) => {
//   try {
//     const { farmerId } = req.params;
//     if (!farmerId) {
//       return res.status(400).json({ message: "No farmerId provided" });
//     }
//     const crops = await Crop.find({ farmerId });
//     return res.status(200).json({
//       message: "Crops fetched successfully",
//       crops
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Error while fetching crops by farmerId",
//       error: err.message
//     });
//   }
// };

// export const getAllCrops = async (req, res) => {
//   try {
//     const crops = await Crop.find();
//     return res.status(200).json({
//       message: "All crops fetched successfully",
//       crops
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Error while fetching all crops",
//       error: err.message
//     });
//   }
// };