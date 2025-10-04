import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  egi: z.string().min(1, "EGI is required"),
});

export const locationNameSchema = z
  .object({
    location: z
      .string()
      .min(1, "Location name is required")
      .max(100, "Location name is too long"),
  })
  .refine((data) => data.location.length <= 100, {
    message: "Location name is too long",
    path: ["locationName"],
  });
