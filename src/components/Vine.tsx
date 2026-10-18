import { createUniqueId, mergeProps, onCleanup, onMount, type JSX } from "solid-js";
import { vines, type VineArt, type VineVariant } from "~/components/Vines";

/** Props for {@link Vine}. Colors accept any CSS color; durations are in milliseconds. */
export interface VineProps {
  variant: VineVariant;
  /** Resting stroke color and opacity. */
  color?: string;
  baseOpacity?: number;
  /** Peak color and opacity of a passing pulse. */
  pulseColor?: string;
  pulseOpacity?: number;
  /** Random wait between pulses as [min, max]; `false` disables automatic pulses. */
  interval?: readonly [number, number] | false;
  /** Wait before the first pulse; random within `interval` when omitted. */
  delay?: number;
  /** Time for one pulse to travel from root to tip. */
  duration?: number;
  /** Pulse length as a fraction of the vine's length. */
  band?: number;
  /** Adds a soft blurred halo that only appears while a pulse passes. */
  glow?: boolean;
  /** Stem width in CSS pixels; branches and leaves use 60% of it. */
  strokeWidth?: number;
  /** Mirrors the artwork, e.g. `"x"` turns the top-left corner into top-right. */
  flip?: "x" | "y" | "xy";
  /** Receives a function that fires a pulse on demand, e.g. on hover or navigation. */
  pulseRef?: (pulse: () => void) => void;
  class?: string;
  style?: JSX.CSSProperties;
}

type Defaulted = "color" | "baseOpacity" | "pulseColor" | "pulseOpacity" | "interval" | "duration" | "band" | "glow" | "strokeWidth";
type ResolvedProps = VineProps & Required<Pick<VineProps, Defaulted>>;

const DEFAULTS: Required<Pick<VineProps, Defaulted>> = {
  color: "#ffffff",
  baseOpacity: 0.14,
  pulseColor: "#d4f7ff",
  pulseOpacity: 0.9,
  interval: [6000, 14000],
  duration: 2600,
  band: 0.4,
  glow: true,
  strokeWidth: 1,
};

const between = (min: number, max: number): number => min + Math.random() * (max - min);

/**
 * Decorative stroke-only vine whose gradient sends occasional energy pulses from root to tip.
 * @example <Vine variant="corner" flip="x" pulseColor="#9be7ff" interval={[4000, 9000]} class="vine-tr" />
 */
export function Vine(rawProps: VineProps): JSX.Element {
  const props: ResolvedProps = mergeProps(DEFAULTS, rawProps);
  const art: VineArt = vines[props.variant];
  const uid: string = `vine${createUniqueId().replace(/\W/g, "")}`;
  const anims: SVGAnimateTransformElement[] = [];

  // Gradient band sits just behind the root at rest and travels past the tip on each pulse.
  const [ax1, ay1, ax2, ay2]: readonly [number, number, number, number] = art.axis;
  const length: number = Math.hypot(ax2 - ax1, ay2 - ay1);
  const ux: number = (ax2 - ax1) / length;
  const uy: number = (ay2 - ay1) / length;
  const bandLength: number = length * props.band;
  const travel: string = `${ux * (length + bandLength)} ${uy * (length + bandLength)}`;
  const [vx, vy, vw, vh]: readonly [number, number, number, number] = art.viewBox;

  const pulse = (): void => {
    for (const a of anims) a.beginElement();
  };

  onMount((): void => {
    props.pulseRef?.(pulse);
    const interval: readonly [number, number] | false = props.interval;
    if (interval === false || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number = 0;
    const loop = (wait: number): void => {
      timer = window.setTimeout((): void => {
        if (!document.hidden) pulse();
        loop(between(interval[0], interval[1]));
      }, wait);
    };
    loop(props.delay ?? between(interval[0] * 0.15, interval[1]));
    onCleanup((): void => window.clearTimeout(timer));
  });

  const gradient = (id: string, restOpacity: number, peakOpacity: number, peakColor: string): JSX.Element => (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={ax1 - ux * bandLength}
      y1={ay1 - uy * bandLength}
      x2={ax1}
      y2={ay1}
    >
      <stop offset="0" stop-color={props.color} stop-opacity={restOpacity} />
      <stop offset="0.75" stop-color={peakColor} stop-opacity={peakOpacity} />
      <stop offset="1" stop-color={props.color} stop-opacity={restOpacity} />
      <animateTransform
        ref={(el: SVGAnimateTransformElement): void => void anims.push(el)}
        attributeName="gradientTransform"
        type="translate"
        from="0 0"
        to={travel}
        dur={`${props.duration}ms`}
        begin="indefinite"
        fill="remove"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.35 0 0.45 1"
      />
    </linearGradient>
  );

  const strokes = (paint: string, scale: number): JSX.Element => (
    <g fill="none" stroke={paint} stroke-linecap="round" stroke-linejoin="round">
      <path d={art.stem} stroke-width={props.strokeWidth * scale} vector-effect="non-scaling-stroke" />
      <path d={art.fine} stroke-width={props.strokeWidth * 0.6 * scale} vector-effect="non-scaling-stroke" />
    </g>
  );

  const flipTransform: string | undefined = props.flip
    ? `scale(${props.flip.includes("x") ? -1 : 1}, ${props.flip.includes("y") ? -1 : 1})`
    : undefined;

  return (
    <svg
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      width={vw}
      height={vh}
      class={props.class}
      style={{ "pointer-events": "none", overflow: "visible", transform: flipTransform, ...props.style }}
      aria-hidden="true"
    >
      <defs>
        {gradient(`${uid}-g`, props.baseOpacity, props.pulseOpacity, props.pulseColor)}
        {props.glow && gradient(`${uid}-h`, 0, props.pulseOpacity * 0.55, props.pulseColor)}
        {props.glow && (
          <filter id={`${uid}-f`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        )}
      </defs>
      {props.glow && <g filter={`url(#${uid}-f)`}>{strokes(`url(#${uid}-h)`, 3)}</g>}
      {strokes(`url(#${uid}-g)`, 1)}
    </svg>
  );
}