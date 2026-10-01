import { SVG, Path } from "~/util/svg/entrypoint";
import { Mask } from "~/util/svg/mask";
import "./Footer.css";
import { createSignal, type Component, type JSX } from "solid-js";

export function LinkedThumbnail(props: { src: URL, href: URL }) {
    return (
        <a href={props.href.toString()}>
            <img src={props.src.toString()} />
        </a>
    )
}

export const [sourceCodeRef, setSrcRef] = createSignal("https://github.com/lilybw/lilybw.github.io/blob/main/src/app.tsx")

export default function Footer(props: unknown) {

    return (
        <div class="Footer">
        <a href="https://www.github.com/lilybw">
            <GitHubThumbnail />
        </a>
        <a href="https://www.linkedin.com/in/lbwanscher/">
            <LinkedInThumbnail />
        </a>
        <a href={sourceCodeRef()}>
            <SourceCodeThumbnail />
        </a>
        </div>
    )
}

const size = "3rem"

const thumbnailStyle: JSX.CSSProperties = {
    display: "block",
    margin: "auto",
    width: size,
    "min-width": size,
    height: size,
    "min-height": size,
    "border-radius": "1rem",
    overflow: "hidden",
    "filter": "drop-shadow(rgba(0,0,0,0.5) 0 0 10px)",
    "mix-blend-mode": "difference"
};

export const LinkedInThumbnail: Component = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" id="linkedin-bug-blue-medium" width="34" height="34" aria-hidden="false" data-supported-dps="34x34" viewBox="0 0 34 34"
        role="img" aria-label="LinkedIn" style={thumbnailStyle}>
        <path fill="var(--DOBG-purple)"
            d="M34 2.5v29a2.5 2.5 0 0 1-2.5 2.5h-29A2.5 2.5 0 0 1 0 31.5v-29A2.5 2.5 0 0 1 2.5 0h29A2.5 2.5 0 0 1 34 2.5M10 13H5v16h5zm.45-5.5a2.88 2.88 0 0 0-2.86-2.9H7.5a2.9 2.9 0 0 0 0 5.8 2.88 2.88 0 0 0 2.95-2.81zM29 19.28c0-4.81-3.06-6.68-6.1-6.68a5.7 5.7 0 0 0-5.06 2.58h-.14V13H13v16h5v-8.51a3.32 3.32 0 0 1 3-3.58h.19c1.59 0 2.77 1 2.77 3.52V29h5z">
        </path>
    </svg>
}

export const GitHubThumbnail: Component = () => {
    return <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32"
        fill="var(--DOBG-purple)" style={thumbnailStyle}>
        <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"></path>
    </svg>
}

export type SourceCodeThumbnailProps = {
    fontFamily?: string;
    fontWeight?: number | string;
    fontSize?: string;
};

export const SourceCodeThumbnail: Component<SourceCodeThumbnailProps> = (props) =>
{ 
    const [showSrcExplainer, setShowSrcExplainer] = createSignal(false)


    return SVG({
        htmlAttributes: { role: "img", "aria-label": "Source code", style: thumbnailStyle, "on:mouseenter": _ => setShowSrcExplainer(true), "on:mouseleave": _ => setShowSrcExplainer(false) },
        defs: {
            knockout: new Mask(() => <>
                <rect width="24" height="24" fill="white" />
                <text x="12" y="12" text-anchor="middle" dominant-baseline="central" fill="black"
                    font-family={props.fontFamily ?? "'Space Mono', 'JetBrains Mono', ui-monospace, monospace"}
                    font-weight={props.fontWeight ?? 800}
                    font-size={props.fontSize ?? "10px"}>
                    {"</>"}
                </text>
            </>),
        },
    })(Path.Rect(0, 0, 24, 24), {
        htmlAttributes: (defs) => ({ fill: "var(--DOBG-purple)", mask: defs.knockout }),
    });
}