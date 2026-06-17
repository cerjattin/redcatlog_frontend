import { z } from "zod";

export const businessSchema = z.object({
  mainCategoryId: z.string().optional(),

  name: z.string().min(2, "El nombre del emprendimiento es obligatorio"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  story: z.string().optional(),

  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),

  contactEmail: z
    .string()
    .email("Ingresa un correo válido")
    .optional()
    .or(z.literal("")),

  contactPhone: z.string().optional(),
  contactWhatsapp: z.string().optional(),

  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
  addressText: z.string().optional(),

  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;
