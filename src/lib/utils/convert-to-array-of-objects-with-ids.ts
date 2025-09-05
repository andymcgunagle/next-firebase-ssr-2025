import { TypedObject } from "./typed-object";

export function convertToArrayOfObjectsWithIds<T extends object>(record: T) {
  return TypedObject.entries(record).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}
