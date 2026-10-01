import { Accessor, type JSX, createEffect, createSignal, on, onCleanup, onMount, splitProps } from "solid-js";
import "./KnockoutButton.css";
import { Accessorize } from "~/util/types";
import { AccessorizeF, OmitF, Pipe } from "~/util/typeFunctions";

/** Props for {@link KnockoutButton}; native button attributes are forwarded to the `<button>`.
 *  `children` must be one string, since it is rendered into the mask image. */
export type KnockoutButtonProps = Pipe<JSX.ButtonHTMLAttributes<HTMLButtonElement>, OmitF<"children">, AccessorizeF<"style">> & {
    children: string;
    textStyle?: JSX.HTMLAttributes<JSX.Element>
};

const escapeXml = (s: string): string => s.replace(/[&<>"']/g, (c: string): string => `&#${c.charCodeAt(0)};`);

let metrics: CanvasRenderingContext2D | null = null;

/** Returns the alphabetic baseline offset of `font` inside a line box of `height` px. */
const baselineOf = (text: string, font: string, height: number): number => {
  metrics ??= document.createElement("canvas").getContext("2d");
  if (!metrics) return height * 0.8;
  metrics.font = font;
  const m: TextMetrics = metrics.measureText(text);
  return (height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
};

/** Returns a CSS `url()` of an SVG rendering `text` with `el`'s computed font, sized to `el`. */
const textMask = (text: string, el: HTMLElement): string => {
  const cs: CSSStyleDeclaration = getComputedStyle(el);
  const w: number = el.offsetWidth;
  const h: number = el.offsetHeight;
  const font: string = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const svg: string =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<text x="${w / 2}" y="${baselineOf(text, font, h)}" text-anchor="middle" ` +
    `style="font:${escapeXml(font)};letter-spacing:${cs.letterSpacing}">${text}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/** A button whose label is cut out of its blurred backdrop, revealing the unfiltered content behind.
 *  Tune via `--knockout-radius`, `--knockout-border` and `--knockout-filter`. */
export function KnockoutButton(props: KnockoutButtonProps): JSX.Element {
  const [local, rest] = splitProps(props, ["children", "class", "textStyle", "style"]);
  const [maskStyle, setMaskStyle] = createSignal<JSX.CSSProperties>({});
  let label!: HTMLSpanElement;

  const update = (): void => {
    if (!label.isConnected) return;
    setMaskStyle({
      "mask-image": `${textMask(local.children, label)}, linear-gradient(white 0 0)`,
      "mask-position": `${label.offsetLeft}px ${label.offsetTop}px, 0 0`,
    });
  };

  onMount((): void => {
    const observer: ResizeObserver = new ResizeObserver(update);
    observer.observe(label);
    if (label.offsetParent) observer.observe(label.offsetParent);
    void document.fonts.ready.then(update);
    onCleanup((): void => observer.disconnect());
  });
  createEffect(on((): string => local.children, update, { defer: true }));


  return (
    <button {...rest} style={props.style?.()} class={local.class ? `knockout-button ${local.class}` : "knockout-button"}>
      <span class="knockout-button__layer" aria-hidden="true" style={maskStyle()} />
      <span {...local.textStyle} ref={label} class="knockout-button__label">{local.children}</span>
    </button>
  );
}