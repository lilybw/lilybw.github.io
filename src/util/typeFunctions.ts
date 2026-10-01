import { Accessorize, DeAccessorize, Override } from "./types";

/** A type-level function: reads its argument from `in`, yields its result as `out`. */
export interface Fn {
  readonly in: unknown;
  readonly out: unknown;
}

/**
 * Applies type-level function `F` to `X`.
 * @example type R = Apply<OmitF<"a">, { a: 1; b: 2 }>; // { b: 2 }
 */
export type Apply<F extends Fn, X> = (F & { readonly in: X })["out"];

/** The identity `Fn`; yields its input unchanged. */
export interface Id extends Fn {
  readonly out: this["in"];
}

/**
 * Applies up to eight `Fn`s to `T`, left to right.
 * @example type R = Pipe<User, OmitF<"password">, AccessorizeF<"name">>;
 */
export type Pipe<
  T,
  A extends Fn = Id, B extends Fn = Id, C extends Fn = Id, D extends Fn = Id,
  E extends Fn = Id, F extends Fn = Id, G extends Fn = Id, H extends Fn = Id,
> = Apply<H, Apply<G, Apply<F, Apply<E, Apply<D, Apply<C, Apply<B, Apply<A, T>>>>>>>>;

export type PipeAll<T, Fs extends readonly Fn[]> =
  Fs extends readonly [infer F extends Fn, ...infer Rest extends readonly Fn[]]
    ? PipeAll<Apply<F, T>, Rest>
    : T;
/**
 * Composes `Fs` into a single reusable `Fn`.
 * @example type Pub = Compose<[OmitF<"pw">, AccessorizeF<"name">]>; type R = Apply<Pub, User>;
 */
export interface Compose<Fs extends readonly Fn[]> extends Fn {
  readonly out: PipeAll<this["in"], Fs>;
}


/** Lifts `Omit<_, K>` into an `Fn`. */
export interface OmitF<K extends PropertyKey> extends Fn {
  readonly out: Omit<this["in"], K>;
}

/** Lifts `Accessorize<_, K>` into an `Fn`; keys absent from the input are ignored. */
export interface AccessorizeF<K extends PropertyKey> extends Fn {
  readonly out: Accessorize<this["in"], K & keyof this["in"]>;
}

export interface DeAccessorizeF<K extends PropertyKey> extends Fn {
    readonly out: DeAccessorize<this["in"], K & keyof this["in"]>;
}



/** Lifts `Override<_, K, V>` into an `Fn`. */
export interface OverrideF<K extends PropertyKey, V> extends Fn {
  readonly out: Override<this["in"], K, V>;
}