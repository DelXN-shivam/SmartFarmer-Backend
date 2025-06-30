import express from 'express'
import { validateRequest } from '../middleware/validation.js';
import { farmerValidationSchema, updateFarmerValidation } from '../validations/farmerValidation.js';
import { farmerRegister, getFarmer, updateFarmer } from '../controllers/farmerController.js';
import { authenticateJWT } from '../middleware/authentication.js';

const farmerRouter = express.Router();

farmerRouter.post('/register' , validateRequest(farmerValidationSchema) , farmerRegister); 
farmerRouter.get('/:id' , authenticateJWT , getFarmer);
farmerRouter.patch('/update/:id' , validateRequest(updateFarmerValidation) , authenticateJWT , updateFarmer);

export default farmerRouter;