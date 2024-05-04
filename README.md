# RYBitten 👄

// add logo
[![npm version](https://badge.fury.io/js/rybitten.svg)](https://badge.fury.io/js/rybitten)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


![RYBitten Logo](itten-wheel.png)

RYBitten is a library for translating colors between RGB and a custom RYB color space. The library uses trilinear interpolation and is manually tuned to emulate Johannes Itten's chromatic circle. It is designed for developers, generative artists and designers who want to experiment with alternative color representations.

> "Play becomes joy, joy becomes work, work becomes play."
> **Johannes Itten, Bauhaus**

## Installation 📦

Install RYBitten with your favorite package manager:

```bash
npm install rybitten
```

### Include RYBitten in your project:
  
```javascript
// ES6 style
import { ryb2rgb } from 'rybitten';

// CommonJS style
const { ryb2rgb } = require('rybitten');
```

## Quick Start 🚀

**All RGB and RYB values are in the range `[0, 1]`.**


```javascript
import { ryb2rgb, rgb2ryb } from 'rybitten';

const rybColor = [1, 0, 0.5]; // RYB coordinates
const rgbColor = ryb2rgb(rybColor);

console.log(rgbColor); // Outputs the converted RGB coordinates

```

## Functions 📖

### ryb2rgb(coords: ColorCoords, cube?: ColorCube = RYB_CUBE): ColorCoords

- `coords`: `[0…1, 0…1, 0…1]` RYB coordinates
- `cube` (optional): [See the note on the color cube below](#interpolation-color-cube)
- `@return`: `[0…1, 0…1, 0…1]` RGB coordinates

Converts RYB coordinates to RGB using trilinear interpolation. The default color cube is manually tuned to represent the RYB color space derived from Johannes Itten's color wheel. But you can pass your own cube if you want to experiment with different color spaces. (When interacting with the RGB cube on the demo page, the custom `RYB_CUBE` is visible in your console.)

### rybHsl2rgb(hsl: ColorCoords, cube: ColorCube = RYB_CUBE): ColorCoords

- `hsl`: `[0…360, 0…1, 0…1]` HSL coordinates
- `cube` (optional): [See the note on the color cube below](#interpolation-color-cube
- `@return`: `[0…1, 0…1, 0…1]` RGB coordinates

Converts HSL coordinates to RGB, then translates them to the custom RYB color space using ryb2rgb. The HSL coordinates are in the range `[0,360], [0, 1], [0, 1]`.

## Interpolation Color Cube 🎛️

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

## License 📄

RYBitten is distributed under the [MIT License](./LICENSE).
