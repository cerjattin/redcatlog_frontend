import { z } from "zod";

export const businessSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z
    .string()
    .email("Ingresa un correo válido")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;
