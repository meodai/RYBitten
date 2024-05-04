export type ColorCoords = [number, number, number];
export type ColorCube = ColorCoords[] & { length: 8 };

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

export const RYB_CUBE: ColorCube = [
  [29 / 255, 28 / 255, 28 / 255], // black
  [0.8901960784313725, 0.1411764705882353, 0.12941176470588237], // red
  [0.9529411764705882, 0.9019607843137255, 0], // yellow
  [0.9411764705882353, 0.5568627450980392, 0.10980392156862745], // orange
  [0.08627450980392157, 0.6, 0.8549019607843137], // blue
  [0.47058823529411764, 0.13333333333333333, 0.6666666666666666], // violet
  [0, 0.5568627450980392, 0.3568627450980392], // green
  [253 / 255, 246 / 255, 237 / 255], // white
];

export function ryb2rgb(
  coords: ColorCoords,
  cube: ColorCube = RYB_CUBE,
): ColorCoords {
  const r = easingSmoothstep(coords[0]);
  const y = easingSmoothstep(coords[1]);
  const b = easingSmoothstep(coords[2]);
  const reds = cube.map((it) => it[0]) as CubeCoords;
  const greens = cube.map((it) => it[1]) as CubeCoords;
  const blues = cube.map((it) => it[2]) as CubeCoords;
  return [
    trilerp(...reds, r, y, b),
    trilerp(...greens, r, y, b),
    trilerp(...blues, r, y, b),
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

export function rybHsl2rgb(hsl: ColorCoords, cube: ColorCube): ColorCoords {
  const rgbColor = hslToRgb(hsl);
  return ryb2rgb(rgbColor, cube);
}
