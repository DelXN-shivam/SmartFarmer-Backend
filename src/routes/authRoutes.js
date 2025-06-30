import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authentication.js';
import { validateRequest } from '../middleware/validation.js';
import { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema 
} from '../validations/authValidation.js';
import { demoSchema, updateDemoSchema } from '../validations/demoValidation.js';
import { demoGet, demoRegister, demoUpdate } from '../controllers/demoController.js';

const authRouter = express.Router();
// 
authRouter.post('/register', validateRequest(registerSchema), registerUser);
authRouter.post('/login', validateRequest(loginSchema), loginUser);

//
authRouter.get('/profile', authenticateJWT, getUserProfile);
authRouter.put('/profile', authenticateJWT, validateRequest(updateProfileSchema), updateUserProfile);
authRouter.post('/demo' ,validateRequest(demoSchema) , demoRegister )
authRouter.get('/demo' ,authenticateJWT  , demoGet )
authRouter.put('/demo' , authenticateJWT , validateRequest(updateDemoSchema) , demoUpdate )


export default authRouter;