const globalError = (err, req, res, next) => {
  // Ensure the error object has the necessary properties
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  // Log the error details (optional)
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Send the error response
  res.status(err.statusCode).json({
    status: err.status,
    error:err,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Only show stack trace in development mode
  });
};




export default globalError