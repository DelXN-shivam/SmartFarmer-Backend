import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.error('Token verification failed', err);
        return res.sendStatus(403);
      }

      req.user = user;
      
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRATION 
  });
};