/* eslint-disable @typescript-eslint/no-explicit-any */

/** Allows type to be `undefined` or `null`. */
export type Maybe<T> = T | undefined | null;

/** Allows type to be `null`. */
export type Nullable<T> = T | null;

export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>;

export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;

/** Allows you to still get autocomplete on a string union that can also be any string. */
export type LooseStringUnion<T extends string> = T | (string & {});

/** Extracts a type from a union that strictly matches the specified type. */
export type StrictExtract<T, U extends T> = U;

/** Creates a union type from the values of an object. */
export type ValueOf<T extends object> = T[keyof T];

/** Makes all properties in a type nullable. */
export type MaybeRecord<T extends Record<string, any>> = {
  [K in keyof T]: Maybe<T[K]>;
};

/** Makes TypeScript output more readable. */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/** Allows for the creation of a new type with all properties prefixed by a specified string. */
export type PrefixProperties<TPrefix extends string, Type> = {
  [Property in keyof Type as `${TPrefix}${Capitalize<string & Property>}`]: Type[Property];
};

/**
 * @description
 * - Require the selected keys in T to be required, while keeping the rest of T as is.
 * - This is useful for cases where you want to ensure certain properties are always present, but still allow the rest of the properties to be optional.
 *
 * @example
 * type TextareaWithId = RequireSpecifiedKeys<TextareaProps, "id">;
 */
export type RequireSpecifiedKeys<T, K extends keyof T> = RequiredPick<T, K> & T;
