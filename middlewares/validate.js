const validate = (schema) => {
  return (req, res, next) => {
    console.log('req.body',req.body);
    
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.log(error);
      const errorMessages = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }
    next();
  };
};

export default validate;
