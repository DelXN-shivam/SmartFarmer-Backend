
import mongoose, { mongo } from "mongoose";

const districtOfficerSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    contact: {
        type: Number
    },
    role: {
        type: String,
        default: "districtOfficer"
    }
})

export const DistrictOfficer = mongoose.model("DistrictOfficer", districtOfficerSchema); 