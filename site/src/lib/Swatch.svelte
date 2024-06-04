<script lang="ts">
  import type { ColorCoords } from 'rybitten';

  export let name:string = 'Black';
  export let color:ColorCoords = [1, 0, 0];
  export let isCollapsed:boolean = false;

  $: colorValuesRGB = color.map(c => Math.round(c * 255));
  $: colorString = colorValuesRGB.join(' ');
  $: colorCSS = `rgb(${colorString})`;
</script>

<aside class="swatch{isCollapsed ? ' swatch--collapsed' : ''}" style="--c: {colorCSS}">
  <div class="swatch__color"></div>
  <header class="swatch__label">
    <span class="swatch__value">{colorString}</span>
    <h4 class="swatch__name">{name}</h4>
  </header>
</aside>

<style>
  .swatch {
    box-shadow: 0 0 0 var(--lineWidth) var(--line);
    padding: .4rem;
    width: 10rem;
    background-color: var(--bg);
    overflow: hidden;
    transition: 400ms box-shadow cubic-bezier(0.3, 0.7, 0, 1) 100ms, 400ms padding cubic-bezier(0.3, 0.7, 0, 1) 100ms;
    box-sizing: border-box;
  }
  .swatch__color {
    aspect-ratio: 1;
    background-color: var(--c, black);
    transition: 400ms aspect-ratio cubic-bezier(0.3, 0.7, 0, 1) 100ms
  }
  .swatch__label {
    font-size: 1.5rem;
    line-height: 1;
    transition: 200ms transform ease-out 500ms, 300ms height cubic-bezier(0.3, 0.7, 0, 1) 500ms;
    height: 1.75rem;
  }
  .swatch__value {
    opacity: 1;
    display: block;
    font-size: .6rem;
    font-family: "IBM Plex Mono", monospace;
    font-weight: 200;
    margin-top: 0.4rem;
    transition: 200ms opacity linear 500ms, 200ms margin-top cubic-bezier(0.3, 0.7, 0, 1) 500ms;
  }
  .swatch__name {
    opacity: 1;
    font-size: 1.25rem;
    transform: translateY(0%);
    transition: 200ms opacity linear 650ms, 400ms transform cubic-bezier(0.3, 0.7, 0, 1) 600ms;

  }

  .swatch--collapsed {
    padding: 0;
    box-shadow: 0 0 0 var(--lineWidth) var(--bg);
  }

  .swatch--collapsed .swatch__color {
    aspect-ratio: var(--swatchHeight, 1);
  }

  .swatch--collapsed .swatch__label {
    transform: translateY(calc(100% - 1px));
    height: 0;
    overflow: hidden;
  }

  .swatch--collapsed .swatch__value {
    opacity: 0;
    margin-top: 0;
  }
  .swatch--collapsed .swatch__name {
    opacity: 0;
    transform: translateY(100%);
  }
</style>