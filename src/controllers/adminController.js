import { generateToken } from "../middleware/authentication.js";
import Admin from "../models/Admin.js";
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
            return res.status(404).json({
                error: "please send email and password"
            })
        }
        
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            return res.status(404).json({
                error: "No admin found"
            })
        }
        const confirmPassword = bcrypt.compare(password, existingAdmin.password)
        if (!confirmPassword) {
            return res.status(404).json({
                message: "Password does not match"
            })
        }

        const token = generateToken({ id: existingAdmin._id });
        if (!token) {
            return res.status(404).json({
                error: "error while generating token"
            })
        }

        return res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: existingAdmin._id,
                name: existingAdmin.name,
                email: existingAdmin.email,
            },
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
