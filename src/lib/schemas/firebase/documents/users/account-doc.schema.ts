import { PersonNameSchema } from "@/lib/schemas/common/person-name.schema";
import { FirestoreStandardStampsSchema } from "@/lib/schemas/firebase/firestore-stamps.schema";
import { z } from "zod";

export const AccountDocSchema = z
  .object({
    ...FirestoreStandardStampsSchema.shape,
    name: PersonNameSchema.optional(),
  })
  .describe(
    "Private, ready-only user data that can only be updated via the Firebase Admin SDK.",
  );

export type AccountDoc = z.infer<typeof AccountDocSchema>;
