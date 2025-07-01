// validations/cropValidation.js
import Joi from 'joi';

export const cropValidationSchema = Joi.object({
  name: Joi.string().required(),
  acres: Joi.number().positive().required(),
  cropType: Joi.string().required(),
  soilType: Joi.string().required(),
  sowingDate: Joi.date().iso().required(), // expects YYYY-MM-DD format
  expectedHarvestDate: Joi.date().iso().required(),
  expectedYield: Joi.number().positive().optional(),
  previousCrop: Joi.string().optional(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  images: Joi.array().items(Joi.string().uri()).length(3).required() // exactly 3 image URLs
});
