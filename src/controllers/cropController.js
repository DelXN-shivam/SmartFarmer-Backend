// controllers/cropController.js
import Crop from '../models/Crop.js';
import Farmer from '../models/Farmer.js';

export const addCrop = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if(farmerId.length == 0){
        return res.json({
            message : "Please provide valid FarmerId"
        })
    }

    const farmer = await Farmer.findById(farmerId);
    if(!farmer){
        return res.status(409).json({
            error : "Farmer with given id does not exist"
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
