import { JSX } from "solid-js/jsx-runtime";
import "./Menu.css"
import { createToggle, SetOff, SetOn } from "~/ts/createToggle";

export type MenuProps = {
    children?: JSX.Element;
}

const primeLeafBodyWidth = 8.8
const secondaryLeafBodyWidth = 10.4
const secondaryLeafOffst = 10
const secondaryLeafSpread = 45
const primeStartOffset = primeLeafBodyWidth * 0.66
const mkViewBox = (width: number, height: number) => `${-width} ${-height} ${width * 2} ${height * 2}`

export default function Menu(props: MenuProps) {
    // Primary
    const [aHover, aToggle] = createToggle()
    const [bHover, bToggle] = createToggle()
    const [cHover, cToggle] = createToggle()
    const [dHover, dToggle] = createToggle()

    // Secondary
    const [eHover, eToggle] = createToggle()
    const [fHover, fToggle] = createToggle()
    const [gHover, gToggle] = createToggle()
    const [hHover, hToggle] = createToggle()

    const toHtmlAttr = (toggle: [SetOn, SetOff]): JSX.PathSVGAttributes<SVGPathElement> => {
        return {
            "on:mouseenter": toggle[0],
            "on:mouseleave": toggle[1],
        }
    }

    return (
        <>
    <div class="Menu">
        <svg fill="transparent" viewBox={mkViewBox(50,50)} class="magicka">
            {/* Primary leaves */}
            <path d={primaryPetal(primeLeafBodyWidth, {x: 0, y: -1}, primeStartOffset)} {...toHtmlAttr(aToggle)}  class="petal"/>
            <path d={primaryPetal(primeLeafBodyWidth, {x: 1, y: 0}, primeStartOffset)} {...toHtmlAttr(bToggle)}  class="petal"/>
            <path d={primaryPetal(primeLeafBodyWidth, {x: 0, y: 1}, primeStartOffset)} {...toHtmlAttr(cToggle)}  class="petal"/>
            <path d={primaryPetal(primeLeafBodyWidth, {x: -1, y: 0}, primeStartOffset)} {...toHtmlAttr(dToggle)}  class="petal"/>
            {/* Secondary leaves */}
            <path d={secondaryPetal(secondaryLeafBodyWidth, {x: -0.5, y: -0.5}, secondaryLeafOffst, 2, secondaryLeafSpread)} {...toHtmlAttr(eToggle)} class="petal2" />
            <path d={secondaryPetal(secondaryLeafBodyWidth, {x: -0.5, y: 0.5}, secondaryLeafOffst, 2, secondaryLeafSpread)} {...toHtmlAttr(fToggle)} class="petal2" />
            <path d={secondaryPetal(secondaryLeafBodyWidth, {x: 0.5, y: 0.5}, secondaryLeafOffst, 2, secondaryLeafSpread)} {...toHtmlAttr(gToggle)} class="petal2" />
            <path d={secondaryPetal(secondaryLeafBodyWidth, {x: 0.5, y: -0.5}, secondaryLeafOffst, 2, secondaryLeafSpread)} {...toHtmlAttr(hToggle)} class="petal2" />
        </svg>
        {props.children}
    </div>
    {aHover() && TempTitle("About")}
    {bHover() && TempTitle("Career")}
    {cHover() && TempTitle("Projects")}
    {dHover() && TempTitle("TBD")}
    </>)
}

const TempTitle = (value: string) => 
    <h1 class="quintessential" style="color: white; position: absolute; width: 100vw; left: 50%; top: 12vh; transform: translateX(-50%); text-transform: uppercase;">{value}</h1>

const About = () => AbsolutelySquiggly(<div style="position: absolute; width: 100%; height; 100%">
        <h2 style="right:5vw; top:10vh; position: absolute;">ABOUT</h2>
        <svg stroke="rgba(255,255,255,0.75)" stroke-width={"1%"} viewBox={mkViewBox(50, 25)} style="position: absolute; width: 43vw; height: 20vh; top: 10vh; right: 12vw; filter: drop-shadow(0px 4px 2px rgba(0,0,0,0.55));">
            <path d="M -100 50 L -30 0 Z" />
            <path d="M -27 -1 L 100 -1 Z" />
        </svg>
</div>)
const Career = () => AbsolutelySquiggly(<></>)
const Projects = () => AbsolutelySquiggly(<></>)
const TBD = () => AbsolutelySquiggly(<></>)

const AbsolutelySquiggly = (children?: JSX.Element) => <div style="color: black" class="quintessential">{children}</div>

// Thanks Claude for making up for my D in Math

export type Vec2 = { x: number; y: number };

const v = (x: number, y: number): Vec2 => ({ x, y });
const add = (a: Vec2, b: Vec2): Vec2 => v(a.x + b.x, a.y + b.y);
const sub = (a: Vec2, b: Vec2): Vec2 => v(a.x - b.x, a.y - b.y);
const mul = (a: Vec2, k: number): Vec2 => v(a.x * k, a.y * k);
const lerp = (a: Vec2, b: Vec2, t: number): Vec2 => add(a, mul(sub(b, a), t));

/** Maps a local point (x along `dir`, y across it) to SVG coordinates; `flip` mirrors it across the axis. */
const toSvg = (dir: Vec2, p: Vec2, flip: 1 | -1 = 1): string =>
    `${(p.x * dir.x - flip * p.y * dir.y).toFixed(2)} ${(p.x * dir.y + flip * p.y * dir.x).toFixed(2)}`;

/** One side of a primary petal in local coordinates: base corner, 2 handles, belly, 2 handles, tip. */
function petalSide(baseWidth: number, offset: number): Vec2[] {
    const half: number = baseWidth / 2;
    const belly: number = baseWidth;           // half-width at the widest point
    const bellyAt: number = offset + baseWidth * 1;
    const tipAt: number = offset + baseWidth * 4;
    const lower: number = bellyAt - offset;    // base → belly
    const upper: number = tipAt - bellyAt;     // belly → tip
    return [
        v(offset, half),
        v(offset + lower * 0.3, belly), v(bellyAt - lower * 0.3, belly), v(bellyAt, belly),
        v(bellyAt + upper * 0.3, belly), v(tipAt - upper * 0.5, belly * 0.12), v(tipAt, 0),
    ];
}

/** Closed outline through a 7-point side (start, belly, tip, with cubic handles between) and its mirror. */
function outline(dir: Vec2, s: Vec2[]): string {
    const l = (i: number): string => toSvg(dir, s[i], -1);
    const r = (i: number): string => toSvg(dir, s[i]);
    return `M ${l(0)} C ${l(1)} ${l(2)} ${l(3)} C ${l(4)} ${l(5)} ${r(6)} C ${r(5)} ${r(4)} ${r(3)} C ${r(2)} ${r(1)} ${r(0)}`;
}

/** Parallel copy of a cubic, `g` units to the left of its direction of travel. */
function offsetCubic([p0, p1, p2, p3]: Vec2[], g: number): Vec2[] {
    const normal = (a: Vec2, b: Vec2): Vec2 => { const d: Vec2 = sub(b, a); return mul(v(-d.y, d.x), 1 / Math.hypot(d.x, d.y)); };
    const miter = (n: Vec2, m: Vec2): Vec2 => mul(add(n, m), g / (1 + n.x * m.x + n.y * m.y));
    const [n0, n1, n2]: Vec2[] = [normal(p0, p1), normal(p1, p2), normal(p2, p3)];
    return [add(p0, mul(n0, g)), add(p1, miter(n0, n1)), add(p2, miter(n1, n2)), add(p3, mul(n2, g))];
}

/** The part of a cubic from `t` to its end. */
function tail([a, b, c, d]: Vec2[], t: number): Vec2[] {
    const ab: Vec2 = lerp(a, b, t), bc: Vec2 = lerp(b, c, t), cd: Vec2 = lerp(c, d, t);
    const abc: Vec2 = lerp(ab, bc, t), bcd: Vec2 = lerp(bc, cd, t);
    return [lerp(abc, bcd, t), bcd, cd, d];
}

/** The part of a cubic beyond its outermost crossing of the centre line (y = 0), starting exactly on it. */
function fromAxis(c: Vec2[]): Vec2[] {
    const y = (t: number): number => tail(c, t)[0].y;
    let lo: number = 1;
    while (lo > 0 && y(lo) > 0) lo -= 1 / 64;
    if (y(lo) > 0) return [v(c[0].x, 0), c[1], c[2], c[3]]; // never reaches it: start straight below
    let hi: number = Math.min(lo + 1 / 64, 1);
    for (let i: number = 0; i < 24; i++) {
        const mid: number = (lo + hi) / 2;
        if (y(mid) > 0) hi = mid; else lo = mid;
    }
    const [start, ...rest]: Vec2[] = tail(c, hi);
    return [v(start.x, 0), ...rest];
}

/** SVG path for a primary petal growing out from the origin along `dir` (normalized).
 *  @example primaryPetal(16, { x: 0, y: -1 }, 10) // points straight up */
export function primaryPetal(baseWidth: number, dir: Vec2, offset: number): string {
    const side: Vec2[] = petalSide(baseWidth, offset);
    const innerCurveDepth: number = 1.3;
    const inner: string = toSvg(dir, v(offset * innerCurveDepth, 0));
    return `${outline(dir, side)} C ${inner} ${inner} ${toSvg(dir, side[0], -1)} Z`;
}

/** SVG path for a secondary petal along `dir`, between primaries `spread` degrees to either side.
 *  @example secondaryPetal(16, { x: Math.SQRT1_2, y: -Math.SQRT1_2 }, 10) // between up and right */
export function secondaryPetal(baseWidth: number, dir: Vec2, offset: number, gap: number = 2, spread: number = 45): string {
    const side: Vec2[] = petalSide(baseWidth, offset);
    const rad: number = (spread * Math.PI) / 180;
    // Neighbour-local (along, half-width) → this petal's frame; that neighbour sits on our +y side.
    const fromNeighbour = (p: Vec2): Vec2 =>
        v(p.x * Math.cos(rad) + p.y * Math.sin(rad), p.x * Math.sin(rad) - p.y * Math.cos(rad));

    // Base → belly: the neighbour's base → belly edge pushed out by `gap`, cut where it meets our centre line.
    const hug: Vec2[] = fromAxis(offsetCubic(side.slice(0, 4), gap).map(fromNeighbour));
    // Belly → tip: leaves along the neighbour's curve, ends in the primary's tip; same base-to-tip length.
    const tip: Vec2 = v(hug[0].x + side[6].x - side[0].x, 0);
    return `${outline(dir, [
        ...hug,
        add(hug[3], fromNeighbour(sub(side[4], side[3]))),
        add(tip, sub(side[5], side[6])),
        tip,
    ])} Z`;
}