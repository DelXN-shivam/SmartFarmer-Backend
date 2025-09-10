import express from "express";
import { loginDistrictOfficer } from "../controllers/districtOfficerController.js";
import { login, refreshTokenHandler } from "../controllers/authController.js";
import {
  loginSuperAdmin,
  registerSuperAdmin,
} from "../controllers/superAdminController.js";
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

// Super Admin Routes
authRouter.post("/super-admin/register", registerSuperAdmin);
authRouter.post("/super-admin/login", loginSuperAdmin);

// Taluka Officer Routes
authRouter.post("/taluka-officer/register", talukaOfficerRegister);
authRouter.post("/taluka-officer/login", talukaOfficerLogin);

// District Officer Routes
authRouter.post("/district-officer/login", loginDistrictOfficer);

export default authRouter;

// import express from "express";
// import { login, refreshTokenHandler } from "../controllers/authController.js";
// import {
//   loginSuperAdmin,
//   registerSuperAdmin,
// } from "../controllers/superAdminController.js";

// import { verifyCookieToken } from "../middleware/verifyCookie.js";
// // import { adminLogin, adminRegister } from "../controllers/adminController.js";

// const authRouter = express.Router();

// authRouter.get("/me", verifyCookieToken, (req, res) => {
//   res.json({
//     user: req.user, // e.g. { id, role, email }
//   });
// });

// // Super Admin
// authRouter.post("/super-admin/register", registerSuperAdmin);
// authRouter.post("/super-admin/login", loginSuperAdmin);

// authRouter.post("/login", login);

// authRouter.get("/refresh", refreshTokenHandler); // refresh access token
// // authRouter.post("/logout", logout); // clear cookie

// export default authRouter;
