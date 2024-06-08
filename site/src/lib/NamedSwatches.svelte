<script lang="ts">
  import Swatch from './Swatch.svelte';
  import { rgbToHex } from './fn/rgbToHex';
  import { rybHsl2rgb } from "rybitten";

  import { currentColors } from '../store';
  import type { ColorCube } from "rybitten";
  const { cube } = currentColors;

  export let ramps = 18;
  export let stepsPerRamp = 9;

  let currentCube = $cube;

  const romanNumerals = [
    "Zero",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "XIV",
    "XV",
    "XVI",
    "XVII",
    "XVIII",
    "XIX",
    "XX",
    "XXI",
    "XXII",
    "XXIII",
    "XXIV",
    "XXV",
    "XXVI",
    "XXVII",
    "XXVIII",
    "XXIX",
    "XXX",
  ];

  const getRamps = (amount = 18, stepsPerRamp = 9) => {
    const ramps = new Array(amount - 1).fill(0).map((_, i) => {
      const h = i / (amount - 1);
      const steps = new Array(stepsPerRamp).fill(0).map((_, j) => {
        const l = (j + 1) / (stepsPerRamp + 1);
        return rybHsl2rgb([h * 360, 1, 1 - l], {
          cube: currentCube,
        });
      });
      return steps;
    });

    /*
    // add black and white
    const black = new Array(stepsPerRamp).fill(0).map((_, j) => {
      const l = (j + 1) / (stepsPerRamp + 1);
      return rybHsl2rgb([0, 0, 1 - l], {
        cube: currentCube,
      });
    });
    */

    return ramps
  };

  let currentRamps = getRamps(ramps, stepsPerRamp);

  let activeIndexPerRamp = new Array(ramps).fill(0).map((_, i) => {
    return 1 + Math.floor(Math.random() * (stepsPerRamp - 2));
  });

  const setActiveIndex = (rampIndex: number, stepIndex: number) => {
    activeIndexPerRamp[rampIndex] = stepIndex;
  };

  let namesForRampColors = [];

  $: {
    namesForRampColors = currentRamps.map((ramp, i) => ramp.map((color, j) => `—`));
  }

  let allHexes = [];

  let abortController:null|AbortController = null; 

  const fetchNames = async () => {
    if (!allHexes.length) return;
    if (abortController) abortController.abort();
    abortController = new AbortController();
    const { signal } = abortController;
    const response = await fetch(
      `https://api.color.pizza/v1/?values=${allHexes.map(c => c.substring(1)).join()}&list=bestOf&noduplicates=true`,
      { signal },
    );
    const data = await response.json();

    console.log(data)
    
    currentRamps.forEach((ramp, i) => {
      ramp.forEach((color, j) => {
        namesForRampColors[i][j] = data.colors.find((c) => rgbToHex(color) === c.requestedHex)?.name || '—';
      });
    });
  };

  let timeout = 0;

  cube.subscribe((value:ColorCube) => {
    currentCube = value;
    currentRamps = getRamps(ramps, stepsPerRamp);
    allHexes = currentRamps.flat().map(color => rgbToHex(color));
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(fetchNames, 300);
  });
</script>

<div class="namedSwatches">
  <div class="namedSwatches__list">
    {#each currentRamps as ramp, i}
      <div class="namedSwatches__ramp" style="--ramp: {i + 1}">
        <h2 class="namedSwatches__title">{romanNumerals[i + 1]}</h2>
        {#each ramp as color, j}
          <button class="namedSwatches__step" style="--rnd: {-1 + Math.random() * 2}; --rnd2: {Math.random()}; --c: {color};" on:click={() => setActiveIndex(i,j)}>
            <div class="namedSwatches__swatch">
              <Swatch isCollapsed={activeIndexPerRamp[i] !== j} color={color} name={namesForRampColors[i][j]} />
            </div>
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .namedSwatches__list {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    justify-content: center;
    padding: 5%; 
  }
  .namedSwatches__title {
    font-size: 2rem;
    margin: 0;
    text-align: center;
    margin: 0 0 3rem;
  }

  .namedSwatches__step {
    position: relative;
    padding: 0;
    margin: 0;
    display: block;
  }

  .namedSwatches__step + .namedSwatches__step {
    margin-top: -.25rem;
  }

  .namedSwatches__swatch {
    position: relative;
    transform: rotate(calc(var(--rnd)* 5deg)) translateX(calc(var(--rnd) * 0.5em));
    --swatchHeight: calc(4 + var(--rnd2) * 3);
    padding: 0;

    transition: 400ms transform cubic-bezier(0.3, 0.7, 0, 1), 500ms padding cubic-bezier(0.3, 0.7, 0, 1) 450ms;
  }

  .namedSwatches__step:not(:has(.swatch--collapsed)) .namedSwatches__swatch {
    z-index: 1;
    transform: rotate(0) translateX(0);
    padding: 1.75rem 0;
  }

  .namedSwatches__step:has(.swatch--collapsed):hover {
    z-index: 2;
    --borderColor: var(--bg);
  }
</style>