import { Accessor } from "solid-js";


/**
 * Wraps the properties of `T` selected by `K` in `Accessor`, leaving all others unchanged.
 * @example type P = Accessorize<{ a: number; b: string }, "a">; // { a: Accessor<number>; b: string }
 */
export type Accessorize<T, K extends keyof T = keyof T> = {
  [P in keyof T]: P extends K ? Accessor<T[P]> : T[P];
};

export type Unwrap<V> = V extends Accessor<infer R> ? R : V;

export type DeAccessorize<T, K extends keyof T = keyof T> = {
  [P in keyof T]: P extends K ? Unwrap<T[P]> : T[P];
};
/**
 * Replaces the types of the properties of `T` selected by `K` with `V`, adding any that are missing.
 * @example type R = Override<{ a?: number; b: string }, "a", boolean>; // { a?: boolean; b: string }
 */
export type Override<T, K extends PropertyKey, V> = {
  [P in keyof T]: P extends K ? V : T[P];
} & { [P in Exclude<K, keyof T>]: V };