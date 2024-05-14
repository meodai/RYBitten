<script lang="ts">
  import IttenWheel from './lib/IttenWheel.svelte';
  import Swatch from './lib/Swatch.svelte';

  import { getColorsHSL } from './lib/fn/getColorsHSL';
  import { colorsToGradient } from './lib/fn/colorsToGradient';

  import { formatCSS } from "./lib/fn/formatCSS";
  import { ryb2rgb, cubes } from "rybitten";

  import {currentColors} from './store';
  const { cube } = currentColors;

  $: currentStyles = {
    '--stops-3': colorsToGradient(
      getColorsHSL(3, 1, 0.5, {
        oldScool: true,
        cube: $cube,
      }), true),
    '--stops-3-alt': colorsToGradient(
      getColorsHSL(6, 1, 0.5, {
        oldScool: true,
        cube: $cube,
      }).filter((_:string, i:number) => i % 2), true),
    '--stops-12': colorsToGradient(
      getColorsHSL(12, 1, 0.5, {
        oldScool: true,
        cube: $cube,
      }), true),
    '--stops-24': colorsToGradient(getColorsHSL(24, 1, 0.5, {
      oldScool: true,
      cube: $cube,
      }), true),
    '--stops-48': colorsToGradient(getColorsHSL(48, 1, 0.5, {
      oldScool: true,
      cube: $cube,
    }), true),
    '--black': formatCSS(ryb2rgb([1,1,1], {cube: $cube})),
    '--white': formatCSS(ryb2rgb([0,0,0], {cube: $cube})),
  };

  $: currentStylesString = Object.entries(currentStyles)
    .map(([key, value]) => `${key}: ${value};`).join('');

  $: cubeString = JSON.stringify($cube);
</script>

<div class="layout" style={currentStylesString}>
  <div class="layout__header">
    <div class="layout__logo">
      <IttenWheel ringWeights={[]} />
    </div>
    <h1 class="logo">RYBitten</h1>
  </div>
  <main class="layout__main">
    <div class="section section--intro intro">
      <div class="intro__inner">
        <div class="intro__visual">
          <IttenWheel ringWeights={[1,2.5]} hasOutline={true} />
        </div>
        <blockquote cite="https://encyclopedia.design/2023/03/06/johannes-itten-swiss-expressionist-painter-designer-teacher-writer/">
          <p>Play becomes joy, joy becomes work, work becomes play.</p>
          <footer>—Johannes Itten, <cite>Bauhaus</cite></footer>
        </blockquote>
      </div>
    </div>

    <section class="section section--itten section--split">
      <figure class="section__left">
        <div class="illustration swatches">
          <div class="swatches__swatch">
            <Swatch name="Black" color={[1,1,1]} />
          </div>
          <div class="swatches__swatch">
            <Swatch name="White" color={[0,0,0]} />
          </div>
        </div>
      </figure>
      <div class="section__right">
        <h2>RYB Conversion</h2>
        <p>The RYB color model is a subtractive system traditionally used in art and design, characterized by its foundational primary colors: red, yellow, and blue. Through their combination, a rich array of secondary colors emerges, offering a versatile palette. In the emulated RYB color gamut, black and white are reversed relative to the RGB model. This inversion reflects the subtractive nature of RYB, contrasting with the additive process in RGB.</p>
      </div>
    </section>
    <!--
    <IttenWheel ringWeights={[]} />
    <IttenWheel ringWeights={[1]} />
    <IttenWheel ringWeights={[1,1.75]} />
    <IttenWheel ringWeights={[1,1,1.8]} />
    <IttenWheel ringWeights={[1,1,1,2.5]} />


    <IttenWheel ringWeights={[]} hasOutline={true} />
    <IttenWheel ringWeights={[1]} hasOutline={true} />
    <IttenWheel ringWeights={[1,1.75]} hasOutline={true} />
    <IttenWheel ringWeights={[1,1,1.8]} hasOutline={true} />
    <IttenWheel ringWeights={[1,1,1,2.5]} hasOutline={true} />
    -->

    <div class="card">
      <h2>Current Colors</h2>
      {cubeString}
    </div>

    <p class="read-the-docs">
      Click on the Vite and Svelte logos to learn more
    </p>
  </main>
  <div class="layout__footer">

  </div>
</div>

<style>
  .layout {
    --bg: var(--white);
    --onBg: var(--black);
    --line: var(--onBg);
    --lineInverse: var(--bg);

    height: 100dvh;

    --size: 2.15rem;
    --size-x: calc(.55 * var(--size));
    --bezel-x: calc(var(--size-x) + var(--size) * .45);

    color: var(--onBg);
  }
  .layout::before,
  .layout::after {
    content: '';
    position: fixed;
    z-index: 20;
    top: 0;
    bottom: 0;
    width: 0;
  }

  .layout::before {
    left: var(--size-x);

    border-right: var(--lineWidth) solid var(--line);
  }

  .layout::after {
    right: var(--size-x);
    border-left: var(--lineWidth) solid var(--line);
  }

  .layout__footer,
  .layout__header {
    position: fixed;
    z-index: 10;
    display: flex;
    align-items: center;
    left: 0;
    right: 0;
    padding: 0.25rem var(--bezel-x);
    box-sizing: border-box;
    height: var(--size);
    background: var(--bg);
  }

  .layout__header {
    top: 0;
    --widthLogo: 2rem;
    border-bottom: var(--lineWidth) solid var(--line);
    
    line-height: 1;
  }
  .layout__footer {
    bottom: 0;
    border-top: var(--lineWidth) solid var(--line);
  }

  .layout__logo {
    margin-bottom: -0.4rem;
  }

  .logo {
    font-size: 1.5rem;
    margin-left: 0.25rem;
  }
  .layout__main {
    padding: var(--size); 
    background: var(--bg);
  }

  .section {
    min-height: calc(100dvh - var(--size));
    border-bottom: var(--lineWidth) solid var(--line);
  }

  .section--split {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 800px) {
    .section--split {
      grid-template-columns: 1fr;
    }
  }

  .section__left,
  .section__right {
    position: relative;
    box-sizing: border-box;
    padding: var(--size);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /*
  .section__right {
    border-left: var(--lineWidth) solid var(--line);
  }*/

  .section--split p {
    max-width: 50ch;
  }


  .intro {
    display: grid;
    place-items: center;
  }

  .intro__inner {
    grid-area: 1 / 1;
  }

  .intro blockquote {
    font-size: 1.25rem;
    font-style: italic;
    text-align: center;
    font-style: normal;
    position: relative;
    z-index: 2;
  }

  .intro blockquote p {
    font-size: 3rem;
    max-width: 30ch;
    line-height: .95;

    font-weight: 100;
  }

  .intro blockquote footer {
    font-size: .8rem;
    margin-top: 9dvh;
  }

  .intro__visual {
    width: 30dvh;
    margin: 0 auto 10dvh;
  }

  .illustration {
    position: relative;
    aspect-ratio: 1;
  }
  .swatches {

  }
  .swatches__swatch {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-left: -2.75rem;
    margin-top: -2.75rem;
  }
  .swatches__swatch + .swatches__swatch {
    margin-left: 2.75rem;
    margin-top: 2.75rem;
  } 
</style>
