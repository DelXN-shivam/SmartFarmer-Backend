import Joi from 'joi';

export const adminRegisterSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
});

export const loginAdminValidation = Joi.object({
  email : Joi.string().email(),
  password : Joi.string()
})