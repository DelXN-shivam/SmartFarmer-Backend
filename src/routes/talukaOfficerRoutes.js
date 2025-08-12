import express from 'express'
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';
import { authorizeRoles } from "../middleware/roleMiddleware.js";

export const talukaOfficerRouter = express.Router();

talukaOfficerRouter.get("/super-secret", verifyAccessToken, authorizeRoles("talukaOfficer"), (req, res) => {
    res.json({ message: "Welcome, Taluka Officer!" });
});