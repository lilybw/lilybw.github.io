import { createSignal, type Component, type JSX, type Signal } from "solid-js";

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
    /** Maps the current color to the fan's card fills: front, back-left, back-right. Defaults to the color itself. */
    palette?: (color: HSL) => ReadonlyArray<string>;
}

/** Formats an `HSL` as a CSS `hsl()` color string. */
export const toCss = (c: HSL): string => `hsl(${c.h} ${c.s}% ${c.l}%)`;

const wrap = (deg: number): number => ((deg % 360) + 360) % 360;
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

const FanCard: Component<{ fill: string; rotate: number }> = (p) => (
    <rect
        x="8" y="3.5" width="8" height="16" rx="2.2"
        transform={`rotate(${p.rotate} 12 19)`}
        style={{
            fill: p.fill,
            stroke: "rgba(10, 8, 25, 0.5)",
            "stroke-width": "1.2px",
            "stroke-linejoin": "round",
            "paint-order": "stroke",
        }}
    />
);

/** Swatch displaying the current color. Drag X shifts hue (wrapping), drag Y sets saturation (up = more),
 *  scroll sets lightness (up = lighter), double-click resets to `initial`. */
export const HueSatPicker: Component<HueSatPickerProps> = (props) => {
    const original: HSL = props.initial ?? { h: 270, s: 70, l: 60 };
    const [color, setColor]: Signal<HSL> = createSignal<HSL>(original);
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

    const reset = (): void => commit(original);

    const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
        if (e.key === "Home") {
            e.preventDefault();
            reset();
            return;
        }
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

    // Host must not form a stacking context (no filter/transform/opacity), or the frame's blend is isolated.
    const hostStyle = (): JSX.CSSProperties => {
        const size: string = props.size ?? "3rem";
        return {
            position: "relative",
            display: "block",
            margin: "auto",
            width: size,
            "min-width": size,
            height: size,
            "min-height": size,
            "border-radius": "1rem",
            cursor: dragging() ? "grabbing" : "grab",
            "touch-action": "none",
            "user-select": "none",
        };
    };

    const layer = (inset: string, radius: string): JSX.CSSProperties => ({
        position: "absolute",
        inset,
        "border-radius": radius,
        transform: dragging() ? "scale(1.1)" : "none",
        transition: "transform 120ms ease",
    });

    const frameStyle = (): JSX.CSSProperties => ({
        ...layer("0", "1rem"),
        background: "var(--DOBG-purple)",
        filter: "drop-shadow(rgba(0,0,0,0.5) 0 0 10px)",
        "mix-blend-mode": "difference",
    });

    const iconStyle = (): JSX.CSSProperties => ({
        ...layer("auto", "0"),
        top: "8%",
        left: "8%",
        width: "84%",
        height: "84%",
        overflow: "visible",
    });

    const fills = (): [string, string, string] => {
        const p: ReadonlyArray<string> = props.palette?.(color()) ?? [];
        const front: string = p[0] ?? toCss(color());
        return [front, p[1] ?? front, p[2] ?? front];
    };

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
            style={hostStyle()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onLostPointerCapture={onPointerEnd}
            onWheel={onWheel}
            onDblClick={reset}
            onKeyDown={onKeyDown}
        >
            <div style={frameStyle()} />
            <svg viewBox="0 0 24 24" aria-hidden="true" style={iconStyle()}>
                <FanCard fill={fills()[1]} rotate={-28} />
                <FanCard fill={fills()[2]} rotate={28} />
                <FanCard fill={fills()[0]} rotate={0} />
            </svg>
        </div>
    );
};