import logger from '../config/logger.js';
import { generateToken } from '../middleware/authentication.js';
import Verifier from "../models/Verifier.js";
import bcrypt from 'bcryptjs';

export const verifierRegister = async ( req , res , next ) => {
    try {
        const body = req.body;

        const existingVerifier = await Verifier.findOne({email : body.email})
        if(existingVerifier){
            return res.status(409).json({
                message : "Verifier already registered"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await  bcrypt.hash(body.password , salt);
        body.password = hashedPassword
        const verifier = await Verifier.create(body);
        const token = generateToken({ id: verifier._id});

        return res.status(201).json({
            message : "New Verifier Created",
            verifier ,
            token
        })        
    }
    catch (err){
        logger.error(err);
        console.error(err)
        next(err);
        return res.status(500).json({
            error : "Error while verifier register" , err
        })
    }
}

export const getVerifier = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({
        message: "Please pass a valid ID"
      });
    }

    const verifier = await Verifier.findById(id);

    if (!verifier) {
      return res.status(404).json({
        message: "Verifier not found"
      });
    }

    return res.status(200).json({
      message: "Verifier found",
      verifier
    });

  } catch (err) {
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching verifier",
      error: err.message
    });
  }
};

export  const updateVerifier = async ( req , res , next ) => {
    try {
        const id = req.params.id;

    const existingVerifier = await Verifier.findById(id);
    if(!existingVerifier){
        return res.status(402).json({
            message : "Verifier does not exist , no verifier found"
        })
    }

    const updateVerifier = await Verifier.findByIdAndUpdate(id , req.body, {
        new : true
    })

    if(!updateVerifier){
        return res.status(402).json({
            message : "Error while updating verifier"
        })
    }

    return res.status(200).json({
        message : "Verifier Updated Successfully",
        verifier : updateVerifier
    })
    }
    catch (err){
    console.error(err);
    logger.error(err);

    return res.status(500).json({
      message: "Error while fetching verifier",
      error: err.message
    });
    }
}

export const getVerifiers = async (req, res, next) => {
  try {
    const verifiers = await Verifier.find();

    if (verifiers.length === 0) {
      return res.status(404).json({
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

export const verifierLogin = async ( req , res ) => {
  try {
    const {email , password} = req.body;

  if(!email || !password){
    return res.status(404).json({
      error : "please send email and password"
    })
  }
  const existingVerifier = await Verifier.findOne({email});
  if(!existingVerifier){
    return res.status(404).json({
      error : "No verifier found"
    })
  }
  const confirmPassword = bcrypt.compare(password , existingVerifier.password )
  if(!confirmPassword){
    return res.status(404).json({
      message : "Password does not match"
    })
  }

  const token = generateToken({id : existingVerifier._id});
  if(!token){
    return res.status(404).json({
      error : "error while generating token"
    })
  }

  return res.status(200).json({
      message: 'Login successful',
      token,
      verifier: {
        id: existingVerifier._id,
        name: existingVerifier.name,
        email: existingVerifier.email,
      },
    });
  } catch (err){
    console.error(err);
    logger?.error?.(err);

    return res.status(500).json({
      message: "Error while verifier login",
      error: err.message,
    });
  }
}
