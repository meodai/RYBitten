import { RYB_ITTEN } from "./cubes";
import type { ColorCoords } from "./cubes";

type CubeCoords = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
interface Blerp {
  (
    a00: number,
    a01: number,
    a10: number,
    a11: number,
    tx: number,
    ty: number,
  ): number;
}
interface Trilerp {
  (
    a000: number,
    a010: number,
    a100: number,
    a110: number,
    a001: number,
    a011: number,
    a101: number,
    a111: number,
    tx: number,
    ty: number,
    tz: number,
  ): number;
}
/**
 * Applies smoothstep smoothing to a value, creating an S-curve.
 * The function interpolates smoothly between 0 and 1 using the formula: t * t * (3 - 2 * t)
 * Also known as "Smootherstep" or "Ken Perlin's smoothstep"
 *
 * @param t - Input value between 0 and 1
 * @returns Smoothed value between 0 and 1
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep#Smootherstep|Smoothstep on Wikipedia}
 *
 * @example
 * easingSmoothstep(0.5); // returns 0.5
 * easingSmoothstep(0.1); // returns 0.028
 * easingSmoothstep(0.9); // returns 0.972
 */
export const easingSmoothstep = (t: number): number => t * t * (3 - 2 * t);

/**
 * Performs linear interpolation between two values.
 * Returns the value at position t between a and b, where t is between 0 and 1.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0 to 1)
 * @returns Interpolated value: a + t * (b - a)
 *
 * @example
 * lerp(0, 100, 0.5);  // returns 50
 * lerp(20, 80, 0.25); // returns 35
 * lerp(-10, 10, 0.1); // returns -8
 */

export const lerp = (a: number, b: number, t: number): number =>
  a + t * (b - a);

/**
 * Performs bilinear interpolation between four points in a 2D space.
 * Useful for interpolating values on a rectangular grid.
 *
 * @param a00 - Value at coordinate (0,0)
 * @param a01 - Value at coordinate (0,1)
 * @param a10 - Value at coordinate (1,0)
 * @param a11 - Value at coordinate (1,1)
 * @param tx - Interpolation factor along x-axis (0 to 1)
 * @param ty - Interpolation factor along y-axis (0 to 1)
 * @returns Interpolated value
 *
 * @example
 * // Interpolate between four corners of a unit square
 * blerp(0, 1, 1, 2, 0.5, 0.5); // returns the center value
 */
export const blerp: Blerp = (a00, a01, a10, a11, tx, ty) => {
  return lerp(lerp(a00, a01, tx), lerp(a10, a11, tx), ty);
};
/**
 * Performs trilinear interpolation between eight values in a 3D space.
 * Based on Culori's implementation (MIT License)
 * MIT License Culori
 *
 * @param a000 - Value at coordinate (0,0,0)
 * @param a010 - Value at coordinate (0,1,0)
 * @param a100 - Value at coordinate (1,0,0)
 * @param a110 - Value at coordinate (1,1,0)
 * @param a001 - Value at coordinate (0,0,1)
 * @param a011 - Value at coordinate (0,1,1)
 * @param a101 - Value at coordinate (1,0,1)
 * @param a111 - Value at coordinate (1,1,1)
 * @param tx - Interpolation factor along x-axis (0 to 1)
 * @param ty - Interpolation factor along y-axis (0 to 1)
 * @param tz - Interpolation factor along z-axis (0 to 1)
 * @returns Interpolated value
 * @see {@link https://github.com/Evercoder/culori/blob/40a09603b46d0ac3ead4eb16cb51405635bdcf12/src/interpolate/lerp.js#L8|Culori Source}
 */
export const trilerp: Trilerp = (
  a000,
  a010,
  a100,
  a110,
  a001,
  a011,
  a101,
  a111,
  tx,
  ty,
  tz,
) => {
  return lerp(
    blerp(a000, a010, a100, a110, tx, ty),
    blerp(a001, a011, a101, a111, tx, ty),
    tz,
  );
};

/**
 * Converts RYB color coordinates to RGB color space
 * @param coords - Array of [red, yellow, blue] values between 0 and 1
 * @param options - Configuration options
 * @param options.cube - Color cube for conversion (defaults to RYB_ITTEN)
 * @param options.easingFn - Easing function for color interpolation
 * @returns Array of [red, green, blue] values between 0 and 1
 */
export function ryb2rgb(
  coords: ColorCoords,
  { cube = RYB_ITTEN, easingFn = easingSmoothstep } = {},
): ColorCoords {
  const r = easingFn(coords[0]);
  const g = easingFn(coords[1]);
  const b = easingFn(coords[2]);
  const reds = cube.map((it) => it[0]) as CubeCoords;
  const greens = cube.map((it) => it[1]) as CubeCoords;
  const blues = cube.map((it) => it[2]) as CubeCoords;
  return [
    trilerp(...reds, r, g, b),
    trilerp(...greens, r, g, b),
    trilerp(...blues, r, g, b),
  ];
}

/**
 * Normalizes an angle to be between 0 and 360 degrees.
 * Handles negative angles by converting them to their positive equivalent.
 *
 * @param angle - Input angle in degrees (can be any number)
 * @returns Normalized angle between 0 and 360 degrees
 *
 * @example
 * wrapAngle(400);  // returns 40
 * wrapAngle(-90);  // returns 270
 * wrapAngle(360);  // returns 0
 * wrapAngle(721);  // returns 1
 */
function wrapAngle(angle: number): number {
  // Wrap angle between 0 and 360
  return ((angle % 360) + 360) % 360; // this avoids negative results
}

/**
 * Converts HSL (Hue, Saturation, Lightness) color values to RGB color space.
 * Adapted from Culori (MIT License)
 *
 * @param hsl - Array of [hue, saturation, lightness]
 * @param hsl[0] - Hue value in degrees (0-360)
 * @param hsl[1] - Saturation value (0-1)
 * @param hsl[2] - Lightness value (0-1)
 * @returns Array of [red, green, blue] values, each between 0 and 1
 *
 * @example
 * hslToRgb([0, 1, 0.5]);    // returns [1, 0, 0] (red)
 * hslToRgb([120, 1, 0.5]);  // returns [0, 1, 0] (green)
 * hslToRgb([240, 1, 0.5]);  // returns [0, 0, 1] (blue)
 * hslToRgb([0, 0, 0.5]);    // returns [0.5, 0.5, 0.5] (gray)
 *
 * @see {@link https://github.com/Evercoder/culori/|Culori Source}
 */
export function hslToRgb(hsl: ColorCoords): ColorCoords {
  let [h, s, l] = hsl;
  h = wrapAngle(h || 0);
  let m1 = l + s * (l < 0.5 ? l : 1 - l);
  let m2 = m1 - (m1 - l) * 2 * Math.abs(((h / 60) % 2) - 1);
  let res;
  switch (Math.floor(h / 60)) {
    case 0:
      res = [m1, m2, 2 * l - m1];
      break;
    case 1:
      res = [m2, m1, 2 * l - m1];
      break;
    case 2:
      res = [2 * l - m1, m1, m2];
      break;
    case 3:
      res = [2 * l - m1, m2, m1];
      break;
    case 4:
      res = [m2, 2 * l - m1, m1];
      break;
    case 5:
      res = [m1, 2 * l - m1, m2];
      break;
    default:
      res = [2 * l - m1, 2 * l - m1, 2 * l - m1];
  }
  return res as ColorCoords;
}

/**
 * Converts a color from RYB-HSL color space to RGB color space.
 * Combines HSL to RGB conversion with RYB to RGB mapping using a color cube.
 *
 * @param hsl - Array of [hue, saturation, lightness]
 * @param hsl[0] - Hue value in degrees (0-360)
 * @param hsl[1] - Saturation value (0-1)
 * @param hsl[2] - Lightness value (0-1)
 * @param options - Configuration options
 * @param [options.cube=RYB_ITTEN] - Color cube for RYB to RGB mapping
 * @param [options.easingFn=easingSmoothstep] - Easing function for color interpolation
 * @param [options.invertLightness=true] - Whether to invert the lightness value
 * @returns Array of [red, green, blue] values, each between 0 and 1
 *
 * @example
 * // Convert RYB HSL red to RGB
 * rybHsl2rgb([0, 1, 0.5]); // Returns RGB values
 *
 * // Using custom options
 * rybHsl2rgb([120, 1, 0.5], {
 *   invertLightness: false,
 *   cube: customCube,
 *   easingFn: customEasing
 * });
 */
export function rybHsl2rgb(
  hsl: ColorCoords,
  {
    cube = RYB_ITTEN,
    easingFn = easingSmoothstep,
    invertLightness = true,
  } = {},
): ColorCoords {
  const l = invertLightness ? 1 - hsl[2] : hsl[2];
  const rgbColor = hslToRgb([hsl[0], hsl[1], l]);
  return ryb2rgb(rgbColor, { cube, easingFn });
}
