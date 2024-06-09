<script lang="ts">
  import Cube from './Cube.svelte';
  import { currentColors } from '../store';
  import { cubes } from "rybitten";

  let currentPresetId = currentColors.currentPresetUid;

  const setCurrentPreset = (presetName: string) => {
    if (presetName !== 'custom') {
      currentColors.setPreset(presetName);
    }
    currentPresetId = presetName;
  };

  currentColors.isCustom.subscribe((value) => {
    if (value) {
      currentPresetId = 'custom';
    }
  });
</script>

<div class="nav">
  <h3 class="nav__title">Gamut Presets</h3>
  <ol class="nav__list">
    <li class="nav__item nav__item--custom{currentPresetId === 'custom' ? ' nav__item--active' : '' }">
      <button on:click={() => setCurrentPreset('custom')} class="nav__button">
        <strong class="nav__presettitle">Custom</strong>
        <strong class="nav__presetauthor">Create your own</strong>
        <div class="nav__buttonicon">
          <Cube iconMode={true} />
        </div>
      </button>
      <div class="nav__details nav__details--square">
        <div class="nav__itemcube">
          <Cube />
        </div>
      </div>
      
    </li>
    {#each cubes as [cubename, cubeProps]}
      <li class="nav__item{currentPresetId === cubename ? ' nav__item--active' : '' }">
        <button on:click={() => setCurrentPreset(cubename)} class="nav__button">
          <strong class="nav__presettitle">
            {cubeProps.title}
            <span class="nav__presetyear">{cubeProps.year}</span>
          </strong>
          <strong class="nav__presetauthor">{cubeProps.author}</strong>
        </button>
      </li>
    {/each}
  </ol>
  <!--div class="nav__cube">
    <Cube />
  </div-->
</div>

<style>
  .nav {
    background: var(--bg);
    color: var(--onBg);
  }

  .nav__title {
    position: absolute;
    top: calc(var(--lineWidth) * -1);
    right: 0;
    left: 0;
    font-size: 1.25rem;
    line-height: 1;
    font-weight: 100;
    padding: 0 var(--size-x);
    margin: 0;
    height: var(--size);
    border-left: var(--lineWidth) solid var(--onBg);
    border-bottom: var(--lineWidth) solid var(--onBg);
    line-height: var(--size);
  }

  .nav__list {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: var(--size);
  }
  .nav__button {
    position: relative;
    display: block;
    width: 100%;
    padding: var(--size-x);
    overflow: hidden;
    box-sizing: border-box;
  }

  .nav__button::after {
    content: "";
    width: calc(var(--size-x) * 1.25);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-left: var(--lineWidth) solid var(--onBg);
    transform: translateX(100%);
    transition: transform 300ms cubic-bezier(0.3, 0.7, 0, 1) 200ms;
  }

  .nav__item--custom .nav__button::after {
    display: none;
  }

  .nav__item {
    border-left: var(--lineWidth) solid var(--onBg);
    border-bottom: var(--lineWidth) solid var(--onBg);
    transition: transform 400ms cubic-bezier(0.3, 0.7, 0, 1);
  }

  .nav__item:last-of-type {
    border-bottom: none;
  }

  .nav__item--active {
    transform: translateX(calc(-1 * var(--size-x)));
  }

  .nav__item--active .nav__button {
    /*background: var(--bg);
    color: var(--onBg);*/
  }

  .nav__item--active .nav__button::after {
    transform: translateX(0);
  }


  .nav__details {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }

  .nav__details--square {
    height: 0rem;
    transition: height 400ms cubic-bezier(0.3, 0.7, 0, 1) 100ms;
  }

  .nav__item--active .nav__details--square {
    height: 18rem;
  }

  .nav__itemcube {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(.75);
    height: 20rem;
    width: 20rem;
    box-sizing: border-box;
    padding: var(--size-x);
    transition: transform 400ms cubic-bezier(0.3, 0.7, 0, 1) 0ms, opacity 200ms linear 0ms;
    opacity: 0;
  }

  .nav__item--active .nav__itemcube {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    transition: transform 400ms cubic-bezier(0.3, 0.7, 0, 1) 200ms, opacity 400ms linear 0ms;
  }

  .nav__presettitle {
    display: block;
    font-size: 1.5rem;
    line-height: 1;
    font-weight: 100;
  }

  .nav__presetauthor {
    display: block;
    font-size: 1rem;
    line-height: 1;

    font-size: .6rem;
    margin-top: .5em;
    font-family: "IBM Plex Mono", monospace;
  }

  .nav__presetyear {
    font-size: .4em;
    font-family: "IBM Plex Mono", monospace;
  }


  .nav__cube {
    border-left: var(--lineWidth) solid var(--onBg);
    border-top: var(--lineWidth) solid var(--onBg);
    padding: 0;
    padding-right: calc(var(--size-x) * 2);
  }

  .nav__itemcube {
  }

  .nav__buttonicon {
    position: absolute;
    top: 50%;
    right: calc(2.2 * var(--size-x));
    width: 3rem;
    height: 3rem;
    transform: translateY(-50%);
    transition: transform 400ms cubic-bezier(0.3, 0.7, 0, 1) 100ms;
  }

  .nav__item--active .nav__buttonicon {
    transform: translateY(-50%) translateY(200%);
  }

</style>
