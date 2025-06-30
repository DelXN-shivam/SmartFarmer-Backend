import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Internal Server Error'
  });
};

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};