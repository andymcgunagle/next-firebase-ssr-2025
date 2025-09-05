/** These types aren't 100% accurate (they don't account for non-enumerable or inherited keys, symbol keys, optional/absent props, or index signatures - `keyof T` may not match the object's own enumerable string keys at runtime), but they're good enough to be useful at the moment. If you encounter more complex use cases, consider refining these types further. */
export class TypedObject {
  public static keys<T extends object>(object: T) {
    return Object.keys(object) as (keyof T)[];
  }

  public static values<T extends object>(object: T) {
    return Object.values(object) as T[keyof T][];
  }

  public static entries<T extends object>(object: T) {
    return Object.entries(object) as Array<
      {
        [K in keyof T]: [K, T[K]];
      }[keyof T]
    >;
  }

  public static fromEntries<K extends PropertyKey, V>(
    entries: [K, V][],
  ): Record<K, V> {
    return Object.fromEntries(entries) as Record<K, V>;
  }
}
