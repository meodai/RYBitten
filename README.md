# RYBitten 👄

A color space conversion library for transforming between RGB and RYB (Red-Yellow-Blue) colors.

[![npm version](https://badge.fury.io/js/rybitten.svg)](https://badge.fury.io/js/rybitten)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<img src="screenshots/colorcloth.png" alt="Cloth particles using RYBitten" />

## What is RYBitten?

**RYBitten** is a lightweight library for translating colors between RGB and a custom RYB (Red-Yellow-Blue) color space. It’s designed for developers, generative artists, and designers who want to create harmonious, consistent, or randomized color palettes effortlessly. The library emulates Johannes Itten's chromatic circle using trilinear interpolation and customizable options, making it a versatile tool for creative projects.

> "Play becomes joy, joy becomes work, work becomes play."
> **Johannes Itten, Bauhaus**

## Features ✨

- **Color Conversion**: Effortlessly translate between RGB and a custom RYB space.
- **Easy Integration**: A tiny library with no dependencies.
- **Customizable Gamuts**: Experiment with historical color spaces or create your own.
- **Subtractive Color Model**: Emulates subtractive color.

## Installation 📦

Install RYBitten with your favorite package manager:

```bash
npm install rybitten
```

Or include it directly in your HTML:

```html
<script type="module">
  import { ryb2rgb, rybHsl2rgb } from "https://esm.sh/rybitten/";
  import { cubes } from "https://esm.sh/rybitten/cubes"; // Optional gamut presets
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

const rgbColor = ryb2rgb([1, 0, 0.5]);

console.log(rgbColor); // Outputs the RGB equivalent
```

## API Reference 📖

### ryb2rgb(coords: ColorCoords, {cube?: ColorCube = RYB_ITTEN, easingFn? = easingSmoothstep}): ColorCoords

Convert RYB to RGB using trilinear interpolation.

- `coords`: `[0…1, 0…1, 0…1]` RYB coordinates
- `options`: (*optional*) An object with the following properties:
  - `cube`: (*optional*): [See the note on the color cube below](#cube) defaults to `RYB_ITTEN`
  - `easingFn`: (*optional*) Custom easing function used for the interpolation, defaults to `smoothstep`
- `@return`: `[0…1, 0…1, 0…1]` RGB coordinates

**Note**: RYB uses a subtractive color model where black = all colors, white = no colors. **white will turn to black, and black will turn to white.**

### rybHsl2rgb(hsl: [h: number, s: number, l: number], options?): ColorCoords

Convert HSL to RGB, then apply the RYB space.

- `hsl`: Array of `[hue (0…360), saturation (0…1), lightness (0…1)]`
- `options`: (*optional*) An object with the following properties:
  - `cube`: (*optional*) [See the note on the color cube below](#interpolation-color-cube,
  - `easingFn`: (*optional*) A custom easing function for the interpolation, defaults to `smoothstep`
  - `invertLightness`: (*optional*) Inverts the lightness value, defaults to `true` (0 is black, 1 is white), if set to `false` l:0 is white, l:1 is black
- `@return`: `[0…1, 0…1, 0…1]` RGB coordinates

Converts HSL coordinates to RGB, then translates them to the custom RYB color space using ryb2rgb. The HSL coordinates are in the range `[0,360], [0, 1], [0, 1]`. Lightness is inverted to match the RYB color space.

## Interpolation Color Cube 🎛️

The default RYB color cube used for interpolation in `RYBitten` is tuned to mimic Johannes Itten's chromatic circle. By adjusting the cube, you can achieve different effects and customize the RYB to RGB conversion.

The cube is inverted to match the subtractive color model, where white is the absence of color and black is the presence of all colors.

```javascript
const RYB_CUBE = [
  // White
  [253 / 255, 246 / 255, 237 / 255],
  
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

  // Black
  [29 / 255, 28 / 255, 28 / 255],
];
```

## Custom Gamuts Presets 🧊

The library ships with a curated list of color gamuts that you can use to experiment with different color spaces. The default gamut is based on the work of Johannes Itten. But you can access other gamuts by importing the `CUBES` map.

Each gamut is an object with the following properties:

- `title`: The name of the color space
- `reference`: A reference image used to pick the edges of the custom color gamut
- `year`: The year the color space was introduced
- `cube`: The color cube used for interpolation

```javascript
import { rybHsl2rgb } from 'rybitten';
import { cubes } from 'rybitten/cubes';

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

rybHsl2rgb([0, 1, 0.5], {cube});
```

## TypeScript Support 📝

RYBitten is written in TypeScript and includes type definitions out of the box:

```typescript
import type { ColorCoords, ColorCube } from 'rybitten';
```

### Available Color Gamuts

The library provides a collection of historical and modern color gamuts through the `cubes` Map. Import and use them like this:

```javascript
import { rybHsl2rgb } from 'rybitten';
import { cubes } from 'rybitten/cubes';

// Access any gamut by its key
const munsellCube = cubes.get('munsell').cube;
const albersCube = cubes.get('albers').cube;

// Use it in color conversion
const rgbColor = rybHsl2rgb([0, 1, 0.5], { cube: munsellCube });

// Get metadata about the color space
const { title, author, year, reference } = cubes.get('munsell');
```

#### Historical Color Spaces

| Key | Title | Year | Reference |
| --- | --- | --- | --- |
| itten | Johannes Itten: Chromatic Circle | 1961 | [reference](references/farbkreis_extended.png) |
| itten-normalized | Johannes Itten: Chromatic Circle (Paper-white) | 1961 | [reference](references/Johannes-Itten-The-chromatic-circle-some-exercises-on-the-contrast-of-pure-colors.webp) |
| bezold | Wilhelm von Bezold: Farbentafel | 1874 | [reference](references/Bezold_Farbentafel_1874.jpg) |
| boutet | Claude Boutet: Twelve-color color circles | 1708 | [reference](references/Boutet_1708_color_circles.jpg) |
| hett | J. A. H. Hett: RGV Color Wheel | 1908 | [reference](references/RGV_color_wheel_1908.png) |
| schiffermueller | Ignaz Schiffermüller: Versuch eines Farbensystems | 1772 | [reference](references/020_schiffermueller1.jpg) |
| harris | Harris: The Natural System of Colours | 1766 | [reference](references/Moses_Harris_The_Natural_System_of_Colours.jpg) |
| goethe | Goethe: Farbenkreis | 1809 | [reference](references/Goethe_Farbenkreis_zur_Symbolisierung_des_menschlichen_Geistes-_und_Seelenlebens_1809.jpg) |
| munsell | Munsell Color System | 1905 | [reference](references/munsell-atlas-11.jpg) |
| hayer | Charles Hayter: New Practical Treatise on the Three Primitive Colours | 1826 | [reference](references/Color_diagram_Charles_Hayter.jpg) |
| bormann | Heinrich-Siegfried Bormann: Gouache tint study for Josef Alber's Preliminary Course" | 1931 | [reference](references/bormann.png) |
| chevreul | Michel Eugène Chevreul: Chromatic Circle | 1839 | |
| maycock | Mark M. Maycock's "Scale of Normal Colors and their Hues" | 1895 | |
| colorprinter | John Earhart's "The Color Printer" | 1892 | |
| japschool | Japanese School Textbook  | 1930 | [reference](references/textbook-3.jpg) |
| kindergarten1890 | Milton Bradley's Kindergarten Occupation Material | 1890 | [reference](references/kindergarten-1890.jpg) |
| albers | Josef Albers: Interaction of Color | 1942 | [reference](references/albers-color-harmony.jpg) |
| lohse |  Richard Paul Lohse's "Kunsthalle Bern Poster"  | 1970 | [reference](references/lohse.png) |
| rgb | James Clerk Maxwell's "Inverted RGB" | 1860 | |

#### Featured Artist Spectrum

The following color spaces were provided by artists and designers who have contributed to the project.

| Key | Title | Year | Reference |
| --- | --- | --- | --- |
| [ippsketch](https://ippsketch.com/) | Ippsketch: imposter syndrome | 2022 | [reference](references/ippsketch.png) |
| ten | Roni Kaufman's "Ten" | 2022 | [reference](references/ten.png) |

## Utility Functions 🛠️

The library exports several utility functions that are used internally for color interpolation.
But if you are anything like me, you might find them useful for other purposes when working with this library.

### lerp(a: number, b: number, t: number): number

Linear interpolation between two values.

```javascript
import { lerp } from 'rybitten';

lerp(0, 100, 0.5); // returns 50
```


### blerp(a00: number, a01: number, a10: number, a11: number, tx: number, ty: number): number

Bilinear interpolation between four points in a 2D space. Useful for interpolating values on a rectangular grid.

```javascript
import { blerp } from 'rybitten';

// Interpolate between four corners of a unit square
blerp(0, 1, 1, 2, 0.5, 0.5); // returns center value
```

### trilerp(a000: number, a010: number, a100: number, a110: number, a001: number, a011: number, a101: number, a111: number, tx: number, ty: number, tz: number): number

Trilinear interpolation between eight points in a 3D space. This is the core interpolation function used for the color cube conversion.

```javascript
import { trilerp } from 'rybitten';

// Interpolate within a color cube
const value = trilerp(
  0, 1, 1, 1,  // front face values
  0, 1, 1, 1,  // back face values
  0.5, 0.5, 0.5 // position in cube
);
```

## License 📄

RYBitten is distributed under the [MIT License](./LICENSE).
