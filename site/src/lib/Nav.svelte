<script lang="ts">
  import { currentColors } from '../store';
  import { cubes } from "rybitten";
  

  let currentPresetId = currentColors.preset;

  const setCurrentPreset = (presetName: string) => {
    currentColors.preset = presetName;
    currentPresetId = presetName;
  };

  currentColors.isCustom.subscribe((isit) => {
    if (isit) {
      currentPresetId = "custom";
    }
  });
</script>

<div class="nav">
  <!--h3>Presets</h3-->
  <ol class="nav__list">
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
</div>

<style>
  .nav {
    background: var(--bg);
    color: var(--onBg);
  }

  .nav__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .nav__button {
    position: relative;
    display: block;
    width: 100%;
    border: none;
    background: none;
    cursor: pointer;
    color: inherit;
    font: inherit;
    text-align: left;
    padding: var(--size-x);
    overflow: hidden;
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
</style>
