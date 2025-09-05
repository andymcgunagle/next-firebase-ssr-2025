import type { WithId } from "@/types/common";
import { z } from "zod";

export const FirestoreDocIdSchema = z.string().trim();

export type FirestoreDocId = z.infer<typeof FirestoreDocIdSchema>;

export type FirestoreDocsWithIds<TDoc> = WithId<TDoc>[];
