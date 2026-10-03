export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || 'Internal Server Error';

  // Body parser / JSON syntax error
  if (err instanceof SyntaxError && (err.status === 400 || 'body' in err)) {
    statusCode = 400;
    message = 'Invalid JSON in request body. Please verify your JSON syntax.';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found with the specified ID';
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message =
      field === 'email'
        ? 'A user with this email address already exists'
        : field
        ? `A record with that ${field} already exists`
        : 'Duplicate entry detected';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // MongoDB connection / server selection errors
  if (
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoTimeoutError' ||
    err.name === 'MongooseServerSelectionError' ||
    (err.message && err.message.includes('buffering timed out'))
  ) {
    statusCode = 503;
    message = 'Database connection error: Unable to connect to MongoDB. Please ensure MongoDB is running.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
