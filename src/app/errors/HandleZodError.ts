import { ZodError } from "zod";

export const handleZodError = (error: ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
};
