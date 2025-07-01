import express from 'express'
import { validateRequest } from '../middleware/validation.js';
import { adminRegisterSchema, loginAdminValidation } from '../validations/adminValidation.js';
import { adminLogin, adminRegister } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/register' , validateRequest(adminRegisterSchema) , adminRegister)
adminRouter.post('/login' , validateRequest(loginAdminValidation) , adminLogin)
export default adminRouter;