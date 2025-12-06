import express from "express";
import auth from "../../middleware/Auth";
import { UsersController } from "./user.controller";

const router = express.Router();

router.get("/", auth("admin"), UsersController.getAllUsers);

export const UserRoutes = router;
