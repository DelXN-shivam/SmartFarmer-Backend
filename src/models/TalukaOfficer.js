import mongoose from 'mongoose';

const talukaSchema = new mongoose.Schema({
  name: {
    type: String, 
    //  required: true
    },
  email: {
    type: String,
    unique: true,
    lowercase : true
  },
  contact: {
    type: String,
    // required: true,
    unique: true
  },
  password : {
    type : String
  } , 
  aadhaarNumber: { 
    type: String ,
    unique : true
  }, 
  age : {
    type : Number
  },
  village: {
    type: String,
    lowercase : true
  },
  landMark: {
    type: String
  },
  taluka : {
    type : String,
    lowercase : true
  } ,
  allocatedTaluka: {
    type: [String],
    lowercase : true
  },
  district: {
    type: String,
    lowercase : true
  },
  state : {
    type  : String,
    lowercase : true
  } ,
  pincode: {
    type: String
  } , 
  farmerId  : [
    {
      type : mongoose.Schema.Types.ObjectId,
      //unique : true,
      ref : 'Farmer'
    }
  ] , 
  cropId  : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Crop'
    }
  ]
} , {
  timestamps : true
} );

const Taluka = mongoose.model("TalukaOfficer", talukaSchema);
export default Taluka;
