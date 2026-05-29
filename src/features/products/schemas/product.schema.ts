import { z } from "zod";

export const productSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(2, "El nombre es obligatorio"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  hasPrice: z.boolean(),
  stock: z.number().optional(),
  managesStock: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
