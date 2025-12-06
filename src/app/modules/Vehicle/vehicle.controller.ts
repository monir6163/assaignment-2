import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IVehicle } from "./vehicle.interface";
import { VehicleService } from "./vehicle.services";

const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const result = await VehicleService.createVehicle(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Vehicle created successfully",
    data: result,
  });
});
const getAllVehicles = catchAsync(async (req: Request, res: Response) => {
  const result = await VehicleService.getAllVehicles();
  sendResponse<IVehicle[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message:
      result?.length > 0
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
    data: result?.length > 0 ? result : [],
  });
});
const getVehicleById = catchAsync(async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehicleId);
  const result = await VehicleService.getVehicleById(vehicleId);
  sendResponse<IVehicle | null>(res, {
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    success: true,
    message: result ? "Vehicle retrieved successfully" : "Vehicle not found",
    data: result,
  });
});
const updateVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehicleId);
  const result = await VehicleService.updateVehicle(vehicleId, req.body);
  sendResponse<IVehicle | null>(res, {
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    success: true,
    message: result ? "Vehicle updated successfully" : "Vehicle not found",
    data: result,
  });
});
const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehicleId);
  const result = await VehicleService.deleteVehicle(vehicleId);
  sendResponse<IVehicle | null>(res, {
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    success: true,
    message: result ? "Vehicle deleted successfully" : "Vehicle not found",
    data: result,
  });
});

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
