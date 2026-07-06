import { z } from "zod";

export const categorySchema = z.object({
  parentId: z.string().nullable().optional(),

  name: z.string().min(2, "Mínimo 2 caracteres"),

  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),

  description: z.string().optional(),

  iconUrl: z.string().optional(),

  type: z.enum(["entrepreneur", "product", "both"]),

  sortOrder: z.number().optional(),

  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
