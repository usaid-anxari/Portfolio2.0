class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddelware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Token Invalid.Try Again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpaired") {
    const message = `Token Expaired.Login Again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "CastError") {
    const message = `Invaild ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
    : err.message;
  
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
        statusCode: err.statusCode,
    })
};

export { ErrorHandler };
