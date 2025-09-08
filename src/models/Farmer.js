import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //  required: true
    },
    // email: {
    //   type: String,
    //   unique: true
    // },
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
    },
    landMark: {
      type: String,
    },
    taluka: {
      type: String,
    },
    district: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    // password: {
    //   type: String,
    //   // required: true
    // },
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    role: {
      type: String,
      default: "farmer",
    },
    isVerified: { type: Boolean, default: false },
    submittedDocuments: [{ type: String }],
    applicationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    // models/Farmer.js
    crops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crop",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Farmer = mongoose.models.Farmer || mongoose.model("Farmer", farmerSchema);
export default Farmer;
