import mongoose from "mongoose";

const ExpiredCropSchema = new mongoose.Schema({
  name: String,
  acres: Number,
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