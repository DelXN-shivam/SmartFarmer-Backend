import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
} , {
  timestamps : true
});

const Admin =  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
