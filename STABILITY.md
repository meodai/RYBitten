# Stability

Starting with v1.0.0, RYBitten follows [Semantic Versioning 2.0.0](https://semver.org/). This document defines what "the API" means for the purposes of semver.

## Covered by the contract

Breaking changes to any of the following will bump the major version.

### From `rybitten` (main entry)

- `ryb2rgb(coords, options?)`
- `rybHsl2rgb(hsl, options?)`
- `hslToRgb(hsl)`
- `lerp(a, b, t)`
- `blerp(a00, a01, a10, a11, tx, ty)`
- `trilerp(...)`
- `easingSmoothstep(t)`

### From `rybitten/cubes`

- The `cubes` readonly Map — presence of keys will not be removed in a minor release; new keys may be added.
- The `RYB_ITTEN` export.
- Types: `ColorCoords`, `ColorCube`, `CubesMap`.

### From the p5 UMD bundle

- The `RYB` and `RYBHSL` string constants.
- The `ryb(cube?)` and `rybhsl(cube?)` factories.
- `extendP5(p5)`.
- The wrapped behaviour of `colorMode`, `fill`, `stroke`, `background`, `color` under an active RYB mode.

## Not covered

These may change in any release without a major bump:

- **Numeric output of any individual cube.** Cube values may be refined for historical accuracy or perceptual fidelity. Code depending on exact output should pin a specific version.
- **Exact bytes of any build artifact** (including bundle size, minified output, source maps).
- **Internal p5 instance fields** (`_rybMode`, `_rybMaxes`, `_rybCube`, `_rybExtended`).
- **The HTML/CSS/JS of the GitHub Pages demo.**

## Deprecation policy

Deprecations are announced in a minor release with a console warning or TSDoc `@deprecated` tag, and removed no earlier than the next major.

## Node support

RYBitten requires Node >= 22. Lowering this floor is a non-breaking change; raising it is a breaking change.
