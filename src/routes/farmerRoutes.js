import express from 'express'
import { validateRequest } from '../middleware/validation.js';
import { farmerValidationSchema, loginFarmerValidation, updateFarmerValidation } from '../validations/farmerValidation.js';
import { farmerLogin, farmerRegister, getFarmer, getFarmers, updateFarmer } from '../controllers/farmerController.js';
import { authenticateJWT } from '../middleware/authentication.js';

const farmerRouter = express.Router();

farmerRouter.post('/register' , validateRequest(farmerValidationSchema) , farmerRegister); 
farmerRouter.get('/:id' , authenticateJWT , getFarmer);
farmerRouter.patch('/update/:id' , validateRequest(updateFarmerValidation) , authenticateJWT , updateFarmer);
farmerRouter.get('/' , authenticateJWT , getFarmers);
farmerRouter.post('/login' , validateRequest(loginFarmerValidation) , farmerLogin)

export default farmerRouter;