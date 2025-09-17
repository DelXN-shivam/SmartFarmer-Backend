import express from "express";
// import { loginDistrictOfficer } from "../controllers/districtOfficerController.js";
import {
  login,
  logout,
  mobileLoginByContact,
  refreshTokenHandler,
} from "../controllers/authController.js";
import {
  loginSuperAdmin,
  registerSuperAdmin,
} from "../controllers/superAdminController.js";
import {
  districtOfficerLogin,
  districtOfficerRegister,
} from "../controllers/districtOfficerController.js";
import {
  talukaOfficerLogin,
  talukaOfficerRegister,
} from "../controllers/talukaOfficerController.js";
import { verifyCookieToken } from "../middleware/verifyCookie.js";
import { authenticateJWT } from "../middleware/authentication.js";
import { validateRequest } from "../middleware/validation.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../validations/authValidation.js";

const authRouter = express.Router();

// Get current user profile
authRouter.get("/me", verifyCookieToken, (req, res) => {
  res.json({
    user: req.user, // e.g. { id, role, email }
  });
});

// General Auth Routes
authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.get("/refresh", refreshTokenHandler); // refresh access token
authRouter.post("/logout", logout); // clear cookie

// Super Admin Routes
authRouter.post("/super-admin/register", registerSuperAdmin);
authRouter.post("/super-admin/login", loginSuperAdmin);

// Add these routes to authRouter
authRouter.post("/district-officer/register", districtOfficerRegister);
authRouter.post("/district-officer/login", districtOfficerLogin);

// Taluka Officer Routes
authRouter.post("/taluka-officer/register", talukaOfficerRegister);
authRouter.post("/taluka-officer/login", talukaOfficerLogin);

// Farmer and Verifier Routes
authRouter.post("/mobile-user/loginByContact", mobileLoginByContact);

export default authRouter;
