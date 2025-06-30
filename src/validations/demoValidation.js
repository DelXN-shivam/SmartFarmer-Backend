import Joi from "joi";

export const demoSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  fullName: Joi.string().required(),

  lastName: Joi.string().optional(),

  age: Joi.number().integer().min(0).max(120).required(),

  gender: Joi.string()
    .valid("male", "female", "other", "prefer_not_to_say")
    .required(),

  role: Joi.string()
    .valid("admin", "user", "guest", "editor", "moderator")
    .required(),

  status: Joi.string()
    .valid("active", "inactive", "banned", "pending", "deleted")
    .default("active"),

  subscriptionPlan: Joi.string()
    .valid("free", "basic", "premium", "enterprise")
    .default("free"),

  deviceType: Joi.string()
    .valid("mobile", "desktop", "tablet", "wearable")
    .default("desktop"),

  interests: Joi.array().items(Joi.string()).min(1).required(),

  address: Joi.object({
    city: Joi.string().required(),
    zipcode: Joi.string().min(5).max(10).required()
  }).required(),

  isSubscribed: Joi.boolean().required(),

  tags: Joi.array().items(Joi.string()).optional(),

  preferences: Joi.object({
    notifications: Joi.boolean().required(),
    theme: Joi.string().valid("light", "dark").default("light")
  }).required()
});

export const updateDemoSchema = Joi.object({
  name: Joi.string().min(2).max(50),

  email: Joi.string().email(),

  password: Joi.string().min(6),

  fullName: Joi.string(),

  lastName: Joi.string(),

  age: Joi.number().integer().min(0).max(120),

  gender: Joi.string().valid("male", "female", "other", "prefer_not_to_say"),

  role: Joi.string().valid("admin", "user", "guest", "editor", "moderator"),

  status: Joi.string().valid("active", "inactive", "banned", "pending", "deleted"),

  subscriptionPlan: Joi.string().valid("free", "basic", "premium", "enterprise"),

  deviceType: Joi.string().valid("mobile", "desktop", "tablet", "wearable"),

  interests: Joi.array().items(Joi.string()),

  address: Joi.object({
    city: Joi.string(),
    zipcode: Joi.string().min(5).max(10)
  }),

  isSubscribed: Joi.boolean(),

  tags: Joi.array().items(Joi.string()),

  preferences: Joi.object({
    notifications: Joi.boolean(),
    theme: Joi.string().valid("light", "dark")
  })
}).min(1); // Require at least one field to update
