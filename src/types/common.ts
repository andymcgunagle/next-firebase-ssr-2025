import type { JSX } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TODO = any;

export type HeadingTag = Extract<
  keyof JSX.IntrinsicElements,
  `h${1 | 2 | 3 | 4 | 5 | 6}`
>;

export type WithId<T> = T & { id: string };
