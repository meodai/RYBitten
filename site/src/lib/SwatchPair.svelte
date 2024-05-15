<script lang="ts">
  import Swatch from './Swatch.svelte';
  import type { ColorCoords } from 'rybitten';
  export let rybcolor:ColorCoords = [1, 0, 0];
</script>

<div class="swatches">
  <div class="swatches__swatch">
    <Swatch name="Black" color={[1,1,1]} />
  </div>
  <div class="swatches__swatch">
    <Swatch name="White" color={[0,0,0]} />
  </div>
</div>

<style>
  .swatches {
    width: 100%;
    aspect-ratio: 1;
  }
  .swatches__swatch {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-left: -2.75rem;
    margin-top: -2.75rem;
  }
  .swatches__swatch + .swatches__swatch {
    margin-left: 2.75rem;
    margin-top: 2.75rem;
  } 
</style>