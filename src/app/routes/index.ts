import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { BookingRoutes } from "../modules/Booking/booking.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { VehicleRoutes } from "../modules/Vehicle/vehicle.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: AuthRoutes,
  },
  {
    path: "/users",
    routes: UserRoutes,
  },
  {
    path: "/vehicles",
    routes: VehicleRoutes,
  },
  {
    path: "/bookings",
    routes: BookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));
export default router;
