// validations/cropValidation.js
import Joi from 'joi';

export const cropValidationSchema = Joi.object({
  name: Joi.string().required(),

  area: Joi.object({
    value: Joi.number().positive().required(),
    unit: Joi.string().valid('acre', 'guntha').required()
  }).required(),

  sowingDate: Joi.date().iso().required(),

  expectedFirstHarvestDate: Joi.date().iso().required(),
  expectedLastHarvestDate: Joi.date().iso().required(),

  expectedYield: Joi.number().positive().optional(),
  previousCrop: Joi.string().optional(),

  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),

  images: Joi.array().items(Joi.string().uri()).min(1).max(3).required()
  
}).custom((value, helpers) => {
  if (value.expectedFirstHarvestDate > value.expectedLastHarvestDate) {
    return helpers.error('any.invalid', {
      message: 'expectedLastHarvestDate must be after or same as expectedFirstHarvestDate'
    });
  }
  return value;
});
