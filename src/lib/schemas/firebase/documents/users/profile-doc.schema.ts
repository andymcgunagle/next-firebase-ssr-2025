import { PersonNameSchema } from "@/lib/schemas/common/person-name.schema";
import { FirestoreStandardStampsSchema } from "@/lib/schemas/firebase/firestore-stamps.schema";
import { z } from "zod";

export const ProfileDocSchema = z
  .object({
    ...FirestoreStandardStampsSchema.shape,
    name: PersonNameSchema.optional(),
  })
  .describe("Publicly available user data.");

export type ProfileDoc = z.infer<typeof ProfileDocSchema>;
