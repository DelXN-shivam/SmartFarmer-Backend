import express from 'express';
import authRouter from './authRoutes.js';
import farmerRouter from './farmerRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/farmer', farmerRouter);

export default rootRouter;
