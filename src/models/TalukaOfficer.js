import mongoose from "mongoose";

const talukaOfficerSchema = new mongoose.Schema(
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
    password: {
      type: String,
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
    verifierId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verifier",
      },
    ],
    role: {
      type: String,
      default: "talukaOfficer",
    },
  },
  {
    timestamps: true,
  }
);

const TalukaOfficer =
  mongoose.models.TalukaOfficer ||
  mongoose.model("TalukaOfficer", talukaOfficerSchema);

export default TalukaOfficer;
