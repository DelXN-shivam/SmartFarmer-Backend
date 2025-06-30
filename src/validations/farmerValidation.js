import Joi from 'joi';

export const farmerValidationSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  contact: Joi.string().pattern(/^[0-9]{10}$/).optional(), // assuming 10-digit mobile
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/).optional(),
  village: Joi.string().optional(),
  landMark: Joi.string().optional(),
  taluka: Joi.string().optional(),
  district: Joi.string().optional(),
  state : Joi.string().optional(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).optional(),

  password: Joi.string().min(6).optional(),

  location: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
  }).optional(),

  isVerified: Joi.boolean().optional(),
  submittedDocuments: Joi.array().items(Joi.string()).optional(),
  applicationStatus: Joi.string().valid('pending', 'verified', 'rejected').optional()
});

export const updateFarmerValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  contact: Joi.string().pattern(/^[0-9]{10}$/),
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/),
  village: Joi.string(),
  landMark: Joi.string(),
  taluka: Joi.string(),
  district: Joi.string(),
  state: Joi.string(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),

  password: Joi.string().min(6),

  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),

  isVerified: Joi.boolean(),
  submittedDocuments: Joi.array().items(Joi.string()),
  applicationStatus: Joi.string().valid('pending', 'verified', 'rejected')
}).min(1); // require at least one field to update
