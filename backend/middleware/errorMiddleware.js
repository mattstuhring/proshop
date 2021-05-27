const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const error = res.statusCode === 200 ? 500 : res.statusCode; // Error status can be 200 OK
  res.status(error);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export { notFound, errorHandler };
