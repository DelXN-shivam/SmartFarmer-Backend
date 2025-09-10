import Joi from 'joi';

export const districtOfficerValidationSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  age: Joi.number().optional(),
  contact: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  password: Joi.string().min(6).required(),
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/).optional(),
  village: Joi.string().optional(),
  landMark: Joi.string().optional(),
  taluka: Joi.string().optional(),
  district: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).optional(),
  farmerId: Joi.array().items(Joi.string()).default([]),
  talukaOfficersId: Joi.array().items(Joi.string()).default([]),
});

export const updateDistrictOfficerValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  age: Joi.number(),
  contact: Joi.string().pattern(/^[0-9]{10}$/),
  password: Joi.string().min(6),
  aadhaarNumber: Joi.string().length(12).pattern(/^[0-9]+$/),
  village: Joi.string(),
  landMark: Joi.string(),
  taluka: Joi.string(),
  district: Joi.string(),
  state: Joi.string(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),
  farmerId: Joi.array().items(Joi.string()),
  talukaOfficersId: Joi.array().items(Joi.string())
}).min(1);

export const loginDistrictOfficerValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const addTalukaOfficerValidation = Joi.object({
  districtOfficerId: Joi.string().required(),
  talukaOfficerId: Joi.string().required()
});