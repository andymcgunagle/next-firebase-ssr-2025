import { z } from "zod";

export const FirebaseUidSchema = z.string().trim();

export type FirebaseUid = z.infer<typeof FirebaseUidSchema>;
