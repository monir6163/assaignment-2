import express from "express";
import { Role } from "../../../utils/enumst";
import auth from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { BookingController } from "./booking.controller";
import { BookingSchema } from "./booking.validation";

const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER),
  validateRequest(BookingSchema.create),
  BookingController.createBooking
);
router.get(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER),
  BookingController.getAllBookings
);
router.put(
  "/:bookingId",
  auth(Role.ADMIN, Role.CUSTOMER),
  validateRequest(BookingSchema.updateStatus),
  BookingController.updateBookingStatus
);
export const BookingRoutes = router;
