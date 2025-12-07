import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import sendResponse from "../../../shared/sendResponse";
import { BookingServices } from "./booking.services";

const runBookingStatusUpdateJob = async (req: Request, res: Response) => {
  const authHeaderCheck = req.headers.authorization;
  if (authHeaderCheck !== `Bearer ${config.cron_job_secret}`) {
    sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Unauthorized: Invalid cron job secret.",
      data: null,
    });
    return;
  }
  try {
    const bookingsUpdated =
      await BookingServices.bookingsAutoReturnForExpired();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Cron job executed successfully. ${bookingsUpdated} bookings updated to 'returned' status.`,
      data: { bookingsUpdated },
    });
    return;
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to run booking status update cronjob.",
      data: null,
    });
    return;
  }
};
export const BookingCronJob = {
  runBookingStatusUpdateJob,
};
