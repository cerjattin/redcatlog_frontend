import { z } from "zod";

export const entrepreneurProfileSchema = z.object({
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
  personalStory: z.string().optional(),
  shortBio: z.string().optional(),
  locationText: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
});

export type EntrepreneurProfileFormValues = z.infer<
  typeof entrepreneurProfileSchema
>;
