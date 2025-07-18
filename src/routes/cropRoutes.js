// routes/cropRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation.js';
import { authenticateJWT } from '../middleware/authentication.js';
import { cropValidationSchema } from '../validations/cropValidation.js';
import { addCrop, deleteCrop, filterCrop, getCrop, updateCrop, getCropsByIds, getCropsByFarmerId } from '../controllers/cropController.js';

const cropRouter = express.Router();

// cropRouter.post('/add/:farmerId', authenticateJWT, validateRequest(cropValidationSchema), addCrop);
cropRouter.post('/add/:farmerId', validateRequest(cropValidationSchema), addCrop);
cropRouter.patch('/update/:cropId' , authenticateJWT , updateCrop);
cropRouter.delete('/:cropId' , authenticateJWT , deleteCrop);
cropRouter.get("/filter" , authenticateJWT , filterCrop);
cropRouter.get('/by-farmer/:farmerId', getCropsByFarmerId);
cropRouter.get("/:id" , authenticateJWT , getCrop);
cropRouter.post('/get-by-ids', getCropsByIds);

export default cropRouter;
