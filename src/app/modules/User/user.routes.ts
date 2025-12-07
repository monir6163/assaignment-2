import express from "express";
import auth from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { UsersController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/", auth("admin"), UsersController.getAllUsers);
router.get(
  "/:regNumber",
  auth("admin"),
  UsersController.getUserByRegistationNumber
);
router.put(
  "/:userId",
  auth("admin", "customer"),
  validateRequest(UserValidation.updateUserZodSchema),
  UsersController.updateUserById
);

router.delete("/:userId", auth("admin"), UsersController.deleteUserById);

export const UserRoutes = router;
