<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import IttenWheel from './lib/IttenWheel.svelte';
  import {getColorsHSL} from './lib/fn/getColorsHSL';
  import {colorsToGradient} from './lib/fn/colorsToGradient';

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
  };

  $: currentStylesString = Object.entries(currentStyles)
    .map(([key, value]) => `${key}: ${value};`).join('');

  $: cubeString = JSON.stringify($cube);
</script>

<div class="layout" style={currentStylesString}>
  <div class="layout__header">
    <h1>RYBitten</h1>
  </div>
  <main>
    <h1>Vite + Svelte</h1>
    <IttenWheel rings={1} />
    <IttenWheel rings={2} />
    <IttenWheel rings={3} />
    <IttenWheel rings={4} />

    <div class="card">
      <h2>Current Colors</h2>
      {cubeString}
      <Counter />
    </div>

    <p class="read-the-docs">
      Click on the Vite and Svelte logos to learn more
    </p>
  </main>
</div>

<style>
</style>
