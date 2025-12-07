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

const getUserByRegistationNumber = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.params.email as string;
    const result = await UserServices.getUserByRegistationNumber(email);
    sendResponse<IUser | null>(res, {
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      success: true,
      message: result
        ? "User retrieved successfully"
        : "User not found with the provided registration number",
      data: result,
    });
  }
);

const updateUserById = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const userId = Number(req.params.userId);
    const updateData = req.body;
    const loggedInUser = req.user as IUser;
    if (loggedInUser?.role !== "admin" && loggedInUser?.id !== userId) {
      return sendResponse<IUser | null>(res, {
        statusCode: StatusCodes.FORBIDDEN,
        success: false,
        message: "Forbidden! You can only update your own profile.",
        data: null,
      });
    }
    if (loggedInUser?.role !== "admin" && req.body.role) {
      delete req.body.role;
    }
    const result = await UserServices.updateUserById(userId, updateData);
    sendResponse<IUser | null>(res, {
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      success: true,
      message: result
        ? "User updated successfully"
        : "User not found with the provided ID",
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
    message: result
      ? "User deleted successfully"
      : "User not found with the provided ID",
    data: result,
  });
});

export const UsersController = {
  getAllUsers,
  getUserByRegistationNumber,
  updateUserById,
  deleteUserById,
};
