import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "superAdmin",
      enum: ["superAdmin"] // fixed role
    }
  },
  { timestamps: true }
);

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);