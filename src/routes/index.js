import express from 'express';
import authRouter from './authRoutes.js';
import farmerRouter from './farmerRoutes.js';
import verifierRouter from './verifierRouter.js';
import adminRouter from './adminRoutes.js';
import cropRouter from './cropRoutes.js';
import {expiredCropRouter}  from './expiredCrop.js';
import { districtOfficerRouter } from './districtOfficer.js';
import { superAdminRouter } from './superAdminRoutes.js';
import { talukaOfficerRouter } from './talukaOfficerRoutes.js';
//import otpRouter from './otpRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/farmer', farmerRouter);
rootRouter.use('/verifier', verifierRouter);
rootRouter.use('/admin' , adminRouter);
rootRouter.use('/crop' , cropRouter);
//rootRouter.use('/otp' , otpRouter)
rootRouter.use('/expiredCrop' , expiredCropRouter)
rootRouter.use('/district-officer' , districtOfficerRouter);
rootRouter.use('/taluka-officer' , talukaOfficerRouter)
rootRouter.use('/super-admin' , superAdminRouter)
export default rootRouter;
