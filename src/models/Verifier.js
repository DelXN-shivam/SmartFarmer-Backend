import mongoose from 'mongoose';

const verifierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  region: { type: String },
  assignedApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' }],
  role: { type: String, default: 'verifier' },
  createdAt: { type: Date, default: Date.now }
});

const Verifier = mongoose.models.Verifier || mongoose.model("Verifier", verifierSchema);
export default Verifier;
