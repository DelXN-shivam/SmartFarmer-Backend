import express from 'express'
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';
import { authorizeRoles } from "../middleware/roleMiddleware.js";

export const superAdminRouter = express.Router()

superAdminRouter.get("/super-secret", verifyAccessToken, authorizeRoles("superAdmin"), (req, res) => {
    res.json({ message: "Welcome, Super Admin!" });
});