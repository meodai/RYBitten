<script lang="ts">
  import IttenWheel from './lib/IttenWheel.svelte';
  import Nav from './lib/Nav.svelte';
  import HslWheel from './lib/HSLWheel.svelte';
  import SwatchPair from './lib/SwatchPair.svelte';
  import Cube from './lib/Cube.svelte';
  import NamedSwatches from './lib/NamedSwatches.svelte';
  import Sphere from './lib/Sphere.svelte';

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
    '--stops-8': colorsToGradient(
      getColorsHSL(8, 1, 0.5, {
        oldScool: true,
        cube: currentCube,
      }), true),
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

  const pad0 = (num: number) => num.toString().padStart(3, ` `);

  $: cubeString = 
    `[
  [ ` + currentCube.map(pair => {
    return pair.map(vec => pad0(vec * 255) + ' / 255').join(', ');
  }).join(' ],\n  [ ') + ` ],
]`;

  let showSidebar = false;
  let isDevMode = $devMode;

  const toggleDevMode = () => {
    devMode.update((value) => !value);
    isDevMode = !isDevMode;
  };
</script>

<div 
  class="layout{
    showSidebar ? ' layout--showSidebar' : ''
  }{
    isDevMode ? ' layout--dev' : ''
  }" 
  aria-live="polite" aria-relevant="additions"
  style={currentStylesString}
>
  <div class="layout__header">
    <div class="layout__logo">
      <IttenWheel ringWeights={[]} />
    </div>
    <h1 class="logo">RYBitten</h1>

    <div class="layout__controls">


      <button 
        class="nav__button" 
        aria-label="toggle sidebar"
        on:click={() => showSidebar = !showSidebar}
        title="Presets"
      >
        <svg class="navicon" viewBox="0 0 100 100">
          <g stroke="currentColor" transform-origin="50 50" transform="rotate(-22.5)">
            <circle cx="50" cy="50" r="50" vector-effect="non-scaling-stroke" />
            <line x1="0" y1="50" x2="100" y2="50" transform="rotate(-45)" transform-origin="50 50" vector-effect="non-scaling-stroke"/>
            <line x1="0" y1="50" x2="100" y2="50" transform="rotate(45)" transform-origin="50 50" vector-effect="non-scaling-stroke"/>
            <line x1="0" y1="50" x2="100" y2="50" transform="rotate(90)" transform-origin="50 50" vector-effect="non-scaling-stroke"/>
            <line x1="0" y1="50" x2="100" y2="50" transform-origin="50 50" vector-effect="non-scaling-stroke"/>
          </g>
        </svg>
      </button>
    </div>
  </div>

  <aside class="layout__sidebar" aria-label="Color Presets">
    <div class="layout__sidebarbody">
      <Nav isOpen={showSidebar} />
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
          <IttenWheel ringWeights={[1,2.5]} hasOutline={false}  showHexagon={true} />
        </div>
        <div class="content-toggle">
          <blockquote class="content-toggle__dev">
            <p>Implementation of pseudo RYB color conversions derived from Johannes Itten's color wheel.</p>
          </blockquote>
          <blockquote  class="content-toggle__learn" cite="https://encyclopedia.design/2023/03/06/johannes-itten-swiss-expressionist-painter-designer-teacher-writer/">
            <p>Play becomes joy, joy becomes work, work becomes play.</p>
            <footer>—Johannes Itten, <cite>Bauhaus</cite></footer>
          </blockquote>
        </div>
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
    <div class="section section--split">
      
      <div class="section__left">
        <div class="illustration">
          <Sphere />
        </div>
      </div>
      
      <div class="section__right">
        <h2>About</h2>
        <p>
          As the creator of "RYBitten", I invite you to join me on this journey to explore the boundless possibilities of color. Your support, be it through contributions (coffee, sponsorship, or work with me on your next project) or simply spreading the word, will aid in the evolution of this and my other tools, bringing us one step closer to unlocking the full potential of color magic.
        </p>
        <a href="https://www.elastiq.ch/" hreflang="en" class="ellogo" target="_blank" rel="noopener noreferrer" style="margin: 2rem 0;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 185">
            <g fill="none" fill-rule="evenodd" transform="translate(0 6)">
              <path fill="var(--onBg)" fill-rule="nonzero" d="M179.54 71.84a9 9 0 00-1.91.21 7.74 7.74 0 00-1.83.64 4 4 0 00-1.4 1.15 2.81 2.81 0 001.49 4.38 29.19 29.19 0 007 1.45 17.65 17.65 0 018.93 3.36 9.22 9.22 0 013.4 7.7c0 4.993-1.743 8.907-5.23 11.74s-8.323 4.25-14.51 4.25a21.41 21.41 0 01-8-1.36 17.6 17.6 0 01-5.53-3.4 14.1 14.1 0 01-3.28-4.51 12.64 12.64 0 01-1.19-4.68l10.55-2.55a7.32 7.32 0 002.38 4.81c1.42 1.333 3.577 2 6.47 2a13.24 13.24 0 005.19-.94 3.34 3.34 0 002.21-3.32 3.24 3.24 0 00-1.7-2.85c-1.133-.707-3.233-1.203-6.3-1.49a17.19 17.19 0 01-9.74-3.49 9.73 9.73 0 01-3.62-7.91 13.4 13.4 0 011.49-6.38 14 14 0 014-4.68 17.87 17.87 0 015.74-2.85 23.84 23.84 0 016.85-1 20.07 20.07 0 017.4 1.19 15 15 0 014.85 3 11.8 11.8 0 012.76 3.87 15.47 15.47 0 011.15 3.87l-10.45 2.72a5.27 5.27 0 00-2.13-3.62 8.32 8.32 0 00-5.04-1.31zm39.25 1.68h-11.91V63.33H221l3.91-18.55h10.72l-3.92 18.55h14.63v10.19h-16.83l-4.8 21.89.85.6 11.4-7.83 5.36 8-12.3 8.34a12 12 0 01-6.89 2.21 10.08 10.08 0 01-3.57-.64 8.74 8.74 0 01-5-4.72 9.22 9.22 0 01-.77-3.83 8 8 0 01.08-1.23c.053-.367.137-.863.25-1.49l4.67-21.3zm63.58 31a11.67 11.67 0 01-3.49 1.7 12.69 12.69 0 01-3.49.51 10.08 10.08 0 01-3.57-.64 9.25 9.25 0 01-3-1.79 8 8 0 01-2-2.81 9.16 9.16 0 01-.72-3.7 12.25 12.25 0 01.34-3l5.1-21.36-.85-.6-11.4 7.83-5.36-8 12.34-8.34a11.68 11.68 0 013.49-1.7 12.68 12.68 0 013.49-.51 10.11 10.11 0 013.57.64 9.28 9.28 0 013 1.79 8 8 0 012 2.81 9.18 9.18 0 01.72 3.7 12.32 12.32 0 01-.34 3l-5.11 21.36.85.6 11.4-7.83 5.36 8-12.33 8.34zm7.4-53.69a8 8 0 01-.64 3.19 7.68 7.68 0 01-1.74 2.55 8.57 8.57 0 01-2.59 1.7 7.82 7.82 0 01-3.11.64 7.72 7.72 0 01-3.15-.64 8.69 8.69 0 01-2.55-1.7 7.67 7.67 0 01-1.74-2.55 8.29 8.29 0 010-6.38 7.71 7.71 0 011.74-2.55 8.73 8.73 0 012.55-1.7 7.7 7.7 0 013.15-.64 7.8 7.8 0 013.11.64 8.61 8.61 0 012.59 1.7 7.72 7.72 0 011.74 2.55 8 8 0 01.64 3.18v.01zm42.8 48.58h-1.53a21.9 21.9 0 01-2.13 2.77 13 13 0 01-2.85 2.34 14.44 14.44 0 01-4 1.62 21.53 21.53 0 01-5.36.6 14 14 0 01-10.17-4.25 14.71 14.71 0 01-3.15-4.94 17.39 17.39 0 01-1.15-6.47 37.71 37.71 0 011.57-10.93 28.53 28.53 0 014.64-9.23 23.16 23.16 0 017.49-6.38 21 21 0 0110.12-2.38c3.46 0 6.057.71 7.79 2.13a10.62 10.62 0 013.53 5.19h1.53l1.28-6.13h10.72l-10.47 48.92.85.6 4.76-3.23 5.36 8-5.7 3.74a11.59 11.59 0 01-3.53 1.7 13.14 13.14 0 01-3.46.44 9.35 9.35 0 01-6.51-2.42 8.55 8.55 0 01-2.68-6.68c.017-.946.13-1.887.34-2.81l2.71-12.2zm-10.38-2.89a12.38 12.38 0 005.62-1.28 14.13 14.13 0 004.42-3.45 15.84 15.84 0 002.89-5 17 17 0 001-5.87 8.39 8.39 0 00-2.34-6.34 9 9 0 00-6.51-2.25 12.31 12.31 0 00-5.66 1.32 14 14 0 00-4.42 3.49 16.25 16.25 0 00-2.85 5 17 17 0 00-1 5.87c0 2.78.78 4.893 2.34 6.34a9.21 9.21 0 006.51 2.17z">
              </path>
              <path stroke="var(--pink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="11.38" d="M96.45 70.41c25.89-7.67 59 2.55 80.49-31.66 25.23-40.1 60.94-44.68 85.27-31.62 34.2 18.36 31.67 68.27 7.58 90.7-27.42 25.53-29.58 52.91-13.68 67.24 22.95 20.68 47.1-2.67 35.85-19.93-8.94-13.73-31.93-25.89-98.1 6.9-65.32 32.36-129.62 19-133.91-32.42-1.03-12.53 2.88-39.25 36.5-49.21h0z">
              </path>
              <path fill="var(--onBg)" fill-rule="nonzero" d="M.3 104.52l12.41-58.55h35.31v10.72H21.65l-2.94 13.62h23.06v10.72H16.46l-2.89 13.78h25.14v10.71H.3v-1zm77.08 1.69a12.69 12.69 0 01-3.49.51 10.08 10.08 0 01-3.57-.64 9.25 9.25 0 01-3-1.79 8 8 0 01-2-2.81 9.16 9.16 0 01-.72-3.7 12.93 12.93 0 01.34-3l9.27-38.71-.85-.6-11.4 7.83-5.36-8 12.34-8.34a11.68 11.68 0 013.49-1.7 12.67 12.67 0 013.49-.51 10.09 10.09 0 013.57.64 9.26 9.26 0 013 1.79 8.05 8.05 0 012 2.81 9.17 9.17 0 01.72 3.7 14.62 14.62 0 01-.34 3L75.6 95.4l.85.6 11.4-7.83 5.36 8-12.34 8.35a11.68 11.68 0 01-3.49 1.69zm62.88-10.8l.85.6 4.08-2.89 5.36 8-5 3.4a12.39 12.39 0 01-7 2.21 9.85 9.85 0 01-5.79-1.79 7.85 7.85 0 01-3.23-5H128a15.69 15.69 0 01-1.79 2.68 9.7 9.7 0 01-2.5 2.1 14.05 14.05 0 01-3.49 1.45 17.83 17.83 0 01-4.72.55 14.23 14.23 0 01-6.13-1.32 15.05 15.05 0 01-4.89-3.66 17.4 17.4 0 01-3.28-5.49 19.3 19.3 0 01-1.19-6.89 35.69 35.69 0 011.53-10.63 26.73 26.73 0 014.42-8.64 20.46 20.46 0 0116.59-8 12.9 12.9 0 017.4 1.87 9.08 9.08 0 013.66 4.94h1.53l1.19-5.62h10.72l-6.79 32.13zm-20.55 1.11a11.54 11.54 0 009.4-4.51 15.06 15.06 0 002.42-4.81c.574-1.89.86-3.855.85-5.83a9.27 9.27 0 00-2.3-6.51 7.91 7.91 0 00-6.13-2.51 11.68 11.68 0 00-5.45 1.23 12.16 12.16 0 00-4 3.28 14.54 14.54 0 00-2.47 4.81 19.7 19.7 0 00-.85 5.83 10.06 10.06 0 002.08 6.3c1.38 1.813 3.53 2.72 6.45 2.72z">
              </path>
            </g>
          </svg>
        </a>
      
        <!--h2>Current Colors</h2-->
        <code><pre>{cubeString}</pre></code>
      </div>
      
    </div>
  </main>

  <div class="layout__footer">
    <button 
      class="nav__button nav__button--toggledev"
      aria-label="toggle dev mode"
      on:click={toggleDevMode}
    >
      Switch to <span><i>code</i><i>learn</i></span>
    </button>
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

    --sidebarWidth: max(30dvw, 20rem);

    color: var(--onBg);
  }


  .layout--dev {
    --bg: var(--black);
    --onBg: var(--white);
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
    width: var(--sidebarWidth);
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

  .nav__button--toggledev span {
    overflow: hidden;
    width: 2.1em;
    display: inline-flex;
    white-space: nowrap;
    padding: 0.1em 0.5em;
    margin-bottom: -.7em;
    margin-left: -.9em;
  }


  .nav__button--toggledev i {
    transition: 300ms transform cubic-bezier(0.3, 0.7, 0, 1) 100ms;
    font-style: normal;
    position: relative;
    overflow: hidden;
    padding: 0.1em 0.5em;
    width: max-content;
    flex: 0 0 max-content;
  }

  .nav__button--toggledev i::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: var(--onBg);
    transform: scaleY(0);
    transition: 300ms transform cubic-bezier(0.3, 0.7, 0, 1) 100ms;
    transform-origin: 0 100%;
  }

  .nav__button--toggledev:hover i::before {
    transform: scaleY(1) scaleX(1.25);
    z-index: -1;
  }

  .nav__button--toggledev:hover i {
    color: var(--bg);
  }

  .layout--dev .nav__button--toggledev i {
    transform: translateX(-100%);
  }

  .layout--dev .nav__button--toggledev i:first-child {
    opacity: 0;
  }

  .nav__button {
    position: relative;
    display: block;
    transition: 300ms transform cubic-bezier(0.3, 0.7, 0, 1) 0ms;
  }
  .nav__button::after {
    content: '';
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%) translateY(var(--lineWidth)) scale(.6);
    width: .75em;
    height: .75em;
    border-radius: 50%;
    background: var(--bg);
    box-shadow: 0 0 0 var(--lineWidth) var(--line);
    pointer-events: none;
    transition: 300ms transform cubic-bezier(0.3, 0.7, 0, 1);
    display: none;
  }

  .nav__button:hover::after {
    transform: translate(-50%, 50%) translateY(var(--lineWidth)) scale(1);
  }


  .layout--showSidebar .nav__button {
    transform: translateX(calc(-1 * var(--sidebarWidth) + 100%)) rotate(180deg);
    transition: 300ms transform cubic-bezier(0.3, 0.7, 0, 1) 300ms;
  }

  .navicon {
    width: 1.2em;
    height: 1.2em;
    position: relative;
    border-radius: 50%;
    padding: var(--lineWidth);
  }

  .navicon g,
  .navicon line,
  .navicon circle {
    stroke: currentColor;
    stroke-width: calc(var(--lineWidth) * .6);
    fill: none;
  }

  .navicon:hover {
    background: conic-gradient(from -22.5deg at 50% 50%, var(--stops-8));
  }

  .content-toggle {
    position: relative;
  }

  .intro .content-toggle__dev {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    width: 100%;
    opacity: 0;
    transition: 300ms transform cubic-bezier(0.3, 0.7, 0, 1),
                300ms opacity linear;
  }

  .content-toggle__learn {
    transition: 300ms transform cubic-bezier(0.3, 0.7, 0, 1) 50ms,
                100ms opacity linear 50ms;

  }

  .layout--dev .intro .content-toggle__dev {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }

  .layout--dev .intro .content-toggle__learn {

    transform: translateY(-100%);
    opacity: 0;
  }

  code {
    font-family: "IBM Plex Mono", monospace;
    font-size: 0.6em;
  }

  .ellogo {
    display: block;
    max-width: 10rem;
  }

</style>


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