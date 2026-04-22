import { describe, it, expect } from "vitest";
import { cubes, RYB_ITTEN, type ColorCube } from "../cubes";
import { ryb2rgb } from "../main";

const CLOSE = 10;

describe("cubes map — structural", () => {
  it("is non-empty", () => {
    expect(cubes.size).toBeGreaterThan(0);
  });

  it.each(Array.from(cubes.entries()))(
    "entry '%s' has the required metadata shape",
    (key, entry) => {
      expect(typeof entry.title).toBe("string");
      expect(typeof entry.author).toBe("string");
      expect(typeof entry.reference).toBe("string");
      expect(typeof entry.year).toBe("number");
      expect(Array.isArray(entry.cube)).toBe(true);
      expect(entry.cube).toHaveLength(8);
      void key;
    },
  );

  it.each(Array.from(cubes.entries()))(
    "entry '%s' cube has 8 RGB triples in [0, 1]",
    (key, entry) => {
      for (const triple of entry.cube) {
        expect(triple).toHaveLength(3);
        for (const channel of triple) {
          expect(typeof channel).toBe("number");
          expect(channel).toBeGreaterThanOrEqual(0);
          expect(channel).toBeLessThanOrEqual(1);
        }
      }
      void key;
    },
  );
});

describe("RYB_ITTEN — structural", () => {
  it("has 8 RGB triples in [0, 1]", () => {
    expect(RYB_ITTEN).toHaveLength(8);
    for (const triple of RYB_ITTEN) {
      expect(triple).toHaveLength(3);
      for (const channel of triple) {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("ryb2rgb — algorithmic roundtrip across every cube", () => {
  /**
   * cornerIndex maps an RYB corner (rx, gy, bz) ∈ {0,1}³ to the cube index
   * per ryb2rgb's trilerp layout. trilerp uses row-major parameter names
   * (a_ijk with i=ty, j=tx, k=tz), and ryb2rgb passes cube entries in
   * order [a000, a010, a100, a110, a001, a011, a101, a111], so:
   *   cube[0] = (r=0,g=0,b=0), cube[1] = (r=1,g=0,b=0),
   *   cube[2] = (r=0,g=1,b=0), cube[3] = (r=1,g=1,b=0),
   *   cube[4] = (r=0,g=0,b=1), cube[5] = (r=1,g=0,b=1),
   *   cube[6] = (r=0,g=1,b=1), cube[7] = (r=1,g=1,b=1).
   * Smoothstep is 0 at 0 and 1 at 1, so at corners ryb2rgb returns the exact
   * cube vertex regardless of which cube is passed.
   */
  const cornerIndex = (rx: 0 | 1, gy: 0 | 1, bz: 0 | 1): number =>
    4 * bz + 2 * gy + rx;

  const allCubes: Array<[string, ColorCube]> = Array.from(cubes.entries()).map(
    ([k, v]) => [k, v.cube],
  );

  it.each(allCubes)(
    "cube '%s' reproduces its own 8 vertices at the 8 RYB corners",
    (_key, cube) => {
      for (const rx of [0, 1] as const) {
        for (const gy of [0, 1] as const) {
          for (const bz of [0, 1] as const) {
            const out = ryb2rgb([rx, gy, bz], { cube });
            const expected = cube[cornerIndex(rx, gy, bz)];
            expect(out[0]).toBeCloseTo(expected[0], CLOSE);
            expect(out[1]).toBeCloseTo(expected[1], CLOSE);
            expect(out[2]).toBeCloseTo(expected[2], CLOSE);
          }
        }
      }
    },
  );
});
