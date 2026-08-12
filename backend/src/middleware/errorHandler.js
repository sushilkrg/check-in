const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status =
    err.name === 'MulterError'
      ? err.code === 'LIMIT_FILE_SIZE'
        ? 413
        : 400
      : 500;

  res.status(status).json({
    success: false,
    message: status === 500 ? 'Something went wrong. Please try again.' : err.message,
  });
};

export default errorHandler;
