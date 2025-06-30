# Farmer App Backend

## Overview
Enterprise-level backend for Farmer Mobile Application built with Node.js, Express, and MongoDB.

## Features
- User Authentication (Register, Login, Profile Management)
- Role-based Access Control
- JWT Authentication
- Input Validation
- Error Handling
- Logging

## Prerequisites
- Node.js (v18+)
- MongoDB

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with necessary configurations
4. Run the application: `npm run dev`

## Environment Variables
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Application environment

## API Endpoints
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `GET /api/auth/profile`: Get user profile
- `PUT /api/auth/profile`: Update user profile

## Technologies
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Winston (Logging)
- Joi (Validation)