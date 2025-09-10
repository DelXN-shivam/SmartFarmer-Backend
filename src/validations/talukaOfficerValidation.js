import Joi from 'joi';

export const talukaOfficerValidationSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  age: Joi.number(),
  contact: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  password: Joi.string().min(6).required(), // Changed to required for registration
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/).optional(),
  village: Joi.string().optional(),
  landMark: Joi.string().optional(),
  taluka: Joi.string().optional(),
  allocatedTaluka: Joi.array().items(Joi.string()).optional(),
  district: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).optional(),
  farmerId: Joi.array().items(Joi.string()).default([]),
  cropId: Joi.array().items(Joi.string()).default([]),
  role: Joi.string().default('talukaOfficer')
});

export const updateTalukaOfficerValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  age: Joi.number(),
  contact: Joi.string().pattern(/^[0-9]{10}$/),
  password: Joi.string().min(6), // Keep optional for updates
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/),
  village: Joi.string(),
  landMark: Joi.string(),
  taluka: Joi.string(),
  allocatedTaluka: Joi.array().items(Joi.string()),
  district: Joi.string(),
  state: Joi.string(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),
  role: Joi.string().valid('talukaOfficer')
}).min(1);

export const loginTalukaOfficerValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});