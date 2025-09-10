import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";

import './cron/expiredCrop.js'; 
import connectDB from './config/database.js';
import logger from './config/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import rootRouter from "./routes/index.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://smart-farmer-backend.vercel.app",
        "http://localhost:1000",
        "http://localhost:3000",
        "https://smart-farmer-admin.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Access-Control-Allow-Origin",
      "Accept",
      "Options",
      "X-Requested-With",
    ],
  })
);

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:1000",
    "https://smart-farmer-admin.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Root route
app.get("/", (req, res) => {
  res.send("SmartFarmer API is running...");
});

// Routes
app.use("/api", rootRouter);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server only after DB connection
const PORT = process.env.PORT || 1000;

const startServer = async () => {
  try {
    await connectDB(); // Wait for MongoDB connection
    app.listen(PORT, () => {
      logger.info(
        `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB", error);
    process.exit(1); // Exit process if DB fails
  }
};

startServer();
