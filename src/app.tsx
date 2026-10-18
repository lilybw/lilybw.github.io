import { createEffect, createSignal, JSX, onCleanup } from "solid-js";
import "./app.css";
import "./index.css"
import "./fonts.css"
import "./util/style/utility.css";
import { CSSProperty } from "./util/animationUtil";
import SunRays from "./components/SunRays";
import Buttonth from "./components/Buttonth";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import { HSL } from "./components/HueSatPicker";

export const RAY_INIT_COLOR = { h: 200, s: 50, l: 80 }
export default function App() {

  createEffect(() => {
    const clearSiteBreath = CSSProperty({
      name: "--site-breath-driver",
      target: document.documentElement,
    }).oscillate(-1, 1, 0.25);

    const clearSiteElapsedSeconds = CSSProperty({
      name: "--site-elapsed-seconds",
      target: document.documentElement,
    }).asFunctionOfElapsedTimeS((elapsedS) => elapsedS);

    onCleanup(() => {
      clearSiteBreath();
      clearSiteElapsedSeconds();
    });
  });

  const [rayColorShift, setRayColorShift] = createSignal<HSL>(RAY_INIT_COLOR)

  return (
    <main>
      <div class="site-background"></div>
      <SunRays mvmtFrequencyMultiplier={0.1} numRays={40} zRangeStart={0} colorShift={rayColorShift} />
      <Menu />
      
      <h1
        class={`
        page-title-white
        page-title-position 
        `} style="mix-blend-mode: normal;"
      >
        Lily
      </h1>
      <h1
        class={`
          page-title-white
          page-title-position 
          page-title-surname-adjustment `}  
          style="mix-blend-mode: normal;"
      >
        Wanscher
      </h1>
      <Footer sunRaysHueRotation={setRayColorShift} rayInitColor={RAY_INIT_COLOR} />
    </main>
  );
}

const MenuButtonTextStyle: JSX.HTMLAttributes<JSX.Element> = { style: {
    color: "black", 
    "font-size": "4rem",
}}