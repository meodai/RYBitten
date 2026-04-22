# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) starting with v1.0.0.

## [1.0.0] - YYYY-MM-DD

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
