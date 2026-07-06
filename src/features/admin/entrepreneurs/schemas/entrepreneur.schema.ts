import { z } from "zod";

export const entrepreneurSchema = z.object({
  categoryId: z.string().nullable().optional(),

  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  fullName: z.string().optional(),

  slug: z
    .string()
    .min(3, "El slug debe tener mínimo 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),

  documentType: z.string().optional(),
  documentNumber: z.string().optional(),

  shortBio: z.string().optional(),
  bio: z.string().optional(),
  personalStory: z.string().optional(),
  locationText: z.string().optional(),

  photoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),

  email: z
    .string()
    .email("Ingresa un correo válido")
    .optional()
    .or(z.literal("")),

  phone: z.string().optional(),
  whatsapp: z.string().optional(),

  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),

  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

export type EntrepreneurFormValues = z.infer<typeof entrepreneurSchema>;
