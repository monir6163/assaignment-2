import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success,
    message,
    error: {
      statusCode,
      message,
      stack: err.stack,
    },
  });
};

export default globalErrorHandler;
