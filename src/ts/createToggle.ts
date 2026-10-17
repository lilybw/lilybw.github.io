import { Accessor, createSignal, Signal } from "solid-js";

type VoidFunc = () => void;
export type SetOn = VoidFunc;
export type SetOff = VoidFunc;
type Toggle<T> = [state: Accessor<T>, [setOn: SetOn, setOff: SetOff]];

/** States a toggle switches between; `default` falls back to `offState`. */
export type ToggleOptions<T> = { default?: T; onState: T; offState: T };

/**
 * Creates a reactive value switching between two states; boolean unless both states are given.
 * @example
 * const [open, show, hide]: Toggle<boolean> = createToggle();
 * const [theme, dark, light]: Toggle<"dark" | "light"> = createToggle<"dark" | "light">({ onState: "dark", offState: "light" });
 */
export function createToggle(options?: Partial<ToggleOptions<boolean>>): Toggle<boolean>;
export function createToggle<T>(options: ToggleOptions<T>): Toggle<T>;
export function createToggle(options: Partial<ToggleOptions<unknown>> = {}): Toggle<unknown> {
    const onState: unknown = "onState" in options ? options.onState : true;
    const offState: unknown = "offState" in options ? options.offState : false;
    const initial: unknown = "default" in options ? options.default : offState;
    const [state, setState]: Signal<unknown> = createSignal<unknown>(initial);
    return [
        state,
        [(): void => { setState(() => onState); },
        (): void => { setState(() => offState); },]
    ];
}