<script lang="ts">
  import { currentColors } from '../store';
  import { rgbToHex } from './fn/rgbToHex';
  import { hexToRgb } from './fn/hexToRgb';
  const { cube } = currentColors;
  import type { ColorCube, ColorCoords } from "rybitten";
  
  type ColorNames = 'white' | 'red' | 'yellow' | 'orange' | 'blue' | 'violet' | 'green' | 'black';
  type CSSColorNames = '--white' | '--red' | '--yellow' | '--orange' | '--blue' | '--violet' | '--green' | '--black';

  export let iconMode = false;

  const colorNames = [
    {
        "name": "black",
        "rgb": [0, 0, 0]
    },
    {
        "name": "blue",
        "rgb": [0, 0, 255/255]
    },
    {
        "name": "cyan",
        "rgb": [0, 255/255, 255/255]
    },
    {
        "name": "green",
        "rgb": [0, 255/255, 0/255]
    },
    {
        "name": "teal",
        "rgb": [0, 128/255, 128/255]
    },
    {
        "name": "turquoise",
        "rgb": [64/255, 224/255, 208/255]
    },
    {
        "name": "indigo",
        "rgb": [75/255, 0, 130/255]
    },
    {
        "name": "violet",
        "rgb": [238/255, 130/255, 238/255]
    },
    {
        "name": "beige",
        "rgb": [245/255, 245/255, 220/255]
    },
    {
        "name": "fuchsia",
        "rgb": [255/255, 0/255, 255/255]
    },
    {
        "name": "gold",
        "rgb": [255/255, 215/255, 0]
    },
    {
        "name": "magenta",
        "rgb": [255/255, 0, 255/255]
    },
    {
        "name": "orange",
        "rgb": [25/255, 165/255, 0]
    },
    {
        "name": "pink",
        "rgb": [255/255, 192/255, 203/255]
    },
    {
        "name": "red",
        "rgb": [255/255, 0, 0]
    },
    {
        "name": "white",
        "rgb": [255/255, 255/255, 255/255]
    },
    {
        "name": "yellow",
        "rgb": [255/255, 255/255, 0]
    }
  ] as { name: string, rgb: ColorCoords}[];

  let colors = {
    white: $cube[0],
    red: $cube[1],
    yellow: $cube[2],
    orange: $cube[3],
    blue: $cube[4],
    violet: $cube[5],
    green: $cube[6],
    black: $cube[7],
  } as Record<ColorNames, ColorCoords>;

  cube.subscribe((value) => {
    colors = {
      white: value[0],
      red: value[1],
      yellow: value[2],
      orange: value[3],
      blue: value[4],
      violet: value[5],
      green: value[6],
      black: value[7],
    };
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
    '--white': rgbToHex(colors.white),
    '--red': rgbToHex(colors.red),
    '--yellow': rgbToHex(colors.yellow),
    '--orange': rgbToHex(colors.orange),
    '--blue': rgbToHex(colors.blue),
    '--violet': rgbToHex(colors.violet),
    '--green': rgbToHex(colors.green),
    '--black': rgbToHex(colors.black),
  } as Record<CSSColorNames, string>;

  $: cssStyleString = Object.entries(cssStyles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(';');


  function updateEdge(color:ColorNames, value:string) {
    colors[color] = hexToRgb(value);
    cssStyles[`--${color}`] = value;
    cssStyleString = Object.entries(cssStyles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(';');
    
    const colorIndex = colorNameIndex[color];
    const newCube = $cube.map((c: ColorCoords, i: number) => i === colorIndex ? hexToRgb(value) : c) as ColorCube;
    currentColors.setCube(newCube);
  }


  const cubeW = 60;
  const cubeH = 60;

  const cubeCoords = {
    white: [6, 90],
    red: [66, 90],
    yellow: [6, 30],
    orange: [66, 30],
    blue: [33, 63],
    violet: [93, 63],
    green: [33, 3],
    black: [93, 3],
  } as Record<ColorNames, [number, number]>;

  const referenceColors = {
    white: [255, 255, 255],
    red: [255, 0, 0],
    yellow: [255, 255, 0],
    orange: [255, 165, 0],
    blue: [0, 0, 255],
    violet: [128, 0, 128],
    green: [0, 255, 0],
    black: [0, 0, 0],
  } as Record<ColorNames, [number, number, number]>;

  const closestName = (color: ColorCoords) => {
    const closest = colorNames.reduce((acc, curr) => {
      const distance = Math.sqrt(
        Math.pow(curr.rgb[0] - color[0], 2) +
        Math.pow(curr.rgb[1] - color[1], 2) +
        Math.pow(curr.rgb[2] - color[2], 2)
      );
      if (distance < acc.distance) {
        return { name: curr.name, distance };
      }
      return acc;
    }, { name: '', distance: Infinity });
    return closest.name;
  }
</script>

<form class="edges{iconMode ? ' edges--icon' : ''}" data-edges style="{cssStyleString}">
  <svg viewBox="0 0 100 100" class="cube">
    <g>
      <line 
        x1="{cubeCoords.green[0]}" y1="{cubeCoords.green[1]}" 
        x2="{cubeCoords.yellow[0]}" y2="{cubeCoords.yellow[1]}" 
        vector-effect="non-scaling-stroke"
      />
      <line 
        x1="{cubeCoords.red[0]}" y1="{cubeCoords.red[1]}" 
        x2="{cubeCoords.violet[0]}" y2="{cubeCoords.violet[1]}" 
        vector-effect="non-scaling-stroke" 
      />
      <rect
        x="{cubeCoords.green[0]}"
        y="{cubeCoords.green[1]}"
        width="{cubeW}"
        height="{cubeH}"
        class="cube__back"
        vector-effect="non-scaling-stroke"
      />
      <rect
        x="{cubeCoords.yellow[0]}"
        y="{cubeCoords.yellow[1]}"
        width="{cubeW}"
        height="{cubeH}"
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
      value={rgbToHex(colors.green)} 
      on:input={(e) => updateEdge('green', e.target?.value)}
    /></span>
  </label>
  <label class="b" style="--c: var(--blue)">
    <b>blue</b>
    <span><input type="color" 
      
      value={rgbToHex(colors.blue)}
      on:input={(e) => updateEdge('blue', e.target?.value)}
    /></span>
  </label>
  <label class="black" style="--c: var(--black)">
    <b>black</b>
    <span><input type="color" 
      value={rgbToHex(colors.black)}
      on:input={(e) => updateEdge('black', e.target?.value)}  
    /></span>
  </label>
  <label class="v" style="--c: var(--violet)">
    <b>pink</b>
    <span><input type="color" 
      value={rgbToHex(colors.violet)}
      on:input={(e) => updateEdge('violet', e.target?.value)}  
    /></span>
  </label>
  <label class="y" style="--c: var(--yellow)">
    <b>yellow</b>
    <span><input type="color"
      value={rgbToHex(colors.yellow)}
      on:input={
        (e) => updateEdge('yellow', e.target?.value)
      }  
    /></span>
  </label>
  <label class="w" style="--c: var(--white)">
    <b>white</b>
    <span><input type="color"
      value={rgbToHex(colors.white)}
      on:input={(e) => updateEdge('white', e.target?.value)}
    /></span>
  </label>
  <label class="o" style="--c: var(--orange)">
    <b>orange</b>
    <span><input type="color" 
      value={rgbToHex(colors.orange)}
      on:input={(e) => updateEdge('orange', e.target?.value)}
    /></span>
  </label>
  <label class="r" style="--c: var(--red)">
    <b>red</b>
    <span><input type="color" 
      value={rgbToHex(colors.red)}
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

.edges--icon {
  margin: 0;
}

.edges span {
  display: block;
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

.edges--icon span {
  width: 0.25rem;
  height: 0.25rem;
  background: var(--c);
  box-shadow:
    0 0 0 var(--lineWidth) var(--black),
    0 0 0 calc(var(--lineWidth) * 2) var(--c);
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

.edges--icon label {
  pointer-events: none;
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

.edges--icon b {
  display: none;
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
  stroke: var(--line, currentColor);
  stroke-width: var(--lineWidth);
  fill: none;
}

.cube__front {
  fill: var(--white);
}

.cube__coverline {
  fill: none;
  stroke: var(--line);
  stroke-dasharray: 1.5 1.5;
}
</style>