import { generateToken } from "../middleware/authentication.js";
import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from 'bcryptjs'

export const adminRegister = async (req, res) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(409).json({
                message: "Please pass the required inputs"
            })
        }

        const existingAdmin = await Admin.findOne({ email: body.email });
        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        body.password = hashedPassword
        const admin = await Admin.create(body);
        const token = generateToken({ id: admin._id });

        return res.status(200).json({
            message: "Admin registered",
            data: admin,
            token
        })
    } catch (err) {
        console.error(err);
        logger.error(err);

        return res.status(500).json({
            message: "Error while fetching farmer",
            error: err.message
        });
    }
}


export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "please send email and password"
            })
        }
        
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            return res.status(401).json({
                error: "No admin found"
            })
        }
        const confirmPassword = await bcrypt.compare(password, existingAdmin.password)
        if (!confirmPassword) {
            return res.status(401).json({
                message: "Password does not match"
            })
        }

        const token = generateToken({ id: existingAdmin._id,
            role: 'admin', email: existingAdmin.email
         });
        if (!token) {
            return res.status(404).json({
                error: "error while generating token"
            })
        }

        // Set token in HTTP-only cookie for browser clients
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });


        return res.status(200).json({
            message: 'Login successful',
            token, // Return in body for mobile apps
            data: existingAdmin
        });
    } catch (err) {
        console.error(err);
        logger?.error?.(err);

        return res.status(500).json({
            message: "Error while admin login",
            error: err.message,
        });
    }
}
