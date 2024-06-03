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
    return new Array(amount - 1).fill(0).map((_, i) => {
      const h = i / (amount - 1);
      const steps = new Array(stepsPerRamp).fill(0).map((_, j) => {
        const l = (j + 1) / (stepsPerRamp + 1);
        return rybHsl2rgb([h * 360, 1, 1 - l], {
          cube: currentCube,
        });
      });
      return steps;
    })
  };

  let currentRamps = getRamps(ramps, stepsPerRamp);

  let namesForRampColors = [];

  $: namesForRampColors = currentRamps.map((ramp, i) => {
    return ramp.map((color, j) => {
      return `—`;
    });
  });

  let allHexes = [];

  $: allHexes = currentRamps.flat().map(color => {
    return rgbToHex(color);
  });

  const fetchNames = async () => {
    if (!allHexes.length) return;
    const response = await fetch(
      `https://api.color.pizza/v1/?values=${allHexes.map(c => c.substring(1)).join()}&list=bestOf&noduplicates=true`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    
    currentRamps.forEach((ramp, i) => {
      ramp.forEach((color, j) => {
        namesForRampColors[i][j] = data.colors.find((c) => rgbToHex(color) === c.requestedHex)?.name || '—';
      });
    });
  };

  $: allHexes && fetchNames();

  cube.subscribe((value:ColorCube) => {
    currentCube = value;
    currentRamps = getRamps(ramps, stepsPerRamp);
    //fetchNames();
  });
</script>

<div class="namedSwatches">
  <div class="namedSwatches__list">
    {#each currentRamps as ramp, i}
      <h2 class="namedSwatches__title">{romanNumerals[i + 1]}</h2>
      <div class="namedSwatches__ramp" style="--ramp: {i + 1}">
        {#each ramp as color, j}
          <Swatch color={color} name={namesForRampColors[i][j]} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>

</style>