import { AppError } from "../lib/errors.js";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let code = "SERVER_ERROR";
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err.name === "ZodError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = err.issues?.[0]?.message || "Validation failed";
  } else if (err.code === "P2002") {
    statusCode = 409;
    code = "CONFLICT";
    message = "A record with this value already exists";
  } else if (err.code === "P2025") {
    statusCode = 404;
    code = "NOT_FOUND";
    message = "Resource not found";
  } else if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
