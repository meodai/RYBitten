/* eslint-disable @typescript-eslint/no-explicit-any */
export * from "./main";
import { ryb2rgb, rybHsl2rgb } from "./main";
import { RYB_ITTEN } from "./cubes";

export const RYB = "ryb";
export const RYBHSL = "rybhsl";

export const ryb = (cube?: any) => ({ mode: RYB, cube });
export const rybhsl = (cube?: any) => ({ mode: RYBHSL, cube });

export function extendP5(p5: any) {
  // Add RYB constant to the p5 prototype
  p5.prototype.RYB = RYB;
  p5.prototype.RYBHSL = RYBHSL;
  p5.prototype.ryb = ryb;
  p5.prototype.rybhsl = rybhsl;

  const originalColorMode = p5.prototype.colorMode;
  const originalFill = p5.prototype.fill;
  const originalStroke = p5.prototype.stroke;
  const originalBackground = p5.prototype.background;
  const originalColor = p5.prototype.color;

  // Helper to convert arguments if in RYB mode
  function convertArgs(instance: any, args: any[]) {
    if (instance._rybMode && typeof args[0] === "number") {
      // Default to 255 if maxes not set (should be set by colorMode, but just in case)
      const maxes = instance._rybMaxes || [255, 255, 255, 255];
      let v1, v2, v3, a;

      if (args.length === 1) {
        // Grayscale: r, g, b are all the same
        v1 = args[0] / maxes[0];
        v2 = args[0] / maxes[0];
        v3 = args[0] / maxes[0];
      } else if (args.length === 2) {
        // Grayscale + Alpha
        v1 = args[0] / maxes[0];
        v2 = args[0] / maxes[0];
        v3 = args[0] / maxes[0];
        a = args[1];
      } else if (args.length >= 3) {
        v1 = args[0] / maxes[0];
        v2 = args[1] / maxes[1];
        v3 = args[2] / maxes[2];
        a = args[3];
      } else {
        return args;
      }

      let rgb;
      const options = instance._rybCube ? { cube: instance._rybCube } : { cube: RYB_ITTEN };

      if (instance._rybMode === RYBHSL) {
        rgb = rybHsl2rgb([v1 * 360, v2, v3], options);
      } else {
        rgb = ryb2rgb([v1, v2, v3], options);
      }

      // Use RGB directly (0-1)
      const newArgs = [rgb[0], rgb[1], rgb[2]];

      if (a !== undefined) {
        const maxA = maxes[3] !== undefined ? maxes[3] : maxes[0];
        newArgs.push(a / maxA);
      }
      return newArgs;
    }
    return args;
  }

  p5.prototype.colorMode = function (mode: any, ...args: any[]) {
    let actualMode = mode;
    let cube = undefined;

    if (typeof mode === "object" && mode !== null && mode.mode) {
      actualMode = mode.mode;
      cube = mode.cube;
    }

    if (actualMode === RYB || actualMode === RYBHSL) {
      this._rybMode = actualMode;
      this._rybCube = cube;

      // Handle max values
      // p5 colorMode(MODE, max) -> all max = max
      // p5 colorMode(MODE, max1, max2, max3, [maxA])
      if (args.length === 0) {
        this._rybMaxes = [255, 255, 255, 255]; // Default to 255 to match p5 RGB default
        if (actualMode === RYBHSL) {
          // If no args, maybe default to 360, 100, 100 like p5 HSL?
          // But to keep it simple and consistent with previous RYB implementation (which defaulted to 1),
          // let's default to 360, 1, 1 for HSL if we want to be nice, or just 1, 1, 1.
          // If we default to 1, 1, 1:
          // H input 0.5 -> 0.5 degrees. That's not useful.
          // So for HSL, default maxes should probably be [360, 100, 100, 1].
          this._rybMaxes = [360, 100, 100, 1];
        }
      } else if (args.length === 1) {
        this._rybMaxes = [args[0], args[0], args[0], args[0]];
      } else {
        this._rybMaxes = [
          args[0],
          args[1],
          args[2],
          args[3] !== undefined ? args[3] : args[0], // Alpha defaults to max1 if not provided? Or usually maxA.
        ];
      }

      // We set the underlying mode to RGB so p5 internals are happy
      // We set the range to 1 so our converted values work consistently
      return originalColorMode.apply(this, ["rgb", 1]);
    } else {
      this._rybMode = false;
      delete this._rybMaxes;
      delete this._rybCube;
      return originalColorMode.apply(this, [mode, ...args]);
    }
  };

  const wrap = (fn: (...args: any[]) => any) => {
    return function (this: any, ...args: any[]) {
      if (this._rybMode) {
        const newArgs = convertArgs(this, args);
        // Temporarily disable RYB mode to prevent double conversion
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
  };

  p5.prototype.fill = wrap(originalFill);
  p5.prototype.stroke = wrap(originalStroke);
  p5.prototype.background = wrap(originalBackground);
  p5.prototype.color = wrap(originalColor);
}
