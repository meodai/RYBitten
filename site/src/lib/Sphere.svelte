<script lang="ts">
import { colorsToGradient } from './fn/colorsToGradient';
import { formatCSS } from './fn/formatCSS';
import { rybHsl2rgb } from "rybitten";

import { currentColors } from '../store';
import type { ColorCube } from "rybitten";
const { cube } = currentColors;

let currentCube = $cube;


const segments = 48;

const segmentsArr= new Array(segments).fill(0).map((_, i) => i);

const getColorsVert = (amount = 48, s = 1) => (new Array(amount)).fill('').map((_,i) => {
  const half = amount/2;
  const rgbColor = rybHsl2rgb([
    ((1 - i/amount) * 360 + 120) % 360, 
    s, 
    (Math.abs((i+half/2) % amount - half) / half)
  ], {
    cube: currentCube
  });

  return formatCSS(rgbColor);
});

let gradient = colorsToGradient(getColorsVert(segments), true);

cube.subscribe((value) => {
  currentCube = value;
  gradient  = colorsToGradient(getColorsVert(segments), true);
});
</script>
<div class="shpere_wrap">
  <div class="sphere" style="--stops-vert: {gradient};">
    <div class="sphere__segments sphere__segments--vertical">
      {#each segmentsArr as i}<i class="sphere__segment" style="--i: {i/segments}"></i>{/each}
    </div>
    <div class="sphere__segments sphere__segments--horizontal">
      {#each segmentsArr as i}<i class="sphere__segment" style="--i: {i/segments}"></i>{/each}
    </div>
  </div>
</div>

<style>

  .shpere_wrap {
    filter: drop-shadow(1px 0 0 var(--onBg))
            drop-shadow(calc(-1 * 1px) 0 0 var(--onBg))
            drop-shadow( 0 1px 0 var(--onBg))
            drop-shadow(0 calc(-1 * 1px)  0 var(--onBg));
    container-type: inline-size;
  }
  .sphere {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    perspective: 10000px;
    transform-style: preserve-3d;
    animation: spin 60s linear infinite;

  }

  .sphere__segments  {
    position: absolute;
    height: 1rem;
    width: 100%;
    top: 50%;
    transform: translateY(-50%) rotateY(-20deg) rotateX(-20deg);
    transform-style: preserve-3d;
  }

  .sphere__segments--vertical {
    transform: translateY(-50%) rotateY(-20deg) rotateX(-20deg) rotateZ(-90deg);
  }

  .sphere__segments--vertical::before,
  .sphere__segments--vertical::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotateY(-90deg) translateZ(-.5rem) scaleX(.58);
    background: linear-gradient(to left, var(--stops-12));
    background-size: 200%;
    background-position: 100% 100%;
  }

  .sphere__segments--vertical::before {
    transform: rotateY(-90deg) rotateX(-90deg) translateZ(.5rem) scaleX(.58);
  }

  .sphere__segment {
    position: absolute;
    width: calc(100% / 24);
    height: 100%;
    left: 50%;
    background: linear-gradient(to left, var(--stops-48));
    background-size: calc(100% * 48) 100%;
    transform: translateX(-50%) rotateY(calc(360deg * var(--i))) translateZ(29cqi);
    backface-visibility: visible;
    background-position: calc(100% * var(--i)) 0;
    /*border: var(--lineWidth) solid var(--onBg);
    border-width: var(--lineWidth) 0;*/
  }

  .sphere__segments--vertical .sphere__segment {
    background-image: linear-gradient(to left, var(--stops-vert));
  }

  .sphere__segments--horizontal .sphere__segment:first-child {
    display: none;
  }

  .sphere__segments--vertical .sphere__segment:first-child {
    border: none;
  }

  @keyframes spin {
    0% {
      transform: rotateX(0deg) rotateY(0deg);
    }
    100% {
      transform: rotateX(360deg) rotateY(360deg);
    }
  }

</style>