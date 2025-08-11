import mongoose from 'mongoose';
import dayjs from 'dayjs';

const cropSchema = new mongoose.Schema({
  name: { type: String },
  area: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['acre', 'guntha'],
      required: true
    }
  },
  sowingDate: { type: Date },
  expectedFirstHarvestDate: { type: Date },
  expectedLastHarvestDate: { type: Date },
  expectedYield: { 
   value : {
     type: Number
   } , 
  unit : {
    type : String,
    enum : ['kg' , 'carat' , 'quintal' , 'ton']
  }
    
  },
  previousCrop: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  images: { type: [String] },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  applicationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },

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
