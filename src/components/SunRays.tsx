import type { HSL } from "./HueSatPicker";
import "./SunRays.css";
import type { Accessor, JSX } from "solid-js";

interface SunRaysProps {
  numRays?: number;
  mvmtFrequencyMultiplier?: number;
  /* Default 0 to -numRays */
  zRangeStart?: number;
  /** Base ray color. Exposed to rays as `--ray-h`, `--ray-s` and `--ray-l`. */
  colorShift: Accessor<HSL>;
}

/** Hue offset per ray (cycled by index) relative to `colorShift().h`; `null` renders a white ray. */
const HUE_OFFSETS: ReadonlyArray<number | null> = [0, 50, null, 50];

export default function SunRays(props: SunRaysProps): JSX.Element {
  const numRays: number = props.numRays ?? 12;
  const freqMul: number = props.mvmtFrequencyMultiplier ?? 1;
  const rayStyles: JSX.CSSProperties[] = Array.from(
    { length: numRays },
    (_: unknown, i: number): JSX.CSSProperties => computeRayStyle(i, numRays, freqMul),
  );

  const colorVars = (): JSX.CSSProperties => {
    const c: HSL = props.colorShift();
    return { "--ray-h": `${c.h}`, "--ray-s": `${c.s}%`, "--ray-l": `${c.l}%` };
  };

  return (
    <div class="sun-rays" style={colorVars()}>
      {rayStyles.map((style: JSX.CSSProperties) => (
        <div class="sun-ray" style={style} />
      ))}
    </div>
  );
}

const computeRayStyle = (
  index: number,
  numRays: number,
  freqMul: number,
): JSX.CSSProperties => {
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
  const rayColor: string =
    hueOffset === null
      ? `hsl(0, 0%, 100%)`
      : `hsl(
            calc(var(--ray-h) + ${hueOffset}),
            calc(var(--ray-s) * var(--bg-saturation-multiplier)),
            calc(var(--ray-l) * var(--bg-lightness-multiplier))
        )`;
  const computedBackground: string = `linear-gradient(
            -56deg,
            transparent ${50 - rayWidth / 2}%,
            ${rayColor},
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