import { StatusCodes } from 'http-status-codes';
import logger from './../services/logger.js';

export const sendError = (err, res) => {
  
  err.status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  err.code = err.code || 'ERR001';
  err.reason = err.reason || (errorMessages[err.code] ? errorMessages[err.code].reason : 'Something went wrong');
  err.message = err.message || (errorMessages[err.code] ? errorMessages[err.code].message : 'Something went wrong');

  if (process.env.NODE_ENV === 'production') {
      sendProdError(err, res);
  } else {
      sendDevError(err, res);
  }
};

const sendDevError = (err, res) => {
  res.status(err.status).json({
    code: err.code,
    reason: err.reason,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.status).json({
      code: err.code,
      reason: err.reason,
      message: err.message,
    });
  } else {
    logger.error('+ ERROR +', err);
    res.status(err.status).json({
      message: err.message,
    });
  }
};

