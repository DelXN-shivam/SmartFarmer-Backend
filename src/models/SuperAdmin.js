import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "superAdmin",
    },
  },
  { timestamps: true }
);

const SuperAdmin =
  mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;
