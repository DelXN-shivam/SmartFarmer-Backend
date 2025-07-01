import express from 'express';
import authRouter from './authRoutes.js';
import farmerRouter from './farmerRoutes.js';
import verifierRouter from './verifierRouter.js';
import adminRouter from './adminRoutes.js';
import cropRouter from './cropRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/farmer', farmerRouter);
rootRouter.use('/verifier', verifierRouter);
rootRouter.use('/admin' , adminRouter);
rootRouter.use('/crop' , cropRouter);
export default rootRouter;
