import express from "express";
import auth from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { VehicleController } from "./vehicle.controller";
import { VehicleZodSchema } from "./vehicle.validation";

const router = express.Router();

router.post(
  "/create",
  auth("admin"),
  validateRequest(VehicleZodSchema.createVehicleZodSchema),
  VehicleController.createVehicle
);

router.get("/", VehicleController.getAllVehicles);
router.get("/:vehicleId", VehicleController.getVehicleById);
router.put(
  "/:vehicleId",
  auth("admin"),
  validateRequest(VehicleZodSchema.updateVehicleZodSchema),
  VehicleController.updateVehicle
);
router.delete("/:vehicleId", auth("customer"), VehicleController.deleteVehicle);

export const VehicleRoutes = router;
