<script lang="ts">
  import {currentColors} from '../store';
  const { cube } = currentColors;

  export let rings: number = 4;

  // error if number is higher than 4
  if (rings > 4) {
    throw new Error('rings must be 4 or lower');
  }

  const varsForLayer = [
    '--stops-3', 
    '--stops-3-alt', 
    '--stops-12', 
    '--stops-24',
    '--stops-48'
  ];

  const ringWeights = [
    2, // ring--center 
    1,
    1, 
    1, // most outer ring
  ].slice(0, rings);

  const ringWeightsSum = ringWeights.reduce((a, b) => a + b, 0);
  const ringWeightsNormalized = ringWeights.map(w => w / ringWeightsSum);

</script>

<div class="ittenWheel">
  {#if rings > 2}
    {#each Array.from({length: rings - 1}) as _, i}
      <div class="ittenWheel__ring" style="
        --i: {i/(rings-1)};
        --weight: {ringWeightsNormalized[rings-2-i]};
        --bg: var({varsForLayer[i]});
      ">
        {ringWeightsNormalized[rings-(i+1)]}
      </div>
    {/each}
  {/if}

  <div class="ittenWheel__ring ittenWheel__ring--center {rings == 1 ? 'ittenWheel__ring--empty': ''}" style="--weight: {ringWeightsNormalized[0]};">
    <div class="ittenWheel__ring ittenWheel__center" style="--weight: 1;">
    </div>
  </div>
</div>

<style> 
  .ittenWheel {
    position: relative;
    width: 10rem;
    height: 10rem;
  }

  .ittenWheel__ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(100% * var(--weight));
    transform: translate(-50%, -50%);
    aspect-ratio: 1;
    border-radius: 50%;
    background: conic-gradient(var(--bg));
  }

  .ittenWheel__ring--center {
    background: conic-gradient(var(--stops-3-alt));
  }

  .ittenWheel__ring--empty {
    background: none;
  }

  .ittenWheel__center {
    background: conic-gradient(from -60deg at 50% 50%,var(--stops-3));
    clip-path: polygon(50% 0%,6% 75%,94% 75%);
  }
</style>
