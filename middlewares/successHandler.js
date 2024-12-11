export const success = (res,data,limitExpired) => {
  if (!res.headersSent) {// Retrieve data from res.locals
    return res.status(200).json({
      success: true,
      message: res.message || "Request successful",
      data: data,  // Send the stored data
      limitExpired
    });
  }
  next();
};
