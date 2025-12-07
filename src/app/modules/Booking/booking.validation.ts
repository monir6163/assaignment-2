import z from "zod";
export const BookingSchema = {
  create: z.object({
    body: z.object({
      customer_id: z.number().min(1, "Customer ID is required"),
      vehicle_id: z.number().min(1, "Vehicle ID is required"),
      rent_start_date: z
        .string()
        .refine(
          (date) => !isNaN(Date.parse(date)),
          "rent_start_date must be a valid date string"
        ),
      rent_end_date: z
        .string()
        .refine(
          (date) => !isNaN(Date.parse(date)),
          "rent_end_date must be a valid date string"
        ),
      status: z.string().min(1, "Status is required"),
    }),
  }),
  updateStatus: z.object({
    params: z.object({
      bookingId: z.coerce.number().min(1, "Booking ID is required"),
    }),
    body: z.object({
      status: z.enum(["cancelled", "returned"]),
    }),
  }),
};
