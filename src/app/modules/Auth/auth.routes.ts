import express from "express";
import validateRequest from "../../middleware/ValidateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(AuthValidation.signupZodSchema),
  AuthController.signupUser
);

router.post(
  "/signin",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

// router.post("/refresh-token", AuthController.refreshToken);

// router.post(
//   "/change-password",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//   AuthController.changePassword
// );

// router.post("/forgot-password", AuthController.forgotPassword);

// router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
