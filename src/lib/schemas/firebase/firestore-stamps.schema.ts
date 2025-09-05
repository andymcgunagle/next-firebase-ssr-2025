import type { MockFirebaseAdminTimestampType } from "@/types/mock-firebase-admin-timestamp";
import type { serverTimestamp } from "firebase/firestore";
import { FieldValue, Timestamp } from "firebase/firestore";
import { z } from "zod";
import { FirebaseUidSchema } from "./firebase-uid.schema";

export const FirestoreTimestampSchema = z.union([
  /**
   * - `Timestamp` from `firebase/firestore` package.
   * - This is the most common type used in client-side code, as it is the type returned by Firestore queries.
   */
  z.instanceof(Timestamp),

  /**
   * - `Timestamp` or `FieldValue` from `firebase/firestore` package.
   * - `serverTimestamp` is used most often, which is a `FieldValue` instance.
   * - `Timestamp.fromDate(new Date(dateString))` is also used, which is a `Timestamp` instance.
   */
  z.custom<ReturnType<typeof serverTimestamp> | Timestamp>(
    (value) => value instanceof FieldValue || value instanceof Timestamp,
    { message: "Expected a Firestore FieldValue or Timestamp instance." },
  ),

  /**
   * - `Timestamp` from `firebase-admin` package.
   * - The `firebase-admin` cannot be used directly in client-side code, and using z.instanceof() with a mock class instance still causes errors when parsing.
   * - This custom type simply checks if the value is a class instance.
   */
  z.custom<MockFirebaseAdminTimestampType>(
    (val) => {
      return (
        typeof val === "object" &&
        val !== null &&
        typeof val.constructor === "function" &&
        val.constructor !== Object &&
        !Array.isArray(val)
      );
    },
    { message: "FirestoreTimestampSchema expected a class instance." },
  ),
]);

export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>;

/** Creates a union of all the keys in an object that end with "At". */
export type TimestampKeys<T> = {
  [K in keyof T]: K extends `${string}At` ? K : never;
}[keyof T];

export const FirestoreStandardTimestampsSchema = z.object({
  createdAt: FirestoreTimestampSchema,
  deletedAt: FirestoreTimestampSchema.optional(),
  updatedAt: FirestoreTimestampSchema,
});

export type FirestoreStandardTimestamps = z.infer<
  typeof FirestoreStandardTimestampsSchema
>;

export const FirestoreStandardUidStampsSchema = z.object({
  createdBy: FirebaseUidSchema,
  deletedBy: FirebaseUidSchema.optional(),
  updatedBy: FirebaseUidSchema,
});

export const FirestoreStandardStampsSchema = z.object({
  ...FirestoreStandardTimestampsSchema.shape,
  ...FirestoreStandardUidStampsSchema.shape,
});

export type FirestoreStandardStamps = z.infer<typeof FirestoreStandardStampsSchema>;

export const FirestoreStandardNewDocStampsSchema =
  FirestoreStandardStampsSchema.omit({
    deletedAt: true,
    deletedBy: true,
  });

export type FirestoreStandardNewDocStamps = z.infer<
  typeof FirestoreStandardNewDocStampsSchema
>;

export const FirestoreUpdatedStampsSchema = FirestoreStandardStampsSchema.pick({
  updatedAt: true,
  updatedBy: true,
});

export type FirestoreUpdatedStamps = z.infer<typeof FirestoreUpdatedStampsSchema>;
