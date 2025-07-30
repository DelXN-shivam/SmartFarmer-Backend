import Joi from 'joi';

export const verifierValidationSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  age : Joi.number(),
  contact: Joi.string().pattern(/^[0-9]{10}$/).optional(), // assuming 10-digit mobile
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/).optional(),
  village: Joi.string().optional(),
  landMark: Joi.string().optional(),
  taluka: Joi.array().items(Joi.string()),
  district: Joi.string().optional(),
  state : Joi.string().optional(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).optional(),
  farmerId: Joi.array().items(Joi.string()).default([]),
  cropId: Joi.array().items(Joi.string()).default([]),
});

export const updateVerifierValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  age : Joi.number(),
  contact: Joi.string().pattern(/^[0-9]{10}$/),
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/),
  village: Joi.string(),
  landMark: Joi.string(),
  taluka: Joi.array().items(Joi.string()),
  district: Joi.string(),
  state: Joi.string(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),

  password: Joi.string().min(6),

  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
  role : Joi.string().valid('farmer' , 'verifier')
}).min(1); // require at least one field to update

export const loginVerifierValidation = Joi.object({
  email : Joi.string().email(),
  password : Joi.string()
})