<script lang="ts">
  import { currentColors } from '../store';
  import { rgbToHex } from './fn/rgbToHex';
  import { hexToRgb } from './fn/hexToRgb';
  const { cube } = currentColors;

  import type { ColorCube, ColorCoords } from "rybitten";
  import { cubicOut } from 'svelte/easing';
  
  type ColorNames = 'white' | 'red' | 'yellow' | 'orange' | 'blue' | 'violet' | 'green' | 'black';
  type CSSColorNames = '--white' | '--red' | '--yellow' | '--orange' | '--blue' | '--violet' | '--green' | '--black';

  let colors = {
    white: rgbToHex($cube[0]),
    red: rgbToHex($cube[1]),
    yellow: rgbToHex($cube[2]),
    orange: rgbToHex($cube[3]),
    blue: rgbToHex($cube[4]),
    violet: rgbToHex($cube[5]),
    green: rgbToHex($cube[6]),
    black: rgbToHex($cube[7]),
  } as Record<ColorNames, string>;

  cube.subscribe((value) => {
    colors = {
      white: rgbToHex(value[0]),
      red: rgbToHex(value[1]),
      yellow: rgbToHex(value[2]),
      orange: rgbToHex(value[3]),
      blue: rgbToHex(value[4]),
      violet: rgbToHex(value[5]),
      green: rgbToHex(value[6]),
      black: rgbToHex(value[7]),
    } as Record<ColorNames, string>;
  });

  const colorNameIndex = {
    white: 0,
    red: 1,
    yellow: 2,
    orange: 3,
    blue: 4,
    violet: 5,
    green: 6,
    black: 7,
  } as Record<ColorNames, number>;

  $: cssStyles = {
    '--white': colors.white,
    '--red': colors.red,
    '--yellow': colors.yellow,
    '--orange': colors.orange,
    '--blue': colors.blue,
    '--violet': colors.violet,
    '--green': colors.green,
    '--black': colors.black,
  } as Record<CSSColorNames, string>;

  $: cssStyleString = Object.entries(cssStyles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(';');


  function updateEdge(color:ColorNames, value:string) {
    colors[color] = value;
    cssStyles[`--${color}`] = value;
    cssStyleString = Object.entries(cssStyles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(';');
    
    const colorIndex = colorNameIndex[color];
    const newCube = $cube.map((c: ColorCoords, i: number) => i === colorIndex ? hexToRgb(value) : c) as ColorCube;
    currentColors.cube = newCube;
  }
</script>

<form class="edges" data-edges style="{cssStyleString}">
  <svg viewBox="0 0 100 100" class="cube">
    <g>
      <line x1="33" y1="3" x2="6" y2="30"  vector-effect="non-scaling-stroke" />
      <line x1="66" y1="90" x2="93" y2="63"  vector-effect="non-scaling-stroke" />
      <rect
        x="33"
        y="3"
        width="60"
        height="60"
        class="cube__back"
         vector-effect="non-scaling-stroke"
      />
      <rect
        x="6"
        y="30"
        width="60"
        height="60"
        class="cube__front"
        vector-effect="non-scaling-stroke"
      />
      <polyline
        points="33,30 33,63 93,63"
        class="cube__coverline"
        vector-effect="non-scaling-stroke"
      />
    </g>
  </svg>
  <label class="g" style="--c: var(--green)" >
    <b>green</b>
    <span><input type="color" 
      bind:value={colors.green} 
      on:input={(e) => updateEdge('green', e.target?.value)}
    /></span>
  </label>
  <label class="b" style="--c: var(--blue)">
    <b>blue</b>
    <span><input type="color" 
      bind:value={colors.blue}
      on:input={(e) => updateEdge('blue', e.target?.value)}
    /></span>
  </label>
  <label class="black" style="--c: var(--black)">
    <b>black</b>
    <span><input type="color" 
      bind:value={colors.black}
      on:input={(e) => updateEdge('black', e.target?.value)}  
    /></span>
  </label>
  <label class="v" style="--c: var(--violet)">
    <b>pink</b>
    <span><input type="color" 
      bind:value={colors.violet}
      on:input={(e) => updateEdge('violet', e.target?.value)}  
    /></span>
  </label>
  <label class="y" style="--c: var(--yellow)">
    <b>yellow</b>
    <span><input type="color"
      bind:value={colors.yellow}
      on:input={(e) => updateEdge('yellow', e.target?.value)}  
    /></span>
  </label>
  <label class="w" style="--c: var(--white)">
    <b>white</b>
    <span><input type="color"
      bind:value={colors.white}
      on:input={(e) => updateEdge('white', e.target?.value)}
    /></span>
  </label>
  <label class="o" style="--c: var(--orange)">
    <b>orange</b>
    <span><input type="color" 
      bind:value={colors.orange}
      on:input={(e) => updateEdge('orange', e.target?.value)}
    /></span>
  </label>
  <label class="r" style="--c: var(--red)">
    <b>red</b>
    <span><input type="color" 
      bind:value={colors.red}
      on:input={(e) => updateEdge('red', e.target?.value)}
    /></span>
  </label>
</form>

<style>
.edges {
  --w: calc(var(--size-illu) - 4em);
  --padding-top: 3%;
  --padding-left: 33%;
  --padding-right: 7%;
  --height: 60%;
  --width: 60%;

  --padding-top-front: 30%;
  --padding-left-front: 6%;

  margin: 2em;

  position: relative;
  width: var(--w);
  height: var(--w);
  flex: 0 0 var(--w);
}

.edges span {
  display: block;
  background: var(--c);
  background: var(--white);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  box-shadow:
    0 0 0 0.05em var(--black),
    0 0 0 0.1em var(--white),
    0 0 0 0.2em var(--c),
    0 0 0 0.3em var(--white);
  transition:
    300ms box-shadow cubic-bezier(0.3, 0.7, 0, 1) 150ms,
    200ms background linear;
}

.edges input {
    appearance: none;
    padding: 0;
    border: 0;
    opacity: 0;
    cursor: pointer;
}

.edges label {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.edges label:hover span {
  background: var(--c);
  box-shadow:
    0 0 0 0.1em var(--black),
    0 0 0 0.1em var(--white),
    0 0 0 0.2em var(--white),
    0 0 0 0.3em var(--c);
}

.edges b {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translate(0.2rem, 0.2rem);
  line-height: 1;
  font-size: 0.8em;
  font-weight: 100;
}

.edges .g {
  left: var(--padding-left);
  top: var(--padding-top);
}

.edges .b {
  left: var(--padding-left);
  top: calc(var(--padding-top) + var(--height));
}

.edges .v {
  left: calc(var(--padding-left) + var(--width));
  top: calc(var(--padding-top) + var(--height));
}

.edges .black {
  left: calc(var(--padding-left) + var(--width));
  top: var(--padding-top);
}

.edges .y {
  left: var(--padding-left-front);
  top: var(--padding-top-front);
}

.edges .w {
  left: var(--padding-left-front);
  top: calc(var(--padding-top-front) + var(--height));
}

.edges .r {
  left: calc(var(--padding-left-front) + var(--width));
  top: calc(var(--padding-top-front) + var(--height));
}

.edges .o {
  left: calc(var(--padding-left-front) + var(--width));
  top: var(--padding-top-front);
}

.cube {
  display: block;
}

.cube g {
  stroke: currentColor;
  stroke-width: var(--lineWidth);
  fill: none;
}

.cube__front {
  fill: var(--white);
}

.cube__coverline {
  fill: none;
  stroke: var(--black);
  stroke-dasharray: 1.5 1.5;
}
</style>