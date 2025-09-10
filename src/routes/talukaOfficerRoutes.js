import express from 'express'
import { validateRequest } from "../middleware/validation.js";
import {
  talukaOfficerValidationSchema,
  updateTalukaOfficerValidation,
  loginTalukaOfficerValidation,
} from "../validations/talukaOfficerValidation.js";
import {
  countTalukaOfficer,
  deleteTalukaOfficer,
  getTalukaOfficer,
  getTalukaOfficerByPhone,
  getTalukaOfficers,
  getUnverifiedTalukaOfficers,
  talukaOfficerFiltering,
  talukaOfficerLogin,
  talukaOfficerRegister,
  updateTalukaOfficer,
} from "../controllers/talukaOfficerController.js";

export const talukaOfficerRouter = express.Router();

talukaOfficerRouter.post(
  "/register",
  validateRequest(talukaOfficerValidationSchema),
  talukaOfficerRegister
);
talukaOfficerRouter.post(
  "/add",
  validateRequest(talukaOfficerValidationSchema),
  talukaOfficerRegister
);
talukaOfficerRouter.get("/unverified", getUnverifiedTalukaOfficers);
talukaOfficerRouter.get("/filter", talukaOfficerFiltering);
talukaOfficerRouter.get("/count", countTalukaOfficer);
talukaOfficerRouter.post("/contact", getTalukaOfficerByPhone);
talukaOfficerRouter.get("/", getTalukaOfficers);
talukaOfficerRouter.get("/:id", getTalukaOfficer);
talukaOfficerRouter.patch("/update/:id", updateTalukaOfficer);
talukaOfficerRouter.post(
  "/login",
  validateRequest(loginTalukaOfficerValidation),
  talukaOfficerLogin
);
talukaOfficerRouter.delete("/delete/:id", deleteTalukaOfficer);
