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

  const closestColors = (imageData) => {
    const closestMatches = [
      { name: 'white', rgbReference: [255, 255, 255], closestColor: [0,0,0], distance: Infinity },
      { name: 'red', rgbReference: [255, 0, 0], closestColor: [0,0,0], distance: Infinity },
      { name: 'yellow', rgbReference: [255, 255, 0], closestColor: [0,0,0], distance: Infinity },
      { name: 'orange', rgbReference: [255, 165, 0], closestColor: [0,0,0], distance: Infinity },
      { name: 'blue', rgbReference: [0, 0, 255], closestColor: [0,0,0], distance: Infinity },
      { name: 'purple', rgbReference: [128, 0, 128], closestColor: [0,0,0], distance: Infinity },
      { name: 'green', rgbReference: [0, 255, 0], closestColor: [0,0,0], distance: Infinity },
      { name: 'black', rgbReference: [0, 0, 0], closestColor: [0,0,0], distance: Infinity },
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
        }
      });
    }

    return closestMatches;
  };

  const change = () => {
    if (!ctx || !input || !input.files?.length) return;

    const file = input.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const matches = closestColors(imageData);
      currentColors.cube = matches.map((match) => match.closestColor.map(c => c / 255)) as ColorCube;
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
  <canvas bind:this={canvas} />
</div>