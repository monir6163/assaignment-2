import express from "express";
import auth from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { BookingController } from "./booking.controller";
import { BookingSchema } from "./booking.validation";

const router = express.Router();

router.post(
  "/",
  auth("admin"),
  validateRequest(BookingSchema.create),
  BookingController.createBooking
);

export const BookingRoutes = router;
