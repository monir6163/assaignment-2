import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../errors/ApiError";
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

const updateUserById = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const userId = Number(req.params.userId);
    const updateData = req.body;
    const loggedInUser = req.user as IUser;
    if (loggedInUser?.role !== "admin" && loggedInUser?.id !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Forbidden! You can only update your own profile."
      );
    }
    if (loggedInUser.role !== "admin" && "role" in updateData) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Forbidden! You cannot update your own role."
      );
    }
    if (loggedInUser?.role !== "admin" && req.body.role) {
      delete req.body.role;
    }
    const result = await UserServices.updateUserById(userId, updateData);
    sendResponse<IUser | null>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  }
);

const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const result = await UserServices.deleteUserById(userId);
  sendResponse<IUser | null>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully",
  });
});

export const UsersController = {
  getAllUsers,
  updateUserById,
  deleteUserById,
};
