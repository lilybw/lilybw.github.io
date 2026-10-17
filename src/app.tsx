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

  return (
    <main>
      <div class="site-background"></div>
      <SunRays mvmtFrequencyMultiplier={0.1} numRays={40} zRangeStart={0} />
      <p class="disclaimer lora-bold">Hi, 
        I see I have yet to complete this site before you visited.
        The links on the right are functional, but other than that, I am afraid I owe you one.   
      </p>
      
      <Menu>
        {/* 
        <Buttonth class="card-like button-disabled" textStyle={MenuButtonTextStyle}
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
        */}
      </Menu>
      
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
      <Footer></Footer>
    </main>
  );
}

const MenuButtonTextStyle: JSX.HTMLAttributes<JSX.Element> = { style: {
    color: "black", 
    "font-size": "4rem",
}}