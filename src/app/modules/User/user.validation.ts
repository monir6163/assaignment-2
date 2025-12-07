import z from "zod";

export const UserValidation = {
  updateUserZodSchema: z.object({
    body: z.object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .optional(),
      email: z.string().email("Invalid email address").optional(),
      role: z.enum(["admin", "customer"]).optional(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .optional(),
      phone: z
        .string()
        .min(11, "Phone number must be at least 11 characters long")
        .max(15, "Phone number must be at most 15 characters long")
        .optional(),
    }),
  }),
};
