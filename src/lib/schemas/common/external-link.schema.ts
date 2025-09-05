import { z } from "zod";

export const ExternalLinkSchema = z.object({
  href: z.url(),
  label: z.string().optional(),
});

export type ExternalLink = z.infer<typeof ExternalLinkSchema>;
