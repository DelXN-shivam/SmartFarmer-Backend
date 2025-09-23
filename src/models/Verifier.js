import mongoose from "mongoose";

const verifierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //  required: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    contact: {
      type: String,
      // required: true,
      unique: true,
    },
    aadhaarNumber: {
      type: String,
      unique: true,
    },
    age: {
      type: Number,
    },
    village: {
      type: String,
      lowercase: true,
    },
    landMark: {
      type: String,
    },
    taluka: {
      type: String,
      lowercase: true,
    },
    allocatedTaluka: {
      type: [String],
      lowercase: true,
    },
    district: {
      type: String,
      lowercase: true,
    },
    state: {
      type: String,
      lowercase: true,
    },
    pincode: {
      type: String,
    },
    role: {
      type: String,
      default: "verifier",
    },
    farmerId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        //unique : true,
        ref: "Farmer",
      },
    ],
    cropId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crop",
      },
    ],
    talukaOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TalukaOfficer",
    }
  },
  {
    timestamps: true,
  }
);

const Verifier =
  mongoose.models.Verifier || mongoose.model("Verifier", verifierSchema);

export default Verifier;
