import { RYB_ITTEN } from "./cubes";

import type { ColorCoords } from "./cubes";
export type { ColorCoords, ColorCube, CubesMap } from "./cubes";

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

const easingSmoothstep = (t: number): number => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number): number => a + t * (b - a);
const blerp: Blerp = (a00, a01, a10, a11, tx, ty) => {
  return lerp(lerp(a00, a01, tx), lerp(a10, a11, tx), ty);
};
// MIT License Culori
// https://github.com/Evercoder/culori/blob/40a09603b46d0ac3ead4eb16cb51405635bdcf12/src/interpolate/lerp.js#L8
const trilerp: Trilerp = (
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

function wrapAngle(angle: number): number {
  // Wrap angle between 0 and 360
  return ((angle % 360) + 360) % 360; // this avoids negative results
}

/**
 * convert HSL to RGB
 * is not specific to RYB color space
 *
 * adapted from https://github.com/Evercoder/culori/
 * MIT License Culori: Copyright (c) 2018 Dan Burzo
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
