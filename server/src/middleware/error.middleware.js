import { AppError } from "../lib/errors.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let code = "SERVER_ERROR";
  // SECURITY: Never leak raw internal error messages in production.
  let message = IS_PRODUCTION ? "Internal server error" : "Internal server error";

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
  } else if (!IS_PRODUCTION && err.message) {
    // Only expose raw error messages in non-production environments
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
