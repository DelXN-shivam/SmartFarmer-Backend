import express from 'express'
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { verifyCookieToken } from '../middleware/verifyCookie.js';

export const talukaOfficerRouter = express.Router();

talukaOfficerRouter.get("/super-secret", verifyCookieToken , authorizeRoles("talukaOfficer"), (req, res) => {
    res.json({ message: "Welcome, Taluka Officer!" });
});