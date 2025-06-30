import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  location: { type: String },
  landSize: { type: Number }, // in acres/hectares
  crops: [{ type: String }],
  aadhaarNumber: { type: String },
  isVerified: { type: Boolean, default: false },
  submittedDocuments: [{ type: String }], // URLs or filenames
  applicationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Farmer =  mongoose.models.Farmer || mongoose.model("Farmer", farmerSchema);
export default Farmer;
