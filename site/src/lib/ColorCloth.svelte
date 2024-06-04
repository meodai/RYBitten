<script lang="ts">
import { onMount } from 'svelte';
import { createNoise2D } from 'simplex-noise';
import { getColorsHSL } from './fn/getColorsHSL';

import { currentColors } from '../store';
import type { ColorCube } from "rybitten";

const { cube } = currentColors;

let currentCube = $cube;

const noise2D = createNoise2D();

const colors = getColorsHSL(12, 1, .5, {
  cube: currentCube
});

let colorSlice = 50 / colors.length

let w = window.innerWidth;
let h = window.innerHeight;
let cx = w / 2;
let cy = h / 2;
let radius = w * 0.2;
let outerRadius = w * 0.25;
let pixelRatio = window.devicePixelRatio || 1;
const circleRad = 2 * Math.PI;

export let t = 0;

let canvas: HTMLCanvasElement | null, 
    ctx: CanvasRenderingContext2D | null;


let timer = 0;
const handleResize = () => {
  w = window.innerWidth;
  h = window.innerHeight;
  cx = w / 2;
  cy = h / 2;
  radius = w * 0.2;
  outerRadius = w * 0.25;
  if (!canvas) return;
  canvas.width = w * pixelRatio;
  canvas.height = h * pixelRatio;
  ctx?.scale(pixelRatio, pixelRatio);
  clearTimeout(timer);
  timer = setTimeout(() => {
    draw();
  }, 100);
};

const draw = () => {
  if (!ctx) return;

  const offscreenCanvas = new OffscreenCanvas(w * pixelRatio, h * pixelRatio);
  const offscreenCtx = offscreenCanvas.getContext('2d');
  offscreenCtx?.scale(pixelRatio, pixelRatio);

  if (!offscreenCtx) return;

  for (let i = 0; i < (w * h) * 2; i++) {
    const theta = Math.random() * circleRad;
    const rInner = Math.sqrt(Math.random()) * radius;
    const rOuter = rInner + Math.sqrt(Math.random()) * (outerRadius - rInner);

    const percentCircular = theta / circleRad;
    t += 0.000001;
    const color = colors[Math.floor(t + percentCircular * colors.length + Math.random() * colorSlice) % colors.length];
    offscreenCtx.fillStyle = color;

    let variance = Math.random() < .3 ? w * .25 : 0;
    if (variance) {
      variance = Math.random() < .05 ? variance * 30 : variance;
    }
    let x = cx + Math.cos(theta) * rOuter + ~~((Math.random() - .5) * variance);
    let y = cy + Math.sin(theta) * rOuter + ~~((Math.random() - .5) * variance);
    const noise = noise2D(x / 200, y / 1200);
    x += noise * 100;
    y += noise * 1;
    const size = .05 + Math.random() * .6;
    offscreenCtx.fillRect(x, y, size, size);
  }

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(offscreenCanvas, 0, 0, w * pixelRatio, h * pixelRatio, 0, 0, w, h);
}

onMount(() => {
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  // set pixel density
  handleResize();
  document.querySelector('[data-colorcloth]')?.appendChild(canvas);
  window.addEventListener('resize', handleResize);
});

</script>

<div class="colorcloth" data-colorcloth></div>

<style>
.colorcloth {
  height: 100vh;
  position: absolute;
}

.colorcloth canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}
</style>