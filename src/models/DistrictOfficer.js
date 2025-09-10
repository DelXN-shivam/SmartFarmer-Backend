import mongoose, { mongo } from "mongoose";

const districtOfficerSchema = mongoose.Schema(
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
      default: "districtOfficer",
    },
    farmerId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        //unique : true,
        ref: "Farmer",
      },
    ],
    talukaOfficersId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TalukaOfficer",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DistrictOfficer =
  mongoose.models.DistrictOfficer ||
  mongoose.model("DistrictOfficer", districtOfficerSchema);

export default DistrictOfficer;
