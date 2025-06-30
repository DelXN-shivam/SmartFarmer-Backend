import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  zipcode: { type: String, required: true, minlength: 5, maxlength: 10 },
});

const preferencesSchema = new mongoose.Schema({
  notifications: { type: Boolean, required: true },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
});

const demoSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  fullName: { type: String, required: true },
  lastName: { type: String },
  age: { type: Number, min: 0, max: 120, required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guest', 'editor', 'moderator'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned', 'pending', 'deleted'],
    default: 'active',
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free',
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'desktop', 'tablet', 'wearable'],
    default: 'desktop',
  },
  interests: [{ type: String }],
  address: { type: addressSchema, required: true },
  isSubscribed: { type: Boolean, required: true },
  tags: [{ type: String }],
  preferences: { type: preferencesSchema, required: true },
}, { timestamps: true });

const Demo =  mongoose.model.Demo || mongoose.model("Demo", demoSchema);

export default Demo;