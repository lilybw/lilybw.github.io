import type { HSL } from "./HueSatPicker";
import "./SunRays.css";
import type { Accessor, JSX } from "solid-js";

interface SunRaysProps {
  numRays?: number;
  mvmtFrequencyMultiplier?: number;
  /* Default 0 to -numRays */
  zRangeStart?: number;
  /** Base ray color. Exposed to rays as `--ray-h`, `--ray-s`, `--ray-l` and `--ray-neutral`. */
  colorShift: Accessor<HSL>;
}

/** Hue offset per ray (cycled by index) relative to `colorShift().h`; `null` renders a neutral ray. */
export const HUE_OFFSETS: ReadonlyArray<number | null> = [0, 50, null, 50];

/** Base lightness (percent) below which neutral rays turn black instead of white. */
export const NEUTRAL_FLIP_LIGHTNESS: number = 50;

/** CSS expressions for each color channel; either literals or `var()` references. */
interface ColorExprs {
  h: string;
  s: string;
  l: string;
  neutral: string;
}

const neutralFor = (l: number): string =>
  l < NEUTRAL_FLIP_LIGHTNESS ? "hsl(0 0% 0%)" : "hsl(0 0% 100%)";

const literalExprs = (c: HSL): ColorExprs => ({
  h: `${c.h}`,
  s: `${c.s}%`,
  l: `${c.l}%`,
  neutral: neutralFor(c.l),
});

const VAR_EXPRS: ColorExprs = {
  h: "var(--ray-h)",
  s: "var(--ray-s)",
  l: "var(--ray-l)",
  neutral: "var(--ray-neutral)",
};

const rayColor = (c: ColorExprs, hueOffset: number | null): string =>
  hueOffset === null
    ? c.neutral
    : `hsl(
            calc(${c.h} + ${hueOffset})
            calc(${c.s} * var(--bg-saturation-multiplier))
            calc(${c.l} * var(--bg-lightness-multiplier))
        )`;

/** The distinct ray colors for `base`, in `HUE_OFFSETS` order. */
export const RAY_PALETTE = (base: HSL): string[] => {
  const exprs: ColorExprs = literalExprs(base);
  return [...new Set(HUE_OFFSETS)].map((o: number | null): string => rayColor(exprs, o));
};

export default function SunRays(props: SunRaysProps): JSX.Element {
  const numRays: number = props.numRays ?? 12;
  const freqMul: number = props.mvmtFrequencyMultiplier ?? 1;
  const rayStyles: JSX.CSSProperties[] = Array.from(
    { length: numRays },
    (_: unknown, i: number): JSX.CSSProperties => computeRayStyle(i, numRays, freqMul),
  );

  const colorVars = (): JSX.CSSProperties => {
    const c: ColorExprs = literalExprs(props.colorShift());
    return { "--ray-h": c.h, "--ray-s": c.s, "--ray-l": c.l, "--ray-neutral": c.neutral };
  };

  return (
    <div class="sun-rays" style={colorVars()}>
      {rayStyles.map((style: JSX.CSSProperties) => (
        <div class="sun-ray" style={style} />
      ))}
    </div>
  );
}

const computeRayStyle = (index: number, numRays: number, freqMul: number): JSX.CSSProperties => {
  const rayMovementFrequency: number = (Math.random() - 0.5) * 2 * freqMul; // in Hz
  const baseLROffset: number = 200 / numRays + 100;
  const computedLROffset: string = `
        calc(
            sin(
                var(--site-elapsed-seconds) * ${rayMovementFrequency}
                + ${index}
            ) * 150vw
            - ${baseLROffset}vw
        )`;
  const computedRotation: string = `
        rotate(
            calc(
                var(--site-breath-driver) * ${freqMul} * 20deg
            )
        )`;
  const rayWidth: number = Math.random() * 5 + 5; // in vw, since the container is 400vw wide
  const hueOffset: number | null = HUE_OFFSETS[index % HUE_OFFSETS.length] ?? null;
  const computedBackground: string = `linear-gradient(
            -56deg,
            transparent ${50 - rayWidth / 2}%,
            ${rayColor(VAR_EXPRS, hueOffset)},
            transparent ${50 + rayWidth / 2}%
        )`;

  return {
    left: computedLROffset,
    top: `-100%`,
    background: computedBackground,
    "transform-origin": "top right",
    transform: computedRotation,
  };
};