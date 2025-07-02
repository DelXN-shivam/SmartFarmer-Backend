import express from 'express';
import authRouter from './authRoutes.js';
import farmerRouter from './farmerRoutes.js';
import verifierRouter from './verifierRouter.js';
import adminRouter from './adminRoutes.js';
import cropRouter from './cropRoutes.js';
import otpRouter from './otpRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/farmer', farmerRouter);
rootRouter.use('/verifier', verifierRouter);
rootRouter.use('/admin' , adminRouter);
rootRouter.use('/crop' , cropRouter);
//rootRouter.use('/otp' , otpRouter)
export default rootRouter;
