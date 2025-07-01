// routes/cropRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation.js';
import { authenticateJWT } from '../middleware/authentication.js';
import { cropValidationSchema } from '../validations/cropValidation.js';
import { addCrop } from '../controllers/cropController.js';

const cropRouter = express.Router();

cropRouter.post('/add/:farmerId', authenticateJWT, validateRequest(cropValidationSchema), addCrop);

export default cropRouter;
