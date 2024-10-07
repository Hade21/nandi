import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  username: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .regex(
      /^[a-zA-Z0-9_.-]*$/,
      "Name can only contain letters, numbers, and underscores"
    ),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
});
