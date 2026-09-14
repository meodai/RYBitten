# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) starting with v1.0.0.

## [Unreleased]

### Added

- Test suite for the p5 extension (mode switching, argument conversion, alpha scaling, state restoration, and both p5 1.x / 2.x registration paths).

### Changed

- `RYB_ITTEN` moved into its own module (`src/itten.ts`). Importing only `ryb2rgb` from the main entry no longer pulls the full cube catalog into consumer bundles, and the UMD builds shrink from ~13 KB to under 4 KB. `rybitten/cubes` still re-exports `RYB_ITTEN`, so no import paths change.
- Every preset cube (including `RYB_ITTEN`) and every `cubes` entry is now deep-frozen. Mutating a preset in place used to silently change the library default; it now throws in strict mode. Copy a cube before editing it.
- Documented that `ryb2rgb` / `rybHsl2rgb` do not clamp their inputs.
- Cube `reference` fields that pointed at images not present in `references/` are now empty strings (`apple80s`, `apple90s`, `arquitetura-decoracao`, `church`, `colorprinter`, `japschool`, `pixelart`, `rgb`, `ryan`, `ten`). `marvel-news` and `maycock` now point at the images that were already in the folder.

### Fixed

- p5 2.x: loading the p5 UMD no longer throws. p5 2.0 removed `prototype.registerMethod`; the extension now uses `p5.registerAddon` when available and falls back to `registerMethod` on 1.x.
- p5 RYBHSL mode: `fill(gray)` / `fill(gray, alpha)` produced a saturated colour because the gray value was read as a hue. It is now treated as lightness with zero saturation, matching p5's own HSL behaviour.
- README: cube table now lists `church`, `trilobe-synoptique`, `arquitetura-decoracao` and `cmy`; the `hayter` key was misspelled; several reference links pointed at missing files.
- `references/kindergarden1890.jpg` renamed to `kindergarten1890.jpg` to match the key and the README.
- Corrected the CMY cube comment describing which input slot carries M and Y.

## [1.2.0] - 2026-06-10

### Added

- `trilobe-synoptique` cube — Charles Lacouture, _Trilobe Synoptique_ (1890).

## [1.1.0] - 2026-06-07

### Added

- `church` cube — A.H. Church, _An Elementary Manual for Students_ (1887).

## [1.0.0] - 2026-04-22

### Added

- Stable public API contract (see `STABILITY.md`).
- Vitest test suite covering core math, HSL conversion, RYB conversion, and an algorithmic roundtrip for every cube. 151 tests, 95%+ branch coverage on the core modules.
- GitHub Actions CI running lint, type-check, tests, build, and a tarball smoke test on Node 22 and the current LTS.
- `engines.node >= 22` and a `homepage` field in `package.json`.
- `@types/p5` devDependency and tightened types in the p5 extension (removed the file-wide `any` suppression).
- `CHANGELOG.md` and `STABILITY.md`.
- `scripts/smoke-pack.mjs` — packs the library, installs the tarball into a scratch directory, and verifies the main entry, the `/cubes` subpath, and the UMD global all work end-to-end.

### Changed

- Modernized dev tooling: ESLint 9 (flat config), typescript-eslint 8 (single package), TypeScript 5.9, Prettier 3.8, vite-plugin-dts 4.
- README: adds a "What's new in 1.0" section, fixes broken `import type` example for `ColorCoords` / `ColorCube` (they live in `rybitten/cubes`, not the main entry), adds badges and a stability link.

### Removed

- `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` as separate dependencies — bundled into `typescript-eslint` 8.

## [0.31.0] - 2026-04-22

### Added

- `RYB_ARQUITETURA_DECORACAO` color cube definition.

### Fixed

- Missing comma in the `RYB_ARQUITETURA_DECORACAO` cube definition.

## [0.30.0] - 2026-04-22

### Added

- Initial `RYB_ARQUITETURA_DECORACAO` cube work.

## [0.29.0] - 2026-02-23

### Added

- CMY color cube with subtractive primaries.
- Re-introduced "Inverted RGB" color cube.

### Changed

- Simplified `ColorCube` type definition; `CubesMap` made immutable via `ReadonlyMap`.
- Optimized color-channel access in `ryb2rgb` — replaced `.map()` with indexed access in hot paths to reduce GC pressure in animation loops.

## [0.28.0] - 2025-11-23

### Added / Changed

- p5.js integration aligned with the [official p5 library guidelines](https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md).
- Improved type safety in `ryb` and `rybhsl` factory functions (now use `ColorCube`).
- Rainbow p5 demo: multiple rows, larger canvas.

## [0.27.0] - 2025-11-23

### Added

- p5.js extension: native `RYB` and `RYBHSL` color modes, example sketches.

### Fixed

- `hslToRgb`: minor variable-assignment optimization.

## [0.26.0] - 2025-11-23

### Added

- Initial p5.js extension prototype and example.

### Changed

- Refactored p5-extension and p5.html for readability.

## [0.25.0] - 2025-11-22

### Added

- UMD build configuration and browser / p5 usage example in README.

## [0.24.0 and earlier]

Initial releases during library development (2024). The cube catalog was built out across this span — Itten, Munsell, Bezold, Goethe, Runge, Harris, Albers, Lohse, Boutet, Hett, Schiffermüller, Hayter, Bormann, Chevreul, Maycock, ColorPrinter, Japanese-school, Kindergarten, Apple-80s, Apple-90s, Marvel, and others. See git log for detail.
