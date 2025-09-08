// import express from 'express';
// import { 
//   registerUser, 
//   loginUser, 
//   getUserProfile, 
//   updateUserProfile 
// } from '../controllers/authController.js';
// import { authenticateJWT } from '../middleware/authentication.js';
// import { validateRequest } from '../middleware/validation.js';
// import { 
//   registerSchema, 
//   loginSchema, 
//   updateProfileSchema 
// } from '../validations/authValidation.js';
// import { demoSchema, updateDemoSchema } from '../validations/demoValidation.js';
// import { demoGet, demoRegister, demoUpdate } from '../controllers/demoController.js';

// const authRouter = express.Router();
// // 
// authRouter.post('/register', validateRequest(registerSchema), registerUser);
// authRouter.post('/login', validateRequest(loginSchema), loginUser);

// //
// authRouter.get('/profile', authenticateJWT, getUserProfile);
// authRouter.put('/profile', authenticateJWT, validateRequest(updateProfileSchema), updateUserProfile);
// // authRouter.post('/demo' ,validateRequest(demoSchema) , demoRegister )
// // authRouter.get('/demo' ,authenticateJWT  , demoGet )
// // authRouter.put('/demo' , authenticateJWT , validateRequest(updateDemoSchema) , demoUpdate )


// export default authRouter;



import express from "express";
import { loginDistrictOfficer } from "../controllers/districtOfficerController.js";
import { login, refreshTokenHandler } from "../controllers/authController.js";
import { loginSuperAdmin, registerSuperAdmin } from "../controllers/superAdminController.js";
import { loginTaluka, registerTaluka } from "../controllers/talukaOfficerController.js";
import { verifyCookieToken } from '../middleware/verifyCookie.js';
import { adminLogin, adminRegister } from "../controllers/adminController.js"; // ADD THIS

const authRouter = express.Router();

authRouter.get("/me", verifyCookieToken, (req, res) => {
  res.json({
    user: req.user, // e.g. { id, role, email }
  });
});

// ADD ADMIN ROUTES
authRouter.post("/admin/register", adminRegister);
authRouter.post("/admin/login", adminLogin);

authRouter.post("/super-admin/register" , registerSuperAdmin)
//login super admin

authRouter.post("/login" , login);

authRouter.post("/taluka-officer/register" , registerTaluka);

authRouter.get("/refresh", refreshTokenHandler); // refresh access token
// authRouter.post("/logout", logout); // clear cookie

export default authRouter;
