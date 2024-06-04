<script lang="ts">
  import { currentColors } from '../store';
  const { cube, currentPreset, customCube } = currentColors;

  
  import{ cubes } from "rybitten";

  const setPreset = (presetName: string) => {
    console.log(presetName);
  }
</script>

<div class="nav">
  {#each cubes as [cubename, cubeProps]}
    <button on:click={() => setPreset(cubename)}>
      <strong>{cubeProps.title} <span>{cubeProps.year}</span></strong>
      <strong>{cubeProps.author}</strong>
      
    </button>
  {/each}
</div>

<style>

</style>