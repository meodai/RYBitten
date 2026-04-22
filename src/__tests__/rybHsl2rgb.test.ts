import { describe, it, expect } from "vitest";
import { rybHsl2rgb, ryb2rgb, hslToRgb } from "../main";
import { type ColorCube } from "../cubes";

const CLOSE = 10;

describe("rybHsl2rgb — composition equivalence", () => {
  it("equals ryb2rgb(hslToRgb([h, s, 1-l])) with default invertLightness=true", () => {
    const hsl: [number, number, number] = [30, 0.6, 0.4];
    const out = rybHsl2rgb(hsl);
    const ref = ryb2rgb(hslToRgb([hsl[0], hsl[1], 1 - hsl[2]]));
    expect(out[0]).toBeCloseTo(ref[0], CLOSE);
    expect(out[1]).toBeCloseTo(ref[1], CLOSE);
    expect(out[2]).toBeCloseTo(ref[2], CLOSE);
  });

  it("with invertLightness=false, equals ryb2rgb(hslToRgb([h, s, l]))", () => {
    const hsl: [number, number, number] = [200, 0.5, 0.3];
    const out = rybHsl2rgb(hsl, { invertLightness: false });
    const ref = ryb2rgb(hslToRgb(hsl));
    expect(out[0]).toBeCloseTo(ref[0], CLOSE);
    expect(out[1]).toBeCloseTo(ref[1], CLOSE);
    expect(out[2]).toBeCloseTo(ref[2], CLOSE);
  });
});

describe("rybHsl2rgb — invertLightness symmetry", () => {
  it("rybHsl2rgb(h,s,l)[true] equals rybHsl2rgb(h,s,1-l)[false]", () => {
    const h = 120;
    const s = 0.7;
    const l = 0.25;
    const a = rybHsl2rgb([h, s, l]);
    const b = rybHsl2rgb([h, s, 1 - l], { invertLightness: false });
    expect(a[0]).toBeCloseTo(b[0], CLOSE);
    expect(a[1]).toBeCloseTo(b[1], CLOSE);
    expect(a[2]).toBeCloseTo(b[2], CLOSE);
  });
});

describe("rybHsl2rgb — custom cube propagates", () => {
  it("different cube yields different output", () => {
    const customCube: ColorCube = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
    ];
    const a = rybHsl2rgb([0, 1, 0.5]);
    const b = rybHsl2rgb([0, 1, 0.5], { cube: customCube });
    const diff =
      Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
    expect(diff).toBeGreaterThan(1e-6);
  });
});
