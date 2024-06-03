<script lang="ts">
  import { currentColors } from '../store';

  const { cube } = currentColors;
  
  import { getColorsHSL } from './fn/getColorsHSL';
  import { colorsToGradient } from './fn/colorsToGradient';
  import { formatCSS } from './fn/formatCSS';
  import { rybHsl2rgb } from "rybitten";

  export let lightnessRims = 10;
  const hueLabels = 36;
  let currentCube = $cube;

  cube.subscribe((value) => {
    currentCube = value;
  });

  $: lightnessRimArray = Array.from({length: lightnessRims}, (_, i) => {
    const colors = getColorsHSL(
      36, 0.4, 0.1 + ((i + 1) / lightnessRims) * 0.8,
      {cube: currentCube}
    );
    return colorsToGradient(colors, false);
  }).reverse();

  $: hueLabelsArray = Array.from({length: hueLabels}, (_, i) => (i+1)/hueLabels * 360);

  
</script>

<div class="hslWheel">
  {#each lightnessRimArray as gradient, i}
    <div class="hslWheel__rim" style="--gradStep: {gradient}; --i: calc({i} / {lightnessRims})">
    </div>
  {/each}
  {#each hueLabelsArray as hue, i }
    <i class="hslWheel__label" style="--i: calc({i + 1} / {hueLabels}); --c: {formatCSS(
      rybHsl2rgb([hue, 1, 0.5], {cube: currentCube})
    )};">
      <b>{hue.toFixed(0)}</b>
    </i>
  {/each}

</div>

<style> 
  .hslWheel {
    margin-top: 2em;
    margin-bottom: 2em;
    margin-right: 2em;

    position: relative;
    width: 100%;
    aspect-ratio: 1;

    --outerInset: 0.04;
  }

  .hslWheel::after,
  .hslWheel::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    pointer-events: none;
  }

  .hslWheel::after {
    background: var(--white);
    scale: 0.2;
  }

  .hslWheel::before {
    inset: calc(100% * var(--outerInset));
    box-shadow: 0 0 0 var(--lineWidth) var(--line)
  }

  .hslWheel__rim {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    transform: scale(calc(1 - calc(0.2 + var(--i) * 0.6)));
    background: conic-gradient(var(--gradStep));
  }

  .hslWheel__label {
    position: absolute;
    width: calc(100% - 100% * var(--outerInset) * 2);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(calc(var(--i) * 360deg - 90deg));
    font-size: 0.6em;
    line-height: 1;
  }

  .hslWheel__label b {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(1.5em);
    font-style: normal;
    font-weight: 100;
  }

  .hslWheel__label b::after {
    content: "";
    position: absolute;
    height: 1px;
    width: 0.5em;
    background: var(--black);
    top: 50%;
    right: 100%;
    transform: translateX(-0.5em);
    display: none;
  }

  .hslWheel__label b::before {
    content: "";
    position: absolute;
    width: 0.8em;
    height: 0.8em;
    background: var(--c);
    border-radius: 50%;
    top: 50%;
    right: 100%;
    transform: translateX(-1em) translateY(-50%);
    box-shadow:
      0 0 0 0.05em var(--c),
      0 0 0 0.2em var(--white),
      inset 0 0 0 0.1em var(--white);
  }
</style>
