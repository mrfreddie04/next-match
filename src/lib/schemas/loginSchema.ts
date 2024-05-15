import { z } from "zod";

//create schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters"})
});

//create a type for our form using zod type inference
export type LoginSchema = z.infer<typeof loginSchema>;