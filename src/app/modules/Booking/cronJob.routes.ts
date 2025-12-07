import express from "express";
import { BookingCronJob } from "./cronJob.services";

const router = express.Router();
router.get(
  "/run-cron-auto-return-bookings",
  BookingCronJob.runBookingStatusUpdateJob
);
export const CronJobRoutes = router;
