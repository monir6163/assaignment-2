import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";

const router = express.Router();

const moduleRoutes = [
  // {
  //   path: "/user",
  //   routes: "UserRoutes",
  // },
  {
    path: "/auth",
    routes: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));
export default router;
