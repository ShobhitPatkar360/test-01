export const success = (res,data) => {
  if (!res.headersSent) {// Retrieve data from res.locals
    return res.status(200).json({
      success: true,
      message: "Request successful",
      data: data,  // Send the stored data
    });
  }
  next();
};
