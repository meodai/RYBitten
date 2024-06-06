<script lang="ts">
  import IttenWheel from './lib/IttenWheel.svelte';
  import Nav from './lib/Nav.svelte';
  import HslWheel from './lib/HSLWheel.svelte';
  import SwatchPair from './lib/SwatchPair.svelte';
  import Cube from './lib/Cube.svelte';
  import NamedSwatches from './lib/NamedSwatches.svelte';

  import { getColorsHSL } from './lib/fn/getColorsHSL';
  import { colorsToGradient } from './lib/fn/colorsToGradient';

  import { formatCSS } from "./lib/fn/formatCSS";
  import { ryb2rgb, cubes } from "rybitten";

  import { currentColors, devMode } from './store';
  const { cube } = currentColors;

  let currentCube = $cube;

  cube.subscribe((value) => {
    currentCube = value;
  });

  $: currentStyles = {
    '--stops-3': colorsToGradient(
      getColorsHSL(3, 1, 0.5, {
        oldScool: true,
        cube: currentCube,
      }), true),
    '--stops-3-alt': colorsToGradient(
      getColorsHSL(6, 1, 0.5, {
        oldScool: true,
        cube: currentCube,
      }).filter((_:string, i:number) => i % 2), true),
    '--stops-12': colorsToGradient(
      getColorsHSL(12, 1, 0.5, {
        oldScool: true,
        cube: currentCube,
      }), true),
    '--stops-24': colorsToGradient(getColorsHSL(24, 1, 0.5, {
      oldScool: true,
      cube: currentCube,
      }), true),
    '--stops-24--smooth': colorsToGradient(getColorsHSL(24, 1, 0.5, {
      oldScool: true,
      cube: currentCube,
      }), false),
    '--stops-48': colorsToGradient(getColorsHSL(48, 1, 0.5, {
      oldScool: true,
      cube: currentCube,
    }), true),
    '--black': formatCSS(ryb2rgb([1,1,1], {cube: currentCube})),
    '--white': formatCSS(ryb2rgb([0,0,0], {cube: currentCube})),
    '--red': formatCSS(ryb2rgb([1,0,0], {cube: currentCube})),
    '--yellow': formatCSS(ryb2rgb([0,1,0], {cube: currentCube})),
    '--orange': formatCSS(ryb2rgb([1,1,0], {cube: currentCube})),
    '--blue': formatCSS(ryb2rgb([0,0,1], {cube: currentCube})),
    '--green': formatCSS(ryb2rgb([0,1,1], {cube: currentCube})),
    '--pink': formatCSS(ryb2rgb([1,0,1], {cube: currentCube})),
  };

  $: currentStylesString = Object.entries(currentStyles)
    .map(([key, value]) => `${key}: ${value};`).join('');

  $: cubeString = JSON.stringify(currentCube);

  let showSidebar = false;

  const toggleDevMode = () => {
    devMode.update((value) => !value);
  };
</script>

<div class="layout{showSidebar ? ' layout--showSidebar' : ''}" style={currentStylesString}>
  <div class="layout__header">
    <div class="layout__logo">
      <IttenWheel ringWeights={[]} />
    </div>
    <h1 class="logo">RYBitten</h1>

    <div class="layout__controls">
      <button 
        class="nav__button" 
        aria-label="toggle dev mode"
        on:click={toggleDevMode}
      >
        <span>Code</span> / <span>Play</span>
      </button>

      <button 
        class="nav__button" 
        aria-label="toggle sidebar"
        on:click={() => showSidebar = !showSidebar}
        title="Presets"
      >
        <span>Presets</span>
      </button>
    </div>
  </div>

  <aside class="layout__sidebar" aria-label="Color Presets">
    <div class="layout__sidebarbody">
      <Nav />
    </div>
    <button 
      class="layout__sidebardeco" 
      aria-label="toggle sidebar"
      on:click={() => showSidebar = !showSidebar}
    ></button>
  </aside>

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

    <!--figure class="section">
      <ColorCloth />
    </figure-->

    <section class="section section--split">
      <figure class="section__left">
        <div class="illustration">
          <SwatchPair rybcolor={[1,1,1]} />
        </div>
      </figure>
      <div class="section__right">
        <h2>RYB Conversion</h2>
        <p>The RYB color model is a subtractive system traditionally used in art and design, characterized by its foundational primary colors: <i class="sample sample--r">red</i>, <i class="sample sample--y">yellow</i>, and <i class="sample sample--b">blue</i>. Through their combination, a rich array of secondary colors emerges, offering a versatile palette. In the emulated RYB color gamut, <i class="sample sample--bl">black</i> and <i class="sample sample--w">white</i> are reversed relative to the RGB model. This inversion reflects the subtractive nature of RYB, contrasting with the additive process in RGB.</p>
      </div>
    </section>

    <section class="section section--split">
      <figure class="section__left">
        <div class="illustration">
          <div class="illustration__cube">
            <Cube />
          </div>
        </div>
      </figure>
      <div class="section__right">
        <h2>RYB Colorspace</h2>
        <p>
          This library employs trilinear interpolation to convert between
          RGB and RYB color spaces, allowing for a flexible and
          imaginative approach to color representation that remains
          compatible with the RGB model.
        </p>
        <p>
          The RGB/RYB cube is meticulously calibrated to resemble Johannes
          Itten's
          <a
            href="https://encyclopedia.design/2023/03/06/johannes-itten-swiss-expressionist-painter-designer-teacher-writer/#jp-carousel-809511"
            >chromatic circle</a
          >. By adjusting the edges of the cube, you can observe how color
          shifts and create custom color spaces tailored to your artistic
          vision. This flexibility offers a unique perspective for
          designers, artists, and developers seeking to explore new
          dimensions of color.
        </p>
      </div>
    </section>

    <section class="section section--split">
      <figure class="section__left">
        <div class="illustration">
          <div class="illustration__wheel">
            <IttenWheel ringWeights={[1,1,1,2.5]} />
          </div>
        </div>
      </figure>
      <div class="section__right">
        <h2>Color Wheel</h2>
        <p>
          The RYBItten HSL wheel is derived by first calculating RGB values, which are then converted to a custom RYB color space. This dual-step process results in a unique color wheel that reflects the principles of Johannes Itten's chromatic circle.
        </p>
      </div>
    </section>

    <section class="section section--split">
      <figure class="section__left">
        <div class="illustration">
          <div class="illustration__wheel">
            <HslWheel />
          </div>
        </div>
      </figure>
      <div class="section__right">
        <h2>RYBitten HSL</h2>
        <p>
          Utilizing the HSL model allows for seamless integration with existing color generation libraries, providing an accessible pathway for artists, designers, and developers to experiment with vibrant, customized palettes. This approach ensures compatibility with a wide range of tools while maintaining the aesthetic characteristics of the RYB color space. For ease of use, the lightness value is inverted to behave intuitively.
        </p>
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

    <section class="section">
      <div class="section__top">
        <h2>RYBitten Swatches</h2>
        <p>
          These swatches reflect the unique characteristics of the RYB color space. By combining primary and secondary colors, you can create vibrant palettes that evoke the spirit of traditional art and design. These swatches are designed to be compatible with a wide range of tools and applications, providing a versatile resource for artists, designers, and developers.
        </p>
      </div>
      <figure class="section__bottom">
        <NamedSwatches />
      </figure>
    </section>
    <div class="section">
      <h2>Current Colors</h2>
      {cubeString}
    </div>


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

  .layout__controls {
    margin-left: auto;
  }

  .logo {
    font-size: 1.5rem;
    margin-left: 0.25rem;
  }
  .layout__main {
    padding: var(--size) calc(var(--bezel-x) * .55); 
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
  .section--split p + p {
    margin-top: 1em;
  }
  /*
  .section--split p::first-letter {
    initial-letter: 2;
    margin-inline-end: 1ex;
    font-weight: 100;
  }*/

  .section__top {
    max-width: 70ch;
    margin: 0 auto;
    text-align: center;
    padding-top: 10vmin;
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

  .illustration__cube,
  .illustration__wheel {
    width: 50vmin;
    aspect-ratio: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .illustration__wheel {
    box-sizing: border-box;
    padding: 7%;
  }

  .layout__sidebar {
    position: fixed;
    top: var(--size);
    top: 0;
    right: 0;
    bottom: var(--size);
    bottom: 0;
    background: var(--bg);
    z-index: 20;
    width: max(30dvw, 20rem);
    transform: translateX(100%);
    transition: transform 430ms cubic-bezier(0.3, 0.7, 0, 1) 0ms;
  }

  .layout__sidebarbody {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
  }

  .layout--showSidebar .layout__sidebar {
    transform: translateX(0);
    transition: transform 630ms cubic-bezier(0.3, 0.7, 0, 1) 100ms;
  }

  .layout__sidebardeco {
    border: none;
    padding: 0;
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--size-x);
    background: var(--onBg);
    background-image: linear-gradient(var(--stops-24)),
                      linear-gradient(var(--stops-24--smooth));
    background-size: calc(50% + 0.2px) 100%;
    background-position: 0 0, 100% 0;
    background-repeat: no-repeat;

    transform: translateX(-100%);
    transition: width 300ms cubic-bezier(0.3, 0.7, 0, 1) 250ms,
                left 400ms cubic-bezier(0.3, 0.7, 0, 1) 300ms;

    cursor: pointer;
  }

  .layout--showSidebar .layout__sidebardeco {
    width: calc(var(--size-x) * 2);
    left: 100%;
    transition: width 300ms cubic-bezier(0.3, 0.7, 0, 1) 250ms,
                left 300ms cubic-bezier(0.3, 0.7, 0, 1) 0ms;
  }

  .section {
    width: 100%;
    transition: 300ms width cubic-bezier(0.3, 0.7, 0, 1) 100ms;
  }
  .section__right {
    background: var(--bg);
    transition: 250ms transform cubic-bezier(0.3, 0.7, 0, 1) 150ms;
    transform: translateX(0);
  }

  .layout--showSidebar .section {
    width: calc(100% - 20rem);
  }

  .layout--showSidebar .section__right {
    transform: translateX(-2rem);
  }

  .sample::before {
    content: '';
    display: inline-block;
    width: 1cap;
    height: 1cap;
    margin-right: 0.25em;
    border-radius: 50%;
    background: var(--onBg);
  }

  .sample--y::before {
    background: var(--yellow);
  }

  .sample--b::before {
    background: var(--blue);
  }

  .sample--r::before {
    background: var(--red);
  }

  .sample--w::before {
    background: var(--white);
    box-shadow: inset 0 0 0 var(--lineWidth) var(--onBg);
  }

  .sample--bl::before {
    background: var(--black);
  }
</style>
