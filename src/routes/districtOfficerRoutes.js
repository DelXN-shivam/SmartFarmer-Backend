import express from "express";
import { validateRequest } from "../middleware/validation.js";
import {
  districtOfficerValidationSchema,
  updateDistrictOfficerValidation,
  loginDistrictOfficerValidation,
  addTalukaOfficerValidation,
} from "../validations/districtOfficerValidation.js";
import {
  addTalukaOfficerToDistrict,
  countDistrictOfficer,
  deleteDistrictOfficer,
  districtOfficerFiltering,
  districtOfficerLogin,
  districtOfficerRegister,
  getDistrictOfficer,
  getDistrictOfficerByPhone,
  getDistrictOfficers,
  updateDistrictOfficer,
} from "../controllers/districtOfficerController.js";

const districtOfficerRouter = express.Router();

districtOfficerRouter.post(
  "/register",
  validateRequest(districtOfficerValidationSchema),
  districtOfficerRegister
);
districtOfficerRouter.post(
  "/add",
  validateRequest(districtOfficerValidationSchema),
  districtOfficerRegister
);
districtOfficerRouter.get("/filter", districtOfficerFiltering);
districtOfficerRouter.get("/count", countDistrictOfficer);
districtOfficerRouter.post("/contact", getDistrictOfficerByPhone);
districtOfficerRouter.get("/", getDistrictOfficers);
districtOfficerRouter.get("/:id", getDistrictOfficer);
districtOfficerRouter.patch(
  "/update/:id",
  validateRequest(updateDistrictOfficerValidation),
  updateDistrictOfficer
);
districtOfficerRouter.post(
  "/login",
  validateRequest(loginDistrictOfficerValidation),
  districtOfficerLogin
);
districtOfficerRouter.delete("/delete/:id", deleteDistrictOfficer);
districtOfficerRouter.post(
  "/add-taluka-officer",
  validateRequest(addTalukaOfficerValidation),
  addTalukaOfficerToDistrict
);

export default districtOfficerRouter;

// import express from 'express'
// import { registerDistrictOfficer } from '../controllers/districtOfficerController.js';
// import { verifyCookieToken } from '../middleware/verifyCookie.js';
// import { authorizeRoles } from '../middleware/roleMiddleware.js';

// export const districtOfficerRouter = express.Router();

// districtOfficerRouter.post("/register" ,  registerDistrictOfficer)

// districtOfficerRouter.get("/dashboard", verifyCookieToken , authorizeRoles("districtOfficer"), (req, res) => {
//     res.json({
//         message: `Welcome to the dashboard, user ${req.user.id}`,
//         role: req.user.role
//     });
// });
