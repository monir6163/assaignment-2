import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import calculateTotalPrice from "../../../utils/calculateTotalPrice";
import { BookingServices } from "./booking.services";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingData = req.body;
  const startDate = new Date(bookingData.rent_start_date);
  const endDate = new Date(bookingData.rent_end_date);
  if (startDate >= endDate) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message:
        "Invalid date range: rent_start_date must be before rent_end_date.",
      data: null,
    });
    return;
  }
  const existCustomer = await BookingServices.getCustomerById(
    bookingData.customer_id
  );
  if (!existCustomer) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      success: false,
      message: "Customer not found with the provided customer_id.",
      data: null,
    });
    return;
  }
  const existVehicle = await BookingServices.getVehicleById(
    bookingData.vehicle_id
  );
  if (!existVehicle) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      success: false,
      message: "Vehicle not found with the provided vehicle_id.",
      data: null,
    });
    return;
  }
  const totalPriceCalculation = calculateTotalPrice(
    bookingData.rent_start_date,
    bookingData.rent_end_date,
    existVehicle.daily_rent_price
  );
  const result = await BookingServices.createBooking({
    ...bookingData,
    total_price: totalPriceCalculation,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Booking created successfully.",
    data: result,
  });
});

export const BookingController = {
  createBooking,
};
