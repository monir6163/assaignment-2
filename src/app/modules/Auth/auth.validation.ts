import z from "zod";

export const AuthValidation = {
  signupZodSchema: z.object({
    body: z.object({
      name: z.string().min(2, "Name must be at least 2 characters long"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      phone: z
        .string()
        .min(11, "Phone number must be at least 11 characters long")
        .max(15, "Phone number must be at most 15 characters long"),
    }),
  }),
  loginZodSchema: z.object({
    body: z.object({
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    }),
  }),
};
