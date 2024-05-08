# RYBitten 👄

[![npm version](https://badge.fury.io/js/rybitten.svg)](https://badge.fury.io/js/rybitten)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<img src="itten-wheel.png" alt="RYBitten Logo" width="400" />

RYBitten is a library for translating colors between RGB and a custom RYB color space. The library uses trilinear interpolation and is manually tuned to emulate Johannes Itten's chromatic circle. It is designed for developers, generative artists and designers who want to experiment with alternative color representations.

> "Play becomes joy, joy becomes work, work becomes play."
> **Johannes Itten, Bauhaus**

## Installation 📦

Install RYBitten with your favorite package manager:

```bash
npm install rybitten
```

Or include it directly in your HTML:

```html
<script type="module">
  import { ryb2rgb, rybHsl2rgb, cubes } from "https://esm.sh/rybitten/";
</script>
```

### Include RYBitten in your project
  
```javascript
// ES6 style
import { ryb2rgb } from 'rybitten';

// CommonJS style
const { ryb2rgb } = require('rybitten');
```

## Quick Start 🚀

**All RGB and RYB values are in the range `[0, 1]`.**

```javascript
import { ryb2rgb } from 'rybitten';

const rybColor = [1, 0, 0.5]; // RYB coordinates
const rgbColor = ryb2rgb(rybColor);

console.log(rgbColor); // Outputs the converted RGB coordinates
```

## Functions 📖

### ryb2rgb(coords: ColorCoords, cube?: ColorCube = RYB_CUBE, easingFn? = smoothstep): ColorCoords

- `coords`: `[0…1, 0…1, 0…1]` RYB coordinates
- `cube`: (*optional*): [See the note on the color cube below](#cube)
- `easingFn`: (*optional*) A custom easing function for the interpolation, defaults to `smoothstep`
- `@return`: `[0…1, 0…1, 0…1]` RGB coordinates

Converts RYB coordinates to RGB using trilinear interpolation. The default color cube is manually tuned to represent the RYB color space derived from Johannes Itten's color wheel. But you can pass your own cube if you want to experiment with different color spaces. (When interacting with the RGB cube on the demo page, the custom `RYB_CUBE` is visible in your console.)

### rybHsl2rgb(hsl: ColorCoords, cube?: ColorCube = RYB_CUBE, easingFn? = smoothstep): ColorCoords

- `hsl`: `[0…360, 0…1, 0…1]` HSL coordinates
- `cube`: (*optional*) [See the note on the color cube below](#interpolation-color-cube,
- `easingFn`: (*optional*) A custom easing function for the interpolation, defaults to `smoothstep`
- `@return`: `[0…1, 0…1, 0…1]` RGB coordinates

Converts HSL coordinates to RGB, then translates them to the custom RYB color space using ryb2rgb. The HSL coordinates are in the range `[0,360], [0, 1], [0, 1]`.

## Interpolation Color Cube 🎛️ {#cube}

The default RYB color cube used for interpolation in `RYBitten` is tuned to mimic Johannes Itten's chromatic circle. By adjusting the cube, you can achieve different effects and customize the RYB to RGB conversion.

```javascript
const RYB_CUBE = [
  // Black
  [29 / 255, 28 / 255, 28 / 255],
  
  // Red
  [227 / 255, 36 / 255, 33 / 255],
  
  // Yellow
  [243 / 255, 230 / 255, 0],
  
  // Orange
  [240 / 255, 142 / 255, 28 / 255],
  
  // Blue
  [22 / 255, 153 / 255, 218 / 255],
  
  // Violet
  [120 / 255, 34 / 255, 170 / 255],
  
  // Green
  [0, 142 / 255, 91 / 255],
  
  // White
  [253 / 255, 246 / 255, 237 / 255],
];
```

## Custom Color Gamuts 🎨

The library ships with a curated list of color gamuts that you can use to experiment with different color spaces. The default gamut is based on the work of Johannes Itten. But you can access other gamuts by importing the `CUBES` map.

Each gamut is an object with the following properties:

- `title`: The name of the color space
- `reference`: A reference image used to pick the edges of the custom color gamut
- `year`: The year the color space was introduced
- `cube`: The color cube used for interpolation

```javascript
import { cubes, rybHsl2rgb } from 'rybitten';

const cube = cubes.get('munsell');

console.log(cube); 
/**
 * {
 *  title: 'Munsell',
 *  reference: 'munsell.jpg',
 *  year: 1905,
 *  cube: [
 *  ...cube data
 *  ]
 * }
 */

rybHsl2rgb([0, 1, 0.5], cube);
```

### Available Color Gamuts

#### Historical Color Spaces

| Key | Title | Year | Reference |
| --- | --- | --- | --- |
| itten | Johannes Itten: Chromatic Circle | 1961 | [reference](references/farbkreis_extended.png) |
| itten-normalized | Johannes Itten: Chromatic Circle (Normalized) | 1961 | [reference](references/Johannes-Itten-The-chromatic-circle-some-exercises-on-the-contrast-of-pure-colors.webp) |
| bezold | Wilhelm von Bezold: Farbentafel | 1874 | [reference](references/Bezold_Farbentafel_1874.jpg) |
| boutet | Claude Boutet: Twelve-color color circles | 1708 | [reference](references/Boutet_1708_color_circles.jpg) |
| hett | J. A. H. Hett: RGV Color Wheel | 1908 | [reference](references/RGV_color_wheel_1908.jpg) |
| schiffermueller | Ignaz Schiffermüller: Versuch eines Farbensystems | 1772 | [reference](references/020_schiffermueller1.jpg) |
| harris | Harris: The Natural System of Colours | 1766 | [reference](references/Moses_Harris_The_Natural_System_of_Colours.jpg) |
| goethe | Goethe: Farbenkreis | 1809 | [reference](references/Goethe_Farbenkreis_zur_Symbolisierung_des_menschlichen_Geistes-_und_Seelenlebens_1809.jpg) |
| munsell | Munsell Color System | 1905 | [reference](references/munsell-atlas-11.jpg) |
| hayer | Charles Hayter: New Practical Treatise on the Three Primitive Colours | 1826 | [reference](references/Color_diagram_Charles_Hayter.jpg) |

#### Featured Artist Spectrum

The following color spaces were provided by artists and designers who have contributed to the project.

| Key | Title | Year | Reference |
| --- | --- | --- | --- |
| [ippsketch](https://ippsketch.com/) | Ippsketch: imposter syndrome | 2022 | [reference](references/ippsketch.png) |


## License 📄

RYBitten is distributed under the [MIT License](./LICENSE).
