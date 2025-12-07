import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { handleZodError } from "../errors/HandleZodError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let errorDetails: any = err;

  // 🔥 Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed!";
    errorDetails = handleZodError(err);
  }
  res.status(statusCode).json({
    success,
    message,
    errors: errorDetails,
    error: {
      statusCode,
      message,

      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};

export default globalErrorHandler;
