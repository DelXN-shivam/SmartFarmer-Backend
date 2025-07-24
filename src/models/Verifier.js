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
  }
} , {
  timestamps : true
} );

const Verifier = mongoose.models.Verifier || mongoose.model("Verifier", verifierSchema);
export default Verifier;
