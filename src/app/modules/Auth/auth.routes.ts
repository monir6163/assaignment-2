import express from "express";
import validateRequest from "../../middleware/ValidateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(AuthValidation.signupZodSchema),
  AuthController.signUpUser
);

router.post(
  "/signin",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.signInUser
);

export const AuthRoutes = router;
