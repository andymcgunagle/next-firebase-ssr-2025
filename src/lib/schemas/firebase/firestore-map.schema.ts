/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export function FirestoreMapSchema<TSchema extends z.ZodType<any, any, any>>(
  schema: TSchema,
) {
  /** Keys in Firestore records must be strings. */
  return z.record(z.string(), schema);
}
