import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  egi: z.string().min(1, "EGI is required"),
});
