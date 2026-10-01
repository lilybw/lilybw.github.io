import { JSX } from "solid-js/jsx-runtime";
import "./Menu.css"

export type MenuProps = {
    children?: JSX.Element;
}

export default function Menu(props: { children: JSX.Element}) {
    return (<div class="Menu">
        {props.children}
    </div>)
}