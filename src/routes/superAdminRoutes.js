import express from 'express'
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { verifyCookieToken } from '../middleware/verifyCookie.js';

export const superAdminRouter = express.Router()

superAdminRouter.get("/super-secret", verifyCookieToken , authorizeRoles("superAdmin"), (req, res) => {
    res.json({ message: "Welcome, Super Admin!" });
});