import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  permissions: [{ type: String }], // ['viewFarmers', 'approveApplications', 'assignVerifiers', etc.]
  createdAt: { type: Date, default: Date.now }
});

const Admin =  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
