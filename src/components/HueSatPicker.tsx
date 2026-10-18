import { createSignal, type Component, type JSX, type Signal } from "solid-js";
import { RAY_INIT_COLOR } from "~/app";

/** A color in HSL space. Hue in degrees [0, 360); saturation and lightness in percent [0, 100]. */
export interface HSL {
    h: number;
    s: number;
    l: number;
}

export interface HueSatPickerProps {
    /** Starting color. Defaults to `{ h: 270, s: 70, l: 60 }`. */
    initial?: HSL;
    /** Called on every color change. */
    onChange?: (color: HSL) => void;
    /** Degrees of hue per pixel dragged horizontally. Defaults to `1`. */
    hueRate?: number;
    /** Percent saturation per pixel dragged vertically. Defaults to `0.5`. */
    satRate?: number;
    /** Percent lightness per pixel scrolled. Defaults to `0.05`. */
    lightRate?: number;
    /** Edge length of the swatch. Defaults to `"3rem"`. */
    size?: string;
}

/** Formats an `HSL` as a CSS `hsl()` color string. */
export const toCss = (c: HSL): string => `hsl(${c.h} ${c.s}% ${c.l}%)`;

const wrap = (deg: number): number => ((deg % 360) + 360) % 360;
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Swatch displaying the current color. Drag X shifts hue (wrapping), drag Y sets saturation (up = more),
 *  scroll sets lightness (up = lighter). */
export const HueSatPicker: Component<HueSatPickerProps> = (props) => {
    const [color, setColor]: Signal<HSL> = createSignal<HSL>(props.initial ?? { h: 270, s: 70, l: 60 });
    const [dragging, setDragging]: Signal<boolean> = createSignal<boolean>(false);
    let last: { x: number; y: number } | null = null;

    const commit = (next: HSL): void => {
        setColor(next);
        props.onChange?.(next);
    };

    const nudge = (dh: number, ds: number, dl: number): void => {
        const c: HSL = color();
        commit({ h: wrap(c.h + dh), s: clamp(c.s + ds, 0, 100), l: clamp(c.l + dl, 0, 100) });
    };

    const onPointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        last = { x: e.clientX, y: e.clientY };
        setDragging(true);
    };

    const onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
        if (!last) return;
        const dx: number = e.clientX - last.x;
        const dy: number = e.clientY - last.y;
        last = { x: e.clientX, y: e.clientY };
        nudge(dx * (props.hueRate ?? 1), -dy * (props.satRate ?? 0.5), 0);
    };

    const onWheel: JSX.EventHandler<HTMLDivElement, WheelEvent> = (e) => {
        e.preventDefault();
        const unit: number = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? 400 : 1;
        nudge(0, 0, -e.deltaY * unit * (props.lightRate ?? 0.05));
    };

    const onPointerEnd = (): void => {
        last = null;
        setDragging(false);
    };

    const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
        const step: number = e.shiftKey ? 10 : 2;
        const moves: Record<string, [number, number, number]> = {
            ArrowLeft: [-step, 0, 0],
            ArrowRight: [step, 0, 0],
            ArrowUp: [0, step, 0],
            ArrowDown: [0, -step, 0],
            PageUp: [0, 0, step],
            PageDown: [0, 0, -step],
        };
        const move: [number, number, number] | undefined = moves[e.key];
        if (!move) return;
        e.preventDefault();
        nudge(move[0], move[1], move[2]);
    };

    const style = (): JSX.CSSProperties => {
        const size: string = props.size ?? "3rem";
        return {
            display: "block",
            margin: "auto",
            width: size,
            "min-width": size,
            height: size,
            "min-height": size,
            "border-radius": "1rem",
            background: toCss(color()),
            cursor: dragging() ? "grabbing" : "grab",
            "touch-action": "none",
            "user-select": "none",
            transform: dragging() ? "scale(1.1)" : "none",
            transition: "transform 120ms ease",
        };
    };

    const reset = (): void => commit(RAY_INIT_COLOR);

    return (
        <div
            role="slider"
            tabindex="0"
            aria-label="Color"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(color().h)}
            aria-valuetext={`Hue ${Math.round(color().h)}°, saturation ${Math.round(color().s)}%, lightness ${Math.round(color().l)}%`}
            title="hue ↔ saturation ↕ lightness <scroll> dbclick for reset"
            style={style()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onLostPointerCapture={onPointerEnd}
            onWheel={onWheel}
            onKeyDown={onKeyDown}
            onDblClick={reset}
        />
    );
};