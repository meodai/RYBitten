<script lang="ts">
  import type { ColorCoords } from 'rybitten';

  export let name:string = 'Black';
  export let color:ColorCoords = [1, 0, 0];

  $: colorValuesRGB = color.map(c => Math.round(c * 255));
  $: colorString = colorValuesRGB.join(' ');
  $: colorCSS = `rgb(${colorString})`;
</script>

<aside class="swatch" style="--c: {colorCSS}">
  <div class="swatch__color"></div>
  <header class="swatch__label">
    <span class="swatch__value">{colorString}</span>
    <h4 class="swatch__name">{name}</h4>
  </header>
</aside>

<style>
  .swatch {
    box-shadow: 0 0 0 calc(.5 * var(--lineWidth)) var(--line);
    padding: .4rem;
    width: 10rem;
    background-color: var(--bg);
  }
  .swatch__color {
    aspect-ratio: 1;
    background-color: var(--c, black);
  }
  .swatch__label {
    font-size: 1.5rem;
    line-height: 1;
  }
  .swatch__value {
    display: block;
    font-size: .6rem;
    font-family: "IBM Plex Mono", monospace;
    font-weight: 200;
    margin-top: 0.4rem;
  }
  .swatch__name {
    font-size: 1.25rem;
  }
</style>