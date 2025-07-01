import mongoose from 'mongoose';
import dayjs from 'dayjs';

const cropSchema = new mongoose.Schema({
  name: { type: String },
  acres: { type: Number },
  cropType: { type: String },
  soilType: { type: String },
  sowingDate: { type: Date },  
  expectedHarvestDate: { type: Date },  
  expectedYield: { type: Number },
  previousCrop: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  images: { type: [String] },
  farmerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Farmer',
  required: true
}

}, {
  timestamps: true
});


cropSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.sowingDate = dayjs(obj.sowingDate).format('DD-MM-YYYY');
  obj.expectedHarvestDate = dayjs(obj.expectedHarvestDate).format('DD-MM-YYYY');
  return obj;
};


const Crop = mongoose.models.Crop || mongoose.model("Crop", cropSchema);
export default Crop;
