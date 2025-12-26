import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelpers } from "../../helper/jwtHelpers";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
      }
      let verifiedUser;
      try {
        verifiedUser = jwtHelpers.verifyToken(
          token,
          config.jwt.secret_token as Secret
        );
      } catch (error: any) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED",
          error.message
        );
      }
      if (!verifiedUser) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
      }

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser?.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden! Access Denied");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
