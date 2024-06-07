<script lang="ts">
  import { onMount } from 'svelte';
  import { currentColors } from '../store';

  import type { ColorCube, ColorCoords } from "rybitten";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let input: HTMLInputElement;

  onMount(() => {
    ctx = canvas.getContext('2d');
  });

  let markerPositionsOnImage:[]|{x: number,y: number, c: number[]}[] = [];

  const closestColors = (imageData) => {
    const closestMatches = [
      { name: 'white', rgbReference: [243, 235, 202], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0]}, // off white
      { name: 'red', rgbReference: [255, 0, 0], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0] },
      { name: 'yellow', rgbReference: [255, 255, 0], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0] },
      { name: 'orange', rgbReference: [255, 165, 0], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0] },
      { name: 'blue', rgbReference: [0, 0, 255], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0] },
      { name: 'purple', rgbReference: [128, 0, 128], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0] },
      { name: 'green', rgbReference: [0, 255, 0], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0] },
      { name: 'black', rgbReference: [22, 19, 12], closestColor: [0,0,0], distance: Infinity, xyPosition: [0,0] }, // off black
    ];

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      closestMatches.forEach((color) => {
        const distance = Math.sqrt(
          Math.pow(r - color.rgbReference[0], 2) +
          Math.pow(g - color.rgbReference[1], 2) +
          Math.pow(b - color.rgbReference[2], 2),
        );

        if (distance < color.distance) {
          color.closestColor = [r, g, b];
          color.distance = distance;
          color.xyPosition = [i / 4 % imageData.width, Math.floor(i / 4 / imageData.width)];
        }
      });
    }

    return closestMatches;
  };

  const maxWidth = 700;
  const maxHeight = 700;

  const change = () => {
    if (!ctx || !input || !input.files?.length) return;

    const file = input.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (!ctx) return;

      const imgRatio = img.width / img.height;
      let newWidth = img.width;
      let newHeight = img.height;

      if ( img.width < img.height ) {
        newHeight = Math.min(maxHeight, img.height);
        newWidth = newHeight * imgRatio;
      } else {
        newWidth = Math.min(maxWidth, img.width);
        newHeight = newWidth / imgRatio;
      }

      img.width = newWidth;
      img.height = newHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
      const matches = closestColors(imageData);
      currentColors.cube = matches.map((match) => match.closestColor.map(c => c / 255)) as ColorCube;
      markerPositionsOnImage = matches.map((match) => {
        return {
        x: match.xyPosition[0] / img.width,
        y: match.xyPosition[1] / img.height,
        c: match.closestColor,
        }
      });
    };
  }

  const drop = (e) => {
    e.preventDefault();
    // set dropped file to the input if its a picture
    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        if (input) {
          input.files = e.dataTransfer.files;
          change();
        }
      }
    }
  }

  const dragOver = (e) => {
    e.preventDefault();
  }
</script>

<div class="pictureExtarct">
  <label on:drop={drop} on:dragenter={dragOver} on:dragover={dragOver}>
    <input type="file" accept="image/*" on:change={change} bind:this={input} />
  </label>
  <div class="pictureExtarct__image">
    <canvas bind:this={canvas} />
    {#each markerPositionsOnImage as pos, i}
      <div class="pictureExtarct__marker" style="--x: {pos.x}; --y: {pos.y}; --c: rgb({pos.c.join(' ')})"></div>
    {/each}
  </div>
</div>

<style>  
  .pictureExtarct__image {
    position: relative;
    width: max-content;
  }
  .pictureExtarct__marker {
    position: absolute;
    padding: 0.25em;
    border-radius: 0.25em;
    top: calc(var(--y) * 100%);
    left: calc(var(--x) * 100%); 
    transform: translate(-50%, -50%);
    background: var(--c);
    box-shadow: 0 0 0 var(--lineWidth) var(--black), 0 0 0 calc(var(--lineWidth) * 3) var(--white), 0 0 0 calc(var(--lineWidth) * 10) var(--c);
  }
</style>