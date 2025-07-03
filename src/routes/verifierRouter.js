import express from 'express'
import { validateRequest } from '../middleware/validation.js';
import { farmerLogin, farmerRegister, getFarmer, getFarmers, updateFarmer } from '../controllers/farmerController.js';
import { authenticateJWT } from '../middleware/authentication.js';
import { loginVerifierValidation, updateVerifierValidation, verifierValidationSchema } from '../validations/verifierValidation.js';
import { countVerifier, deleteVerifier, getUnverifiedVerifiers, getVerifier, getVerifiers, updateVerifier, verifierLogin, verifierRegister } from '../controllers/verifierController.js';

const verifierRouter = express.Router();

verifierRouter.post('/register' , validateRequest(verifierValidationSchema) , verifierRegister);
verifierRouter.get('/unverified' ,authenticateJWT , getUnverifiedVerifiers) 

verifierRouter.get('/count' , authenticateJWT , countVerifier);
verifierRouter.get('/' , authenticateJWT , getVerifiers);
verifierRouter.get('/:id' , authenticateJWT , getVerifier);
verifierRouter.patch('/update/:id' , validateRequest(updateVerifierValidation) , authenticateJWT , updateVerifier);
verifierRouter.post('/login' , validateRequest(loginVerifierValidation) , verifierLogin)
verifierRouter.delete('/delete/:id' , authenticateJWT , deleteVerifier);


export default verifierRouter;