import mongoose from "mongoose";

const ExpiredCropSchema = new mongoose.Schema({
  name: String,
  acres: Number,
  cropType: String,
  soilType: String,
  sowingDate: Date,
  expectedHarvestDate: Date,
  expectedYield: Number,
  previousCrop: String,
  latitude: Number,
  longitude: Number,
  images: [String],
  farmerId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });


const ExpiredCrop = mongoose.model("ExpiredCrop", ExpiredCropSchema);

export default ExpiredCrop;