import { Accessor, createEffect, createSignal, JSX, onCleanup } from "solid-js";
import "./app.css";
import "./util/style/utility.css";
import { CSSProperty } from "./util/animationUtil";
import SunRays from "./components/SunRays";
import Button from "./components/Button";
import { KnockoutButton } from "./components/KnockoutButton";
import Buttonth from "./components/Buttonth";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

const MainPageIndex = 0;

export default function App() {
  const [pageIndex, setPageIndex] = createSignal(1);

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

  return (
    <main>
      <div class="site-background"></div>
      <SunRays mvmtFrequencyMultiplier={0.1} numRays={40} zRangeStart={0} />
      <Menu>
        <Buttonth class="card-like" textStyle={MenuButtonTextStyle}
          on:click={e => console.log("hi")} 
        >Career</Buttonth>
        <Buttonth class="card-like" textStyle={MenuButtonTextStyle}
          on:click={e => console.log("hi")} 
        >Contact</Buttonth>
        <Buttonth class="card-like" textStyle={MenuButtonTextStyle}
          on:click={e => console.log("hi")} 
        >Somth</Buttonth>
        <Buttonth class="card-like" textStyle={MenuButtonTextStyle}
          on:click={e => console.log("hi")} 
        >Projects</Buttonth>
        <Buttonth class="card-like" textStyle={MenuButtonTextStyle}
          on:click={e => console.log("hi")} 
        >Graphics</Buttonth>
        <Buttonth class="card-like" textStyle={MenuButtonTextStyle}
          on:click={e => console.log("hi")} 
        >Music</Buttonth>
      </Menu>
      <h1
        class={`
        page-title-white
        calm-white    
        page-title-position 
        ${pageIndex() !== MainPageIndex ? "page-title-reduced" : ""}
        `}
      >
        Lily
      </h1>
      <h1
        class={`
          page-title-white
          calm-white  
          page-title-position 
          page-title-surname-adjustment 
          ${pageIndex() !== MainPageIndex ? "page-title-reduced" : ""}`}
      >
        Wanscher
      </h1>
      <Footer></Footer>
    </main>
  );
}

const MenuButtonTextStyle: JSX.HTMLAttributes<JSX.Element> = { style: {
    color:" white", 
    "font-size": "4rem",
}}