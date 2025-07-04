import mongoose from 'mongoose';

const verifierSchema = new mongoose.Schema({
  name: {
    type: String, 
    //  required: true
    },
  email: {
    type: String,
    unique: true
  },
  contact: {
    type: String,
    // required: true,
    unique: true
  },
  aadhaarNumber: { 
    type: String ,
    unique : true
  }, 
  age : {
    type : Number
  },
  village: {
    type: String
  },
  landMark: {
    type: String
  },
  taluka: {
    type: String
  },
  district: {
    type: String
  },
  state : {
    type  : String
  } ,
  pincode: {
    type: String
  },
  password: { 
    type: String, 
    // required: true
  },
  location: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  role : {
    type : String ,
    enum : ['farmer' , 'verifier']
  },
  isVerified: { type: Boolean, default: false },
  submittedDocuments: [{ type: String }], 
  applicationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
} , {
  timestamps : true
} );

const Verifier = mongoose.models.Verifier || mongoose.model("Verifier", verifierSchema);
export default Verifier;
