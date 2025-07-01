import logger from '../config/logger.js';
import { generateToken } from '../middleware/authentication.js';
import Farmer from "../models/Farmer.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const farmerRegister = async ( req , res , next ) => {
    try {
        const body = req.body;

        const existingFarmer = await Farmer.findOne({email : body.email})
        if(existingFarmer){
            return res.status(409).json({
                message : "Farmer already registered"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await  bcrypt.hash(body.password , salt);
        body.password = hashedPassword
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

export const getFarmers = async (req, res, next) => {
  try {
    const farmers = await Farmer.find();

    if (farmers.length === 0) {
      return res.status(404).json({
        message: "No farmers found",
      });
    }

    return res.status(200).json({
      message: "Farmers fetched successfully",
      data: farmers,
    });
  } catch (err) {
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while fetching farmers",
      error: err.message,
    });
  }
};

export const farmerLogin = async ( req , res ) => {
  try {
    const {email , password} = req.body;

  if(!email || !password){
    return res.status(404).json({
      error : "please send email and password"
    })
  }
  const existingFarmer = await Farmer.findOne({email});
  if(!existingFarmer){
    return res.status(404).json({
      error : "No farmer found"
    })
  }
  const confirmPassword = bcrypt.compare(password , existingFarmer.password )
  if(!confirmPassword){
    return res.status(404).json({
      message : "Password does not match"
    })
  }

  const token = generateToken({id : existingFarmer._id});
  if(!token){
    return res.status(404).json({
      error : "error while generating token"
    })
  }

  return res.status(200).json({
      message: 'Login successful',
      token,
      farmer: {
        id: existingFarmer._id,
        name: existingFarmer.name,
        email: existingFarmer.email,
      },
    });
  } catch (err){
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while fetching farmers",
      error: err.message,
    });
  }
}
