import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import calculateTotalPrice from "../../../utils/calculateTotalPrice";
import ApiError from "../../errors/ApiError";
import { IUser } from "../User/user.interface";
import { BookingServices } from "./booking.services";

const createBooking = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const bookingData = req.body;
    const loggedInUser = req.user;
    if (
      loggedInUser?.id !== bookingData.customer_id &&
      loggedInUser?.role !== "admin"
    ) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You can not create a booking for another customer."
      );
    }

    const startDate = new Date(bookingData.rent_start_date);
    const endDate = new Date(bookingData.rent_end_date);
    if (endDate <= startDate) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "End date must be after start date"
      );
    }
    const existCustomer = await BookingServices.getCustomerById(
      bookingData.customer_id
    );
    if (!existCustomer) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Customer not found with the provided customer_id."
      );
    }
    const existVehicle = await BookingServices.getVehicleById(
      bookingData.vehicle_id
    );
    if (!existVehicle) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Vehicle not found with the provided vehicle_id."
      );
    }
    if (existVehicle.availability_status !== "available") {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "The selected vehicle is not available for booking."
      );
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
  }
);
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
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You do not have permission to view bookings."
      );
    }
  }
);
const updateBookingStatus = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const loggedInUser = req.user!;
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;
    const getExistingBooking = await BookingServices.getBookingById(bookingId);
    if (!getExistingBooking) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Booking not found with the provided bookingId."
      );
    }
    if (status === "cancelled") {
      if (
        loggedInUser.role !== "admin" &&
        loggedInUser.id !== getExistingBooking.customer_id
      ) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "Customer can only cancel their own bookings"
        );
      }
      if (loggedInUser.role !== "admin") {
        const today = new Date();
        const startDate = new Date(getExistingBooking.rent_start_date);
        if (today >= startDate) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Cannot cancel booking after start date"
          );
        }
      }
      const updatedBooking = await BookingServices.updateBookingStatus(
        bookingId,
        "cancelled"
      );
      if (!updatedBooking) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to update booking status."
        );
      }
      await BookingServices.updateVehicleAvailability(
        getExistingBooking.vehicle_id,
        "available"
      );
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking cancelled successfully.",
        data: {
          id: updatedBooking.id,
          customer_id: updatedBooking.customer_id,
          vehicle_id: updatedBooking.vehicle_id,
          rent_start_date: updatedBooking.rent_start_date,
          rent_end_date: updatedBooking.rent_end_date,
          total_price: Number(updatedBooking.total_price),
          status: updatedBooking.status,
        },
      });
    }

    if (status === "returned") {
      if (loggedInUser.role !== "admin") {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "Only admin can mark bookings as returned."
        );
      }

      const updatedBooking = await BookingServices.updateBookingStatus(
        getExistingBooking.id,
        "returned"
      );
      const result = await BookingServices.updateVehicleAvailability(
        getExistingBooking.vehicle_id,
        "available"
      );
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking marked as returned. Vehicle is now available.",
        data: {
          id: updatedBooking.id,
          customer_id: updatedBooking.customer_id,
          vehicle_id: updatedBooking.vehicle_id,
          rent_start_date: updatedBooking.rent_start_date,
          rent_end_date: updatedBooking.rent_end_date,
          total_price: Number(updatedBooking.total_price),
          status: updatedBooking.status,
          vehicle: {
            availability_status: result.availability_status,
          },
        },
      });
    }
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Invalid status update request.",
    });
  }
);

export const BookingController = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};
