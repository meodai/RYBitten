<script lang="ts">
  import {currentColors} from '../store';

  export let hasOutline = false;

  export let ringWeights: number[] = [
    1, 1, 1, 2
  ];
  export let varsForLayer = [
    '--stops-192',
    '--stops-96',
    '--stops-48',
    '--stops-24', 
    '--stops-12',
    '--stops-3-alt',
    '--stops-3',
  ];

  // create new varsForLayer without the --stops-3 and --stops-3-alt
  $: slicedVarsForLayers = varsForLayer.slice(0,-2).reverse().slice(0, ringWeights.length-1).reverse();
  $: outerRins = ringWeights.length - 1;
  let sliceAjust = [12, 24, 48, 96, 192];
  $: sliceAjustAdjusted = sliceAjust.slice(0, ringWeights.length-1).reverse();

  $: console.clear()

  $: ringWeightsSum = ringWeights.reduce((a, b) => a + b, 0);
  $: ringWeightsNormalized = ringWeights.map(w => w / ringWeightsSum);
  $: ringWeightsCumulative = ringWeightsNormalized.reduce((acc, w, i) => {
    acc.push(acc[i] + w);
    return acc;
  }, [0]).slice(0, -1);
</script>

<div class="ittenWheel {hasOutline ? 'ittenWheel--outline' : ''}">
  {#if outerRins > 0}
    {#each ringWeightsCumulative as weight, i}
      <div class="ittenWheel__ring" style="--r: {sliceAjustAdjusted[i]}; --weight: {weight}; --bg: var({slicedVarsForLayers[i]})">
      </div>
    {/each}
  {/if}

  <div class="ittenWheel__ring ittenWheel__ring--center {ringWeights.length < 1 ? 'ittenWheel__ring--empty': ''}" style="--weight: {ringWeights.length > 1 ? ringWeightsCumulative[ringWeightsCumulative.length - 1] : 0}; --bg: var(--stops-3-alt);">
    <div class="ittenWheel__ring ittenWheel__center" style="--weight: 0;--bg: var(--stops-3);">
    </div>
  </div>
</div>

<style> 
  .ittenWheel {
    position: relative;
    width: 10rem;
    height: 10rem;
  }

  .ittenWheel--outline .ittenWheel__ring {
    box-shadow: 0 0 0 0.1rem white;
  }

  .ittenWheel__ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(100% - var(--weight) * 100%);
    transform: translate(-50%, -50%);
    aspect-ratio: 1;
    border-radius: 50%;
    background: conic-gradient(from calc(360deg/var(--r,0)/-2) at 50% 50%, var(--bg));
  }

  .ittenWheel__ring--center {
    background: conic-gradient(var(--stops-3-alt));
  }

  .ittenWheel__ring--empty {
    background: none;
  }

  .ittenWheel__center {
    background: conic-gradient(from -60deg at 50% 50%, var(--stops-3));
    clip-path: polygon(50% 0%,6% 75%,94% 75%);
  }
</style>
