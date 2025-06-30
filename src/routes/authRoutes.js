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

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, validateRequest(updateProfileSchema), updateUserProfile);



export default router;