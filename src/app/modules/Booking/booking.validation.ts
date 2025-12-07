import z from "zod";
export const BookingSchema = {
  create: z.object({
    customer_id: z.number().int().positive(),
    vehicle_id: z.number().int().positive(),
    rent_start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format for rent_start_date",
    }),
    rent_end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format for rent_end_date",
    }),
    status: z.enum(["active", "cancelled", "returned"]),
  }),
};
