import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),

  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo válido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener mínimo 8 caracteres"),

  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;