import z from "zod";

export const VehicleZodSchema = {
  createVehicleZodSchema: z.object({
    body: z.object({
      vehicle_name: z.string().min(1, "Vehicle name is required"),
      type: z.string().min(1, "Type is required"),
      registration_number: z.string().min(1, "Registration number is required"),
      daily_rent_price: z
        .number()
        .min(0, "Daily rent price must be a positive number"),
      availability_status: z.string().min(1, "Availability status is required"),
    }),
  }),
  updateVehicleZodSchema: z.object({
    body: z.object({
      vehicle_name: z.string().min(1, "Vehicle name is required").optional(),
      type: z.string().min(1, "Type is required").optional(),
      registration_number: z
        .string()
        .min(1, "Registration number is required")
        .optional(),
      daily_rent_price: z
        .number()
        .min(0, "Daily rent price must be a positive number")
        .optional(),
      availability_status: z
        .string()
        .min(1, "Availability status is required")
        .optional(),
    }),
  }),
};
