import express from 'express'
import { registerDistrictOfficer } from '../controllers/districtOfficerController.js';
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';

export const districtOfficerRouter = express.Router();

districtOfficerRouter.post("/register" ,  registerDistrictOfficer)

districtOfficerRouter.get("/dashboard", verifyAccessToken, (req, res) => {
    res.json({
        message: `Welcome to the dashboard, user ${req.user.id}`,
        role: req.user.role
    });
});