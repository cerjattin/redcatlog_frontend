import { z } from "zod";

export const adminUserCreateSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo valido"),
  password: z
    .string()
    .min(8, "La contrasena debe tener minimo 8 caracteres"),
  role: z.enum(["editor", "admin", "entrepreneur"]),
  status: z.enum(["active", "pending", "inactive"]),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
  forcePasswordChange: z.boolean(),
});

export type AdminUserCreateFormValues = z.infer<typeof adminUserCreateSchema>;
