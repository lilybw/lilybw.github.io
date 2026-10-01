
import { createEffect, createSignal, JSX } from "solid-js";
import { KnockoutButton, KnockoutButtonProps } from "./KnockoutButton";
import { OmitF, OverrideF, Pipe } from "~/util/typeFunctions";

type StyleForm<S> = { style?: S; whilestveHovered?: S };

export type ButtonthProps = Pipe<KnockoutButtonProps, OmitF<"style">> & (StyleForm<string> | StyleForm<JSX.CSSProperties>);

// Overly sophisticated button
export default function Buttonth(props: ButtonthProps) {
    const [style, setStyle] = createSignal<string | JSX.CSSProperties>(props.style ?? {});
    const [hovered, setHovered] = createSignal(false)

    props.onMouseEnter = _ => setHovered(true)
    props.onMouseLeave = _ => setHovered(false)

    const priorStyles = props.style ??= typeof props.style === "string" ? "" : {};
    const whileHovered = props.whilestveHovered ??= typeof priorStyles === "string" ? "" : WHILE_HOVERED_DEFAULT;
    delete props.whilestveHovered;

    createEffect(() => {
        if (hovered()) {
            const overwritten = typeof priorStyles === "string" ? 
                priorStyles + ";" + whileHovered
                : {...priorStyles, ...(whileHovered as typeof priorStyles)};
            setStyle(overwritten)
        } else {
            setStyle(priorStyles);
        }
    })

    return KnockoutButton({...props, style})
}

const WHILE_HOVERED_DEFAULT: JSX.CSSProperties = {
    //"filter": "drop-shadow(rgba(0,0,0,0.5) 0px 0px 2px)",
    "transform-origin": "center",
    "transform": "scale(1.1)",
}