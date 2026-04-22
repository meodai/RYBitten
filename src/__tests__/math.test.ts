import { describe, it, expect } from "vitest";
import { lerp, blerp, trilerp, easingSmoothstep } from "../main";

describe("lerp", () => {
  it("returns a when t=0", () => {
    expect(lerp(3, 7, 0)).toBe(3);
  });
  it("returns b when t=1", () => {
    expect(lerp(3, 7, 1)).toBe(7);
  });
  it("returns midpoint when t=0.5", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
  it("handles negative ranges", () => {
    expect(lerp(-10, 10, 0.1)).toBeCloseTo(-8, 10);
  });
});

describe("blerp", () => {
  it("returns the constant when all corners equal", () => {
    expect(blerp(5, 5, 5, 5, 0.3, 0.7)).toBe(5);
  });
  it("returns a00 at (0,0)", () => {
    expect(blerp(1, 2, 3, 4, 0, 0)).toBe(1);
  });
  it("returns a01 at (1,0)", () => {
    expect(blerp(1, 2, 3, 4, 1, 0)).toBe(2);
  });
  it("returns a10 at (0,1)", () => {
    expect(blerp(1, 2, 3, 4, 0, 1)).toBe(3);
  });
  it("returns a11 at (1,1)", () => {
    expect(blerp(1, 2, 3, 4, 1, 1)).toBe(4);
  });
  it("returns centre average at (0.5, 0.5) for unit square", () => {
    expect(blerp(0, 1, 1, 2, 0.5, 0.5)).toBeCloseTo(1, 10);
  });
});

describe("trilerp", () => {
  it("returns the constant when all 8 corners equal", () => {
    expect(trilerp(7, 7, 7, 7, 7, 7, 7, 7, 0.2, 0.8, 0.4)).toBe(7);
  });
  it("returns each corner at its trilerp slot", () => {
    // trilerp's parameter name `a_ijk` uses row-major matrix indexing:
    // i = ty, j = tx, k = tz. So `a010` sits at (tx=1, ty=0, tz=0).
    // (The trilerp JSDoc in src/main.ts uses (x,y,z) notation in the
    // parameter *descriptions* and disagrees with the parameter *names*.
    // The names are the contract. Doc fix tracked for Phase 4.)
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0)).toBe(1); // a000
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 1, 0, 0)).toBe(2); // a010
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 0)).toBe(3); // a100
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 0)).toBe(4); // a110
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 1)).toBe(5); // a001
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 1, 0, 1)).toBe(6); // a011
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 1)).toBe(7); // a101
    expect(trilerp(1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 1)).toBe(8); // a111
  });
});

describe("easingSmoothstep", () => {
  it("returns 0 at t=0", () => {
    expect(easingSmoothstep(0)).toBe(0);
  });
  it("returns 1 at t=1", () => {
    expect(easingSmoothstep(1)).toBe(1);
  });
  it("returns 0.5 at t=0.5", () => {
    expect(easingSmoothstep(0.5)).toBeCloseTo(0.5, 10);
  });
  it("is symmetric around 0.5", () => {
    expect(easingSmoothstep(0.3) + easingSmoothstep(0.7)).toBeCloseTo(1, 10);
  });
});
