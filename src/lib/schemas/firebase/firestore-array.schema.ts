import { FieldValue } from "firebase/firestore";
import { z } from "zod";

/** @see https://github.com/colinhacks/zod/issues/1065#issuecomment-1093557684 */
export const FieldValueSchema = z
  .custom<FieldValue>((arg) => arg instanceof FieldValue)
  .refine((value) => value instanceof FieldValue, {
    message: "Expected a Firestore FieldValue instance.",
  });

export const FirestoreArraySchema = <TSchema extends z.ZodType>(schema: TSchema) =>
  z.union([
    z.array(schema), // client
    z.union([z.array(schema), FieldValueSchema]), // server
  ]);
