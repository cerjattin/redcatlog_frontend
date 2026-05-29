import { z } from "zod";

export const createProductSchema = z.object({
  businessId: z.string().min(1, "Selecciona un emprendimiento"),
  categoryId: z.string().nullable().optional(),
  name: z.string().min(3, "El nombre debe tener mínimo 3 caracteres"),
  slug: z
    .string()
    .min(3, "El slug debe tener mínimo 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  hasPrice: z.boolean(),
  stock: z.number().optional(),
  managesStock: z.boolean(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
