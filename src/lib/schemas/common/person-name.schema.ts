import { z } from "zod";

export const PersonNameSchema = z.object({
  first: z.string().optional(),
  last: z.string().optional(),
});

export type PersonName = z.infer<typeof PersonNameSchema>;
