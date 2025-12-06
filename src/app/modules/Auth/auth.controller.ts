import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const signUpUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.signUpUser(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const signInUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.signInUser(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in successfully!",
    token: result.token,
    data: result.user,
  });
});

export const AuthController = {
  signUpUser,
  signInUser,
};
