import { formatCSS } from "./formatCSS";
import { rybHsl2rgb, cubes } from "rybitten";
import type { ColorCoords } from "rybitten";

export const getColorsHSL = (
  amount = 12,
  s = 1,
  l = 0.5,
  {
    hFn = (h: number): number => h,
    oldScool = false,
    cube = cubes.get('itten-normalized')?.cube,
  } = {},
):string[] => {
  return new Array(amount).fill(0).map((_, i:number) => {
    const h = oldScool
      ? hFn(1 - i / amount) * 360 + 120
      : hFn((i + 1) / amount) * 360;
    return formatCSS(
      rybHsl2rgb(
        [h, s, l], 
        {cube}
      ),
    );
  })
};