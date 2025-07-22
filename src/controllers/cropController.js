// controllers/cropController.js
import Crop from '../models/Crop.js';
import Farmer from '../models/Farmer.js';

export const addCrop = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (farmerId.length == 0) {
      return res.json({
        message: "Please provide valid FarmerId"
      })
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(409).json({
        error: "Farmer with given id does not exist"
      })
    }

    const cropData = req.body;
    cropData.farmerId = farmerId;

    const newCrop = await Crop.create(cropData);

    await Farmer.findByIdAndUpdate(farmerId, {
      $push: { crops: newCrop._id }
    });

    return res.status(201).json({
      message: "Crop added and linked to farmer successfully",
      data: newCrop
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

    // 1. Check if crop exists
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

    // 3. Perform update
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

    const deletedCrop = await Crop.findByIdAndDelete(cropId);
    if (!deletedCrop) {
      return res.status(409).json({
        message: "Cannot delete Crop , please try again"
      })
    }

    return res.status(200).json({
      message: "Crop deleted Succesfully"
    })
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Erro while deleting Crop"
    })
  }
}

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
    const {
      state,
      district,
      taluka,
      village,
    } = req.query;

    const query = {};

    // Apply location filters
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
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching crop",
      error: err.message
    });
  }
};

export const getCropsByIds = async (req, res) => {
  try {
    // Accept IDs from either query (?ids=1,2,3) or body (ids: [1,2,3])
    let ids = req.body.ids || req.query.ids;
    if (!ids) {
      return res.status(400).json({ message: "No crop IDs provided" });
    }
    // If ids is a string (from query), split by comma
    if (typeof ids === 'string') {
      ids = ids.split(',').map(id => id.trim());
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid crop IDs provided" });
    }
    // Find crops by IDs
    const crops = await Crop.find({ _id: { $in: ids } });
    return res.status(200).json({
      message: "Crops fetched successfully",
      crops
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while fetching crops by IDs",
      error: err.message
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