import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import calculateTotalPrice from "../../../utils/calculateTotalPrice";
import { IUser } from "../User/user.interface";
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
  if (existVehicle.availability_status !== "available") {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "The selected vehicle is not available for booking.",
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
    data: {
      id: result.id,
      customer_id: result.customer_id,
      vehicle_id: result.vehicle_id,
      rent_start_date: bookingData.rent_start_date,
      rent_end_date: bookingData.rent_end_date,
      total_price: result.total_price,
      status: result.status,
      vehicle: {
        vehicle_name: existVehicle.vehicle_name,
        daily_rent_price: Number(existVehicle.daily_rent_price),
      },
      created_at: result.created_at,
      updated_at: result.updated_at,
    },
  });
});
const getAllBookings = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const loggedInUser = req.user;
    if (loggedInUser?.role === "admin") {
      const result = await BookingServices.adminGetAllBookings();
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bookings retrieved successfully.",
        data: result,
      });
    } else if (loggedInUser?.role === "customer") {
      const result = await BookingServices.customerGetAllBookings(
        Number(loggedInUser.id)
      );
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bookings retrieved successfully.",
        data: result,
      });
    } else {
      sendResponse(res, {
        statusCode: StatusCodes.FORBIDDEN,
        success: false,
        message: "You do not have permission to access this resource.",
        data: null,
      });
    }
  }
);
const updateBookingStatus = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const loggedInUser = req.user;
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;
    const getExistingBooking = await BookingServices.getBookingById(bookingId);
    if (!getExistingBooking) {
      sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Booking not found with the provided bookingId.",
        data: null,
      });
      return;
    }
    if (status === "cancelled" && loggedInUser?.role === "customer") {
      if (getExistingBooking.customer_id !== loggedInUser.id) {
        sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: "Customer can only cancel their own booking.",
          data: null,
        });
        return;
      }
      const now = new Date();
      if (new Date(getExistingBooking.rent_start_date) <= now) {
        sendResponse(res, {
          statusCode: StatusCodes.BAD_REQUEST,
          success: false,
          message: "Cannot cancel booking after it has started.",
          data: null,
        });
        return;
      }
      const updatedBooking = await BookingServices.updateBookingStatus(
        bookingId,
        status
      );
      await BookingServices.updateVehicleAvailability(
        getExistingBooking.vehicle_id,
        "available"
      );
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking cancelled successfully.",
        data: updatedBooking,
      });
    }
  }
);

export const BookingController = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};
