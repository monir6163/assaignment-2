import express from "express";
import { Role } from "../../../utils/enumst";
import auth from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { VehicleController } from "./vehicle.controller";
import { VehicleZodSchema } from "./vehicle.validation";

const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(VehicleZodSchema.createVehicleZodSchema),
  VehicleController.createVehicle
);

router.get("/", VehicleController.getAllVehicles);
router.get("/:vehicleId", VehicleController.getVehicleById);
router.put(
  "/:vehicleId",
  auth(Role.ADMIN),
  validateRequest(VehicleZodSchema.updateVehicleZodSchema),
  VehicleController.updateVehicle
);
router.delete("/:vehicleId", auth(Role.ADMIN), VehicleController.deleteVehicle);
export const VehicleRoutes = router;
