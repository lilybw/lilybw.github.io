import { JSX } from "solid-js/jsx-runtime";
import "./Menu.css"

export type MenuProps = {
    children?: JSX.Element;
}
const StrVec2 = (x: number, y: number): (string & { x: number; y: number; }) => Object.assign(`${x} ${y}`, {"x": x, "y": y})

const primeLeafBodyWidth = 20
const leafStartCenterOffset = primeLeafBodyWidth * 0.66

const subLeafAStart = ``
const subLeafBStart = ``
const subLeafCStart = ``
const subLeafDStart = ``

export default function Menu(props: { children: JSX.Element}) {
    

    return (
    <div class="Menu">
        <svg fill="black" stroke="white" viewBox="-100 -100 200 200" class="magicka">
            {/* Primary leafs */}
            <path d={primaryPetal(primeLeafBodyWidth, {x: 1, y: 0}, leafStartCenterOffset)} />
            <path d={primaryPetal(primeLeafBodyWidth, {x: 0, y: 1}, leafStartCenterOffset)} />
            <path d={primaryPetal(primeLeafBodyWidth, {x: -1, y: 0}, leafStartCenterOffset)} />
            <path d={primaryPetal(primeLeafBodyWidth, {x: 0, y: -1}, leafStartCenterOffset)} />
            
            {/*
            <path d={`M ${primeLeafBStart} C C C C ${primeLeafBEnd}`} />

            <path d={`M ${primeLeafCStart} C C C C ${primeLeafCEnd}`} />

            <path d={`M ${primeLeafDStart} C C C C ${primeLeafDEnd}`} />
             */}

            {/* Secondary leafs 
            <path d={`M ${leafStartCenterOffset} -${leafStartCenterOffset} L 50 0 L 50 50 M 0 0`} />
            <path d={`M ${leafStartCenterOffset} -${leafStartCenterOffset} L 50 0 L 50 50 M 0 0`} />
            <path d={`M ${leafStartCenterOffset} -${leafStartCenterOffset} L 50 0 L 50 50 M 0 0`} />
            <path d={`M ${leafStartCenterOffset} -${leafStartCenterOffset} L 50 0 L 50 50 M 0 0`} />
            */}
        </svg>
        {props.children}
    </div>)
}

export type Vec2 = { x: number; y: number };

/** SVG path for a primary petal growing out from the origin along `dir` (normalized).
 *  @example primaryPetal(16, { x: 0, y: -1 }, 10) // points straight up */
export function primaryPetal(baseWidth: number, dir: Vec2, offset: number): string {
    const half: number = baseWidth / 2;
    const belly: number = baseWidth;           // half-width at the widest point
    const bellyAt: number = offset + baseWidth * 1;
    const tipAt: number = offset + baseWidth * 4;
    const lower: number = bellyAt - offset;    // base → belly
    const upper: number = tipAt - bellyAt;     // belly → tip

    // `along` the petal axis, `across` it (positive = right of dir).
    const at = (along: number, across: number): string =>
        `${(along * dir.x - across * dir.y).toFixed(2)} ${(along * dir.y + across * dir.x).toFixed(2)}`;

    const bodySecondaryCurveHandleModifier = 0.3

    return [
        `M ${at(offset, -half)}`,
        `C ${at(offset + lower * 0.3, -belly)} ${at(bellyAt - lower * 0.3, -belly)} ${at(bellyAt, -belly)}`,
        `C ${at(bellyAt + upper * 0.3, -belly)} ${at(tipAt - upper * 0.5, -belly * 0.12)} ${at(tipAt, 0)}`,
        `C ${at(tipAt - upper * 0.5, belly * 0.12)} ${at(bellyAt + upper * 0.3, belly)} ${at(bellyAt, belly)}`,
        `C ${at(bellyAt - lower * 0.3, belly)} ${at(offset + lower * 0.3, belly)} ${at(offset, half)}`,
        "Z",
    ].join(" ");
}