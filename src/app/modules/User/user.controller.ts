import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "./user.interface";
import { UserServices } from "./user.services";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();
  sendResponse<IUser[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message:
      result?.length > 0 ? "Users retrieved successfully" : "No Users Found",
    data: result?.length > 0 ? result : [],
  });
});

const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const result = await UserServices.deleteUserById(userId);
  sendResponse<IUser | null>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result
      ? "User deleted successfully"
      : "User not found with the provided ID",
    data: result,
  });
});

export const UsersController = {
  getAllUsers,
  deleteUserById,
};
