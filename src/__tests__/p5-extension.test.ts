import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extendP5, RYB, RYBHSL, rybhsl } from "../p5-extension";
import { ryb2rgb, rybHsl2rgb } from "../main";
import { RYB_ITTEN } from "../itten";
import type { ColorCube } from "../cubes";

const CLOSE = 10;

/**
 * Minimal stand-in for the p5 constructor: a prototype with the five methods
 * the extension wraps, each recording the arguments it was called with.
 */
function makeFakeP5() {
  const calls: Record<string, unknown[][]> = {
    colorMode: [],
    fill: [],
    stroke: [],
    background: [],
    color: [],
  };
  const record =
    (name: string) =>
    (...args: unknown[]) => {
      calls[name].push(args);
      return args;
    };
  function FakeP5() {}
  FakeP5.prototype.colorMode = record("colorMode");
  FakeP5.prototype.fill = record("fill");
  FakeP5.prototype.stroke = record("stroke");
  FakeP5.prototype.background = record("background");
  FakeP5.prototype.color = record("color");
  return { FakeP5, calls };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the fake is intentionally loose
type AnyInstance = any;

function makeInstance(FakeP5: { prototype: object }): AnyInstance {
  const inst = Object.create(FakeP5.prototype);
  inst.constructor = FakeP5;
  return inst;
}

const last = (arr: unknown[][]): unknown[] => arr[arr.length - 1];

function expectRgb(actual: unknown[], expected: readonly number[]) {
  expect(actual).toHaveLength(expected.length);
  expected.forEach((v, i) => expect(actual[i] as number).toBeCloseTo(v, CLOSE));
}

describe("extendP5 — prototype patching", () => {
  it("exposes RYB, RYBHSL, ryb, rybhsl on the prototype", () => {
    const { FakeP5 } = makeFakeP5();
    extendP5(FakeP5);
    expect(FakeP5.prototype.RYB).toBe(RYB);
    expect(FakeP5.prototype.RYBHSL).toBe(RYBHSL);
    expect(typeof FakeP5.prototype.ryb).toBe("function");
    expect(typeof FakeP5.prototype.rybhsl).toBe("function");
  });

  it("is idempotent — patching twice wraps only once", () => {
    const { FakeP5 } = makeFakeP5();
    extendP5(FakeP5);
    const once = FakeP5.prototype.fill;
    extendP5(FakeP5);
    expect(FakeP5.prototype.fill).toBe(once);
  });
});

describe("extendP5 — colorMode", () => {
  it("colorMode(RYB) switches p5 to rgb with max 1", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    expect(last(calls.colorMode)).toEqual(["rgb", 1]);
    expect(p._rybMode).toBe(RYB);
    expect(p._rybMaxes).toEqual([255, 255, 255, 255]);
  });

  it("colorMode(RYBHSL) defaults to 360/100/100/1 maxes", () => {
    const { FakeP5 } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYBHSL);
    expect(p._rybMaxes).toEqual([360, 100, 100, 1]);
  });

  it("colorMode(RYB, 1) sets a uniform max", () => {
    const { FakeP5 } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB, 1);
    expect(p._rybMaxes).toEqual([1, 1, 1, 1]);
  });

  it("colorMode(rybhsl(cube)) stores the custom cube", () => {
    const { FakeP5 } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    const cube: ColorCube = [
      [1, 1, 1],
      [1, 0, 0],
      [1, 1, 0],
      [1, 0.5, 0],
      [0, 0, 1],
      [0.5, 0, 0.5],
      [0, 1, 0],
      [0, 0, 0],
    ];
    p.colorMode(rybhsl(cube));
    expect(p._rybMode).toBe(RYBHSL);
    expect(p._rybCube).toBe(cube);
  });

  it("switching to a non-RYB mode clears state and passes through", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    p.colorMode("hsl", 360, 100, 100);
    expect(p._rybMode).toBe(false);
    expect(p._rybMaxes).toBeUndefined();
    expect(p._rybCube).toBeUndefined();
    expect(last(calls.colorMode)).toEqual(["hsl", 360, 100, 100]);
  });
});

describe("extendP5 — argument conversion", () => {
  it("RYB: fill(255, 0, 0) becomes the cube's red vertex", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    p.fill(255, 0, 0);
    expectRgb(last(calls.fill), RYB_ITTEN[1]);
  });

  it("RYB: alpha is scaled by the fourth max and appended", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    p.stroke(0, 255, 0, 127.5);
    const out = last(calls.stroke);
    expectRgb(out.slice(0, 3), RYB_ITTEN[2]);
    expect(out[3]).toBeCloseTo(0.5, CLOSE);
  });

  it("RYB: a single gray value walks the white→black diagonal", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    p.background(127.5);
    expectRgb(last(calls.background), ryb2rgb([0.5, 0.5, 0.5]));
  });

  it("RYBHSL: fill(h, s, l) maps through rybHsl2rgb", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYBHSL);
    p.fill(90, 50, 25);
    expectRgb(last(calls.fill), rybHsl2rgb([90, 0.5, 0.25]));
  });

  it("RYBHSL: custom cube is forwarded", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    const cube: ColorCube = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
    ];
    p.colorMode(rybhsl(cube));
    p.fill(0, 100, 50);
    expectRgb(last(calls.fill), rybHsl2rgb([0, 1, 0.5], { cube }));
  });

  it("non-numeric first argument passes through untouched", () => {
    const { FakeP5, calls } = makeFakeP5();
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    p.fill("#ff0000");
    expect(last(calls.fill)).toEqual(["#ff0000"]);
  });

  it("RYB mode is restored after the wrapped call, even if it throws", () => {
    const { FakeP5 } = makeFakeP5();
    FakeP5.prototype.fill = () => {
      throw new Error("boom");
    };
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    expect(() => p.fill(1, 2, 3)).toThrow("boom");
    expect(p._rybMode).toBe(RYB);
    expect(p._rybMaxes).toEqual([255, 255, 255, 255]);
  });

  it("nested p5 calls made by the original see plain rgb mode", () => {
    const { FakeP5, calls } = makeFakeP5();
    // Simulate p5's real fill(), which internally calls this.color(...)
    FakeP5.prototype.fill = function (this: AnyInstance, ...args: unknown[]) {
      calls.fill.push(args);
      return this.color(...args);
    };
    extendP5(FakeP5);
    const p = makeInstance(FakeP5);
    p.colorMode(RYB);
    p.fill(255, 0, 0);
    // color() must receive the already-converted rgb, not re-convert it
    expectRgb(last(calls.color), RYB_ITTEN[1]);
  });
});

describe("auto-registration on load", () => {
  const g = globalThis as { p5?: unknown };

  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    delete g.p5;
  });

  it("p5 1.x: registers an init hook via prototype.registerMethod", async () => {
    const { FakeP5 } = makeFakeP5();
    const registerMethod = vi.fn();
    FakeP5.prototype.registerMethod = registerMethod;
    g.p5 = FakeP5;
    await import("../p5-extension");
    expect(FakeP5.prototype._rybExtended).toBe(true);
    expect(registerMethod).toHaveBeenCalledWith("init", expect.any(Function));
  });

  it("p5 2.x: registers through p5.registerAddon and does not throw", async () => {
    const { FakeP5 } = makeFakeP5();
    const registerAddon = vi.fn((addon: (p: unknown) => void) => addon(FakeP5));
    (FakeP5 as unknown as { registerAddon: unknown }).registerAddon =
      registerAddon;
    g.p5 = FakeP5;
    await expect(import("../p5-extension")).resolves.toBeDefined();
    expect(registerAddon).toHaveBeenCalledTimes(1);
    expect(FakeP5.prototype._rybExtended).toBe(true);
  });

  it("p5 with neither hook API still gets the prototype patched", async () => {
    const { FakeP5 } = makeFakeP5();
    g.p5 = FakeP5;
    await expect(import("../p5-extension")).resolves.toBeDefined();
    expect(FakeP5.prototype._rybExtended).toBe(true);
  });
});
