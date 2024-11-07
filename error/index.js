/**
 * Error Class For APIs
 * @module ApiError
 */
class ApiError extends Error {
    /**
     * @param {string} ERROR_CODE
     * @param {string} STATUS
     * @param {string} MESSAGE
     */
    constructor(ERROR_CODE, STATUS, MESSAGE) {
      super();
      this.code = ERROR_CODE;
      this.status = STATUS;
      this.message = MESSAGE;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export { ApiError };
  