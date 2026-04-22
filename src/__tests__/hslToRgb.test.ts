import { describe, it, expect } from "vitest";
import { hslToRgb } from "../main";

const CLOSE = 10; // toBeCloseTo digits

describe("hslToRgb — 60° sector coverage", () => {
  it("h=0 (red)", () => {
    const [r, g, b] = hslToRgb([0, 1, 0.5]);
    expect(r).toBeCloseTo(1, CLOSE);
    expect(g).toBeCloseTo(0, CLOSE);
    expect(b).toBeCloseTo(0, CLOSE);
  });
  it("h=60 (yellow)", () => {
    const [r, g, b] = hslToRgb([60, 1, 0.5]);
    expect(r).toBeCloseTo(1, CLOSE);
    expect(g).toBeCloseTo(1, CLOSE);
    expect(b).toBeCloseTo(0, CLOSE);
  });
  it("h=120 (green)", () => {
    const [r, g, b] = hslToRgb([120, 1, 0.5]);
    expect(r).toBeCloseTo(0, CLOSE);
    expect(g).toBeCloseTo(1, CLOSE);
    expect(b).toBeCloseTo(0, CLOSE);
  });
  it("h=180 (cyan)", () => {
    const [r, g, b] = hslToRgb([180, 1, 0.5]);
    expect(r).toBeCloseTo(0, CLOSE);
    expect(g).toBeCloseTo(1, CLOSE);
    expect(b).toBeCloseTo(1, CLOSE);
  });
  it("h=240 (blue)", () => {
    const [r, g, b] = hslToRgb([240, 1, 0.5]);
    expect(r).toBeCloseTo(0, CLOSE);
    expect(g).toBeCloseTo(0, CLOSE);
    expect(b).toBeCloseTo(1, CLOSE);
  });
  it("h=300 (magenta)", () => {
    const [r, g, b] = hslToRgb([300, 1, 0.5]);
    expect(r).toBeCloseTo(1, CLOSE);
    expect(g).toBeCloseTo(0, CLOSE);
    expect(b).toBeCloseTo(1, CLOSE);
  });
});

describe("hslToRgb — hue wrapping", () => {
  it("h=-60 equals h=300", () => {
    const a = hslToRgb([-60, 1, 0.5]);
    const b = hslToRgb([300, 1, 0.5]);
    expect(a[0]).toBeCloseTo(b[0], CLOSE);
    expect(a[1]).toBeCloseTo(b[1], CLOSE);
    expect(a[2]).toBeCloseTo(b[2], CLOSE);
  });
  it("h=400 equals h=40", () => {
    const a = hslToRgb([400, 1, 0.5]);
    const b = hslToRgb([40, 1, 0.5]);
    expect(a[0]).toBeCloseTo(b[0], CLOSE);
    expect(a[1]).toBeCloseTo(b[1], CLOSE);
    expect(a[2]).toBeCloseTo(b[2], CLOSE);
  });
  it("h=360 equals h=0", () => {
    const a = hslToRgb([360, 1, 0.5]);
    const b = hslToRgb([0, 1, 0.5]);
    expect(a[0]).toBeCloseTo(b[0], CLOSE);
    expect(a[1]).toBeCloseTo(b[1], CLOSE);
    expect(a[2]).toBeCloseTo(b[2], CLOSE);
  });
});

describe("hslToRgb — saturation and lightness extremes", () => {
  it("s=0 produces grayscale (r=g=b=l)", () => {
    const [r, g, b] = hslToRgb([120, 0, 0.5]);
    expect(r).toBeCloseTo(0.5, CLOSE);
    expect(g).toBeCloseTo(0.5, CLOSE);
    expect(b).toBeCloseTo(0.5, CLOSE);
  });
  it("l=0 produces black", () => {
    const [r, g, b] = hslToRgb([0, 1, 0]);
    expect(r).toBeCloseTo(0, CLOSE);
    expect(g).toBeCloseTo(0, CLOSE);
    expect(b).toBeCloseTo(0, CLOSE);
  });
  it("l=1 produces white", () => {
    const [r, g, b] = hslToRgb([0, 1, 1]);
    expect(r).toBeCloseTo(1, CLOSE);
    expect(g).toBeCloseTo(1, CLOSE);
    expect(b).toBeCloseTo(1, CLOSE);
  });
});
