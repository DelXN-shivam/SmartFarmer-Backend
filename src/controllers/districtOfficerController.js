import { DistrictOfficer } from "../models/DistrictOfficer.js";
import bcrypt from 'bcrypt'
import { generateTokens } from "../utils/generateToken.js";

export const registerDistrictOfficer = async (req, res) => {
    try {

        const body = req.body;

        if (!body) {
            return res.status(403).json({
                messsage: "Please pass in the required fields"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password , salt);
        if (!hashedPassword) {
            return res.status(400).json({
                message: "Error while hashing password"
            })
        }
        const newDistrictOfficer = await DistrictOfficer.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            age: body.age,
            contact: body.contact
        })

        if (!newDistrictOfficer) {
            return res.status(400).json({
                message: "Error while creating district officer"
            })
        }

        const officerData = newDistrictOfficer.toObject();
        delete officerData.password;

        return res.status(201).json({
            message: "District officer created",
            data: officerData
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Error while fetching farmer",
            error: err.message
        });
    }
}


export const loginDistrictOfficer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const officer = await DistrictOfficer.findOne({ email });
        if (!officer) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, officer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate tokens (pass user ID & role)
        const { accessToken, refreshToken } = generateTokens(officer._id, officer.role);

        // Store refresh token in cookie
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            message: "Login successful",
            accessToken,
            role : officer.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};