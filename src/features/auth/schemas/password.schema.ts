import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener mínimo 8 caracteres.")
  .max(72, "La contraseña no puede superar 72 caracteres.")
  .regex(/[A-Z]/, "Debe incluir al menos una mayúscula.")
  .regex(/[a-z]/, "Debe incluir al menos una minúscula.")
  .regex(/[0-9]/, "Debe incluir al menos un número.")
  .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un carácter especial.");

export const adminResetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma la contraseña."),
    forcePasswordChange: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresa tu contraseña actual."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma la contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "El token es obligatorio."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma la contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export type AdminResetPasswordFormValues = z.infer<
  typeof adminResetPasswordSchema
>;

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
