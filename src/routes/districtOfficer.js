import express from 'express'
import { registerDistrictOfficer } from '../controllers/districtOfficerController.js';
import { verifyCookieToken } from '../middleware/verifyCookie.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

export const districtOfficerRouter = express.Router();

districtOfficerRouter.post("/register" ,  registerDistrictOfficer)

districtOfficerRouter.get("/dashboard", verifyCookieToken , authorizeRoles("districtOfficer"), (req, res) => {
    res.json({
        message: `Welcome to the dashboard, user ${req.user.id}`,
        role: req.user.role
    });
});