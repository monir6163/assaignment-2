import express from "express";
import { Role } from "../../../utils/enumst";
import auth from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { UsersController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/", auth(Role.ADMIN), UsersController.getAllUsers);
router.get(
  "/:email",
  auth(Role.ADMIN),
  UsersController.getUserByRegistationNumber
);
router.put(
  "/:userId",
  auth(Role.ADMIN, Role.CUSTOMER),
  validateRequest(UserValidation.updateUserZodSchema),
  UsersController.updateUserById
);

router.delete("/:userId", auth(Role.ADMIN), UsersController.deleteUserById);

export const UserRoutes = router;
