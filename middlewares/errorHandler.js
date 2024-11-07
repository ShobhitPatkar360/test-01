import { StatusCodes } from "http-status-codes";

export const error = (err, req, res, next) => {
  
  if (!res.headersSent) {
    err.status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    err.code = err.code || 'ERR001';
    err.reason = err.reason || (errorMessages[err.code] ? errorMessages[err.code].reason : 'Something went wrong');
    err.message = err.message || (errorMessages[err.code] ? errorMessages[err.code].message : 'Something went wrong');
    
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "An error occurred",
      code: err.code,
      stack: err.stack,
      reason:err.reason
    });
  }
  next();
};
