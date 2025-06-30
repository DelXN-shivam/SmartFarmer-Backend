import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('farmer', 'admin', 'verifier').default('farmer')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  password: Joi.string().min(6),
  role: Joi.string().valid('farmer', 'admin', 'verifier')
}).min(1);
