import { JSX } from "solid-js/jsx-runtime";
import "./Button.css"

export default function Button(props: JSX.ButtonHTMLAttributes<any>) {
    
    return (
        <button {...props}>
            <h1 class="inverse-text">
                {props.children}
            </h1>
        </button>
    )
}