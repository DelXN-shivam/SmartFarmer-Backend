import express from 'express'
import { validateRequest } from '../middleware/validation.js';
import { authenticateJWT } from '../middleware/authentication.js';
import { loginVerifierValidation, updateVerifierValidation, verifierValidationSchema } from '../validations/verifierValidation.js';
import { countVerifier, deleteVerifier, getUnverifiedVerifiers, getVerifier, getVerifierByPhone, getVerifiers, getVerifiersByIds, updateVerifier, verifierFiletring, verifierLogin, verifierRegister } from '../controllers/verifierController.js';

const verifierRouter = express.Router();

verifierRouter.post('/register' , validateRequest(verifierValidationSchema) , verifierRegister);
// verifierRouter.post('/add' , authenticateJWT , validateRequest(verifierValidationSchema) , verifierRegister);
verifierRouter.post('/add' , validateRequest(verifierValidationSchema) , verifierRegister);
verifierRouter.get('/unverified' ,authenticateJWT , getUnverifiedVerifiers) 
verifierRouter.get('/filter', authenticateJWT , verifierFiletring); 
verifierRouter.get('/count', countVerifier);
verifierRouter.post('/contact' , getVerifierByPhone)
verifierRouter.get('/' , authenticateJWT , getVerifiers);
verifierRouter.post('/by-ids', authenticateJWT, getVerifiersByIds); // New route
// verifierRouter.get('/:id' , authenticateJWT , getVerifier);
verifierRouter.get('/:id' , getVerifier);
// verifierRouter.patch('/update/:id' , validateRequest(updateVerifierValidation) , authenticateJWT , updateVerifier);
verifierRouter.patch('/update/:id' , updateVerifier);
verifierRouter.post('/login' , validateRequest(loginVerifierValidation) , verifierLogin)
verifierRouter.delete('/delete/:id' , authenticateJWT , deleteVerifier);


export default verifierRouter;
