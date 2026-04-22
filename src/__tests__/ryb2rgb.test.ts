import { describe, it, expect } from "vitest";
import { ryb2rgb } from "../main";
import { RYB_ITTEN, type ColorCube } from "../cubes";

const CLOSE = 10;

/**
 * Maps an RYB corner `(rx, gy, bz)` (each 0 or 1) to its index in the default
 * cube ordering `[white, red, yellow, orange, blue, violet, green, black]`.
 *
 * Derivation: ryb2rgb passes cube entries into trilerp's `a000, a010, a100,
 * a110, a001, a011, a101, a111` slots in array order. trilerp's parameter
 * names use row-major indexing (`a_ijk` with i=ty, j=tx, k=tz), so:
 *   cube[0]=a000 @ (r=0,g=0,b=0) = white
 *   cube[1]=a010 @ (r=1,g=0,b=0) = red
 *   cube[2]=a100 @ (r=0,g=1,b=0) = yellow
 *   cube[3]=a110 @ (r=1,g=1,b=0) = orange
 *   cube[4]=a001 @ (r=0,g=0,b=1) = blue
 *   cube[5]=a011 @ (r=1,g=0,b=1) = violet
 *   cube[6]=a101 @ (r=0,g=1,b=1) = green
 *   cube[7]=a111 @ (r=1,g=1,b=1) = black
 */
function cornerIndex(rx: 0 | 1, gy: 0 | 1, bz: 0 | 1): number {
  return 4 * bz + 2 * gy + rx;
}

describe("ryb2rgb — default cube corners", () => {
  // smoothstep(0) === 0 and smoothstep(1) === 1, so corners map exactly.
  for (const rx of [0, 1] as const) {
    for (const gy of [0, 1] as const) {
      for (const bz of [0, 1] as const) {
        it(`(${rx},${gy},${bz}) equals cube[${cornerIndex(rx, gy, bz)}]`, () => {
          const out = ryb2rgb([rx, gy, bz]);
          const expected = RYB_ITTEN[cornerIndex(rx, gy, bz)];
          expect(out[0]).toBeCloseTo(expected[0], CLOSE);
          expect(out[1]).toBeCloseTo(expected[1], CLOSE);
          expect(out[2]).toBeCloseTo(expected[2], CLOSE);
        });
      }
    }
  }
});

describe("ryb2rgb — options.cube propagates", () => {
  it("custom cube changes the output", () => {
    const customCube: ColorCube = [
      [0, 0, 0], // white → black
      [0.1, 0, 0],
      [0, 0.1, 0],
      [0.1, 0.1, 0],
      [0, 0, 0.1],
      [0.1, 0, 0.1],
      [0, 0.1, 0.1],
      [0.2, 0.2, 0.2],
    ];
    const out = ryb2rgb([0.5, 0.5, 0.5], { cube: customCube });
    // All 8 custom-cube corners are < 0.25 on every channel, so interpolated
    // output must also be < 0.25, unlike the default Itten cube at (0.5,0.5,0.5)
    expect(out[0]).toBeLessThan(0.25);
    expect(out[1]).toBeLessThan(0.25);
    expect(out[2]).toBeLessThan(0.25);
  });
});

describe("ryb2rgb — options.easingFn propagates", () => {
  it("linear easing differs from default (smoothstep)", () => {
    const linear = (t: number): number => t;
    const smooth = ryb2rgb([0.3, 0.7, 0.4]);
    const lin = ryb2rgb([0.3, 0.7, 0.4], { easingFn: linear });
    // At off-centre inputs, linear vs smoothstep must produce different outputs
    const diff =
      Math.abs(smooth[0] - lin[0]) +
      Math.abs(smooth[1] - lin[1]) +
      Math.abs(smooth[2] - lin[2]);
    expect(diff).toBeGreaterThan(1e-6);
  });
});

describe("ryb2rgb — perf refactor parity", () => {
  // Reference implementation using .map() per channel, matching the
  // pre-refactor behavior. If the indexed access in main.ts ever drifts
  // from this, this test fails.
  function ryb2rgbReference(
    coords: [number, number, number],
    cube: ColorCube,
  ): [number, number, number] {
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const r = smoothstep(coords[0]);
    const g = smoothstep(coords[1]);
    const b = smoothstep(coords[2]);
    const trilerp = (
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
    ) => {
      const lerp = (x: number, y: number, t: number) => x + t * (y - x);
      const blerp = (
        x00: number,
        x01: number,
        x10: number,
        x11: number,
        ttx: number,
        tty: number,
      ) => lerp(lerp(x00, x01, ttx), lerp(x10, x11, ttx), tty);
      return lerp(
        blerp(a000, a010, a100, a110, tx, ty),
        blerp(a001, a011, a101, a111, tx, ty),
        tz,
      );
    };
    return cube[0].map((_, ch) =>
      trilerp(
        cube[0][ch],
        cube[1][ch],
        cube[2][ch],
        cube[3][ch],
        cube[4][ch],
        cube[5][ch],
        cube[6][ch],
        cube[7][ch],
        r,
        g,
        b,
      ),
    ) as [number, number, number];
  }

  const grid = [
    [0.1, 0.2, 0.3],
    [0.5, 0.5, 0.5],
    [0.7, 0.1, 0.9],
    [0.33, 0.66, 0.1],
    [0.9, 0.9, 0.9],
  ] as const;

  for (const input of grid) {
    it(`matches reference for input ${JSON.stringify(input)}`, () => {
      const a = ryb2rgb([...input]);
      const b = ryb2rgbReference([...input], RYB_ITTEN);
      expect(a[0]).toBeCloseTo(b[0], CLOSE);
      expect(a[1]).toBeCloseTo(b[1], CLOSE);
      expect(a[2]).toBeCloseTo(b[2], CLOSE);
    });
  }
});
