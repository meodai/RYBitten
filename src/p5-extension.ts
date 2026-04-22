export * from "./main";
import { ryb2rgb, rybHsl2rgb } from "./main";
import { RYB_ITTEN, type ColorCube } from "./cubes";

export const RYB = "ryb";
export const RYBHSL = "rybhsl";

export const ryb = (cube?: ColorCube) => ({ mode: RYB, cube });
export const rybhsl = (cube?: ColorCube) => ({ mode: RYBHSL, cube });

/**
 * Minimal shape of the p5 constructor we depend on. @types/p5 describes the
 * runtime instance, not the prototype-patching surface we use here, so this
 * narrow interface is clearer than trying to reuse the upstream types.
 */
interface P5Constructor {
  prototype: P5Prototype;
}

interface P5Prototype {
  colorMode: (...args: unknown[]) => unknown;
  fill: (...args: unknown[]) => unknown;
  stroke: (...args: unknown[]) => unknown;
  background: (...args: unknown[]) => unknown;
  color: (...args: unknown[]) => unknown;
  registerMethod: (hook: string, fn: (this: P5Instance) => void) => void;
  _rybExtended?: boolean;
  RYB?: string;
  RYBHSL?: string;
  ryb?: typeof ryb;
  rybhsl?: typeof rybhsl;
}

/**
 * Bookkeeping fields we attach to individual p5 instances. These are internal
 * to this extension — never part of the public p5 API.
 */
interface P5Instance {
  constructor: P5Constructor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- p5's own typing here is a plain `any`; narrowing it would require module augmentation of p5 itself, which we deliberately avoid.
  _rybMode?: string | false | any;
  _rybMaxes?: [number, number, number, number];
  _rybCube?: ColorCube;
}

/**
 * Extends p5.js with RYB color mode support.
 * Called automatically on library load. Can be invoked manually:
 *   rybitten.extendP5(p5)
 */
export function extendP5(p5: P5Constructor): void {
  if (p5.prototype._rybExtended) return;
  p5.prototype._rybExtended = true;

  p5.prototype.RYB = RYB;
  p5.prototype.RYBHSL = RYBHSL;
  p5.prototype.ryb = ryb;
  p5.prototype.rybhsl = rybhsl;

  const originalColorMode = p5.prototype.colorMode;
  const originalFill = p5.prototype.fill;
  const originalStroke = p5.prototype.stroke;
  const originalBackground = p5.prototype.background;
  const originalColor = p5.prototype.color;

  function convertArgs(instance: P5Instance, args: unknown[]): unknown[] {
    if (instance._rybMode && typeof args[0] === "number") {
      const maxes = instance._rybMaxes ?? [255, 255, 255, 255];
      let v1: number, v2: number, v3: number;
      let a: unknown;

      if (args.length === 1) {
        v1 = v2 = v3 = (args[0] as number) / maxes[0];
      } else if (args.length === 2) {
        v1 = v2 = v3 = (args[0] as number) / maxes[0];
        a = args[1];
      } else if (args.length >= 3) {
        v1 = (args[0] as number) / maxes[0];
        v2 = (args[1] as number) / maxes[1];
        v3 = (args[2] as number) / maxes[2];
        a = args[3];
      } else {
        return args;
      }

      const options = { cube: instance._rybCube ?? RYB_ITTEN };
      const rgb =
        instance._rybMode === RYBHSL
          ? rybHsl2rgb([v1 * 360, v2, v3], options)
          : ryb2rgb([v1, v2, v3], options);

      const newArgs: unknown[] = [rgb[0], rgb[1], rgb[2]];
      if (a !== undefined) {
        const maxA = maxes[3] !== undefined ? maxes[3] : maxes[0];
        newArgs.push((a as number) / maxA);
      }
      return newArgs;
    }
    return args;
  }

  p5.prototype.colorMode = function (this: P5Instance, ...args: unknown[]) {
    const first = args[0];
    let actualMode: unknown = first;
    let cube: ColorCube | undefined;

    if (
      first !== null &&
      typeof first === "object" &&
      "mode" in (first as Record<string, unknown>)
    ) {
      const modeObj = first as { mode: unknown; cube?: ColorCube };
      actualMode = modeObj.mode;
      cube = modeObj.cube;
    }

    if (actualMode === RYB || actualMode === RYBHSL) {
      this._rybMode = actualMode;
      this._rybCube = cube;

      const rest = args.slice(1);
      if (rest.length === 0) {
        this._rybMaxes =
          actualMode === RYBHSL ? [360, 100, 100, 1] : [255, 255, 255, 255];
      } else if (rest.length === 1) {
        const m = rest[0] as number;
        this._rybMaxes = [m, m, m, m];
      } else {
        this._rybMaxes = [
          rest[0] as number,
          rest[1] as number,
          rest[2] as number,
          rest[3] !== undefined ? (rest[3] as number) : (rest[0] as number),
        ];
      }

      return originalColorMode.apply(this, ["rgb", 1]);
    }

    this._rybMode = false;
    delete this._rybMaxes;
    delete this._rybCube;
    return originalColorMode.apply(this, args);
  };

  const wrap = <T extends (...a: unknown[]) => unknown>(fn: T) =>
    function (this: P5Instance, ...args: unknown[]): unknown {
      if (this._rybMode) {
        const newArgs = convertArgs(this, args);
        const savedMode = this._rybMode;
        const savedMaxes = this._rybMaxes;
        const savedCube = this._rybCube;
        this._rybMode = false;
        try {
          return fn.apply(this, newArgs);
        } finally {
          this._rybMode = savedMode;
          this._rybMaxes = savedMaxes;
          this._rybCube = savedCube;
        }
      }
      return fn.apply(this, args);
    };

  p5.prototype.fill = wrap(originalFill);
  p5.prototype.stroke = wrap(originalStroke);
  p5.prototype.background = wrap(originalBackground);
  p5.prototype.color = wrap(originalColor);
}

// Auto-extend p5 when the library loads.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- p5 is an untyped global when loaded via <script>; we deliberately accept the weak type here.
declare const p5: any;
if (typeof p5 !== "undefined") {
  extendP5(p5 as P5Constructor);
  (p5 as P5Constructor).prototype.registerMethod(
    "init",
    function (this: P5Instance) {
      extendP5(this.constructor);
    },
  );
}
