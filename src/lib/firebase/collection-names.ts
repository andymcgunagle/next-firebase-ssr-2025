import { z } from "zod/v4";

export const CollectionNamesSchema = z.enum(["accounts"]);

export type CollectionName = z.infer<typeof CollectionNamesSchema>;
