import express from 'express'
import { validateRequest } from '../middleware/validation.js';
import { farmerValidationSchema, loginFarmerValidation, updateFarmerValidation, farmerContactRegisterSchema } from '../validations/farmerValidation.js';
import { countFarmer, deleteFarmer, farmerFiletring, farmerLogin, farmerRegister, getFarmer, getFarmerByPhone, getFarmers, updateFarmer, farmerRegisterWithContact } from '../controllers/farmerController.js';
import { authenticateJWT } from '../middleware/authentication.js';

const farmerRouter = express.Router();

farmerRouter.post('/register', validateRequest(farmerValidationSchema), farmerRegister);
farmerRouter.post('/register/contact', validateRequest(farmerContactRegisterSchema), farmerRegisterWithContact);
//farmerRouter.get('/phoneNo', farmerLoginOtp); // specific
farmerRouter.post('/login', validateRequest(loginFarmerValidation), farmerLogin); // specific
farmerRouter.get('/contact'  , getFarmerByPhone);
// Protected routes
farmerRouter.get('/count' , authenticateJWT , countFarmer);
farmerRouter.get('/filter', authenticateJWT, farmerFiletring); // specific
farmerRouter.get('/', authenticateJWT, getFarmers); // specific
// farmerRouter.patch('/update/:id', validateRequest(updateFarmerValidation), authenticateJWT, updateFarmer); // specific
farmerRouter.patch('/update/:id', validateRequest(updateFarmerValidation), updateFarmer); // specific
farmerRouter.delete('/:farmerId', authenticateJWT, deleteFarmer); // specific
farmerRouter.get('/:id', authenticateJWT, getFarmer); // dynamic — must go last!


export default farmerRouter;
