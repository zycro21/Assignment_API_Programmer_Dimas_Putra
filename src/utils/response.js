const successResponse = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: 0,
    message,
    data,
  });
};

const errorResponse = (
  res,
  status,
  message,
  statusCode = 400
) => {
  return res.status(statusCode).json({
    status,
    message,
    data: null,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};