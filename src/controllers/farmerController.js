import logger from '../config/logger.js';
import { generateToken } from '../middleware/authentication.js';
import Farmer from "../models/Farmer.js";



export const farmerRegister = async ( req , res , next ) => {
    try {
        const body = req.body;

        const existingFarmer = await Farmer.findOne({email : body.email})
        if(existingFarmer){
            return res.json({
                message : "Farmer already registered"
            } , 402)
        }

        const farmer = await Farmer.create(body);
        const token = generateToken({ id: farmer._id});

        return res.status(200).json({
            message : "New Farmer Created",
            farmer ,
            token
        })        
    }
    catch (err){
        logger.error(err);
        console.error(err)
        next(err);
        return res.status(500).json({
            error : "Error while farmer register" , err
        })
    }
}

export const getFarmer = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({
        message: "Please pass a valid ID"
      });
    }

    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer not found"
      });
    }

    return res.status(200).json({
      message: "Farmer found",
      farmer
    });

  } catch (err) {
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching farmer",
      error: err.message
    });
  }
};

export  const updateFarmer = async ( req , res , next ) => {
    try {
        const id = req.params.id;

    const existingFarmer = await Farmer.findById(id);
    if(!existingFarmer){
        return res.status(402).json({
            message : "Farmer does not exist , no farmer found"
        })
    }

    const updateFarmer = await Farmer.findByIdAndUpdate(id , req.body, {
        new : true
    })

    if(!updateFarmer){
        return res.status(402).json({
            message : "Error while updating farmer"
        })
    }

    return res.status(200).json({
        message : "Farmer Updated Successfully",
        farmer : updateFarmer
    })
    }
    catch (err){
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching farmer",
      error: err.message
    });
    }
}