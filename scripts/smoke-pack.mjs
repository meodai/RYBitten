#!/usr/bin/env node
// Pack the library, install the tarball into a scratch directory, and verify
// the three documented entry points work. Run from repo root.

import { execSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const repo = process.cwd();
const scratch = mkdtempSync(join(tmpdir(), "rybitten-smoke-"));

function run(cmd, cwd = repo) {
  console.log(`> ${cmd}  (cwd=${cwd})`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

try {
  // 1. Ensure a fresh build before packing.
  run("npm run build");

  // 2. Pack.
  run("npm pack --pack-destination=.");

  const tarball = readdirSync(repo).find(
    (f) => f.startsWith("rybitten-") && f.endsWith(".tgz"),
  );
  if (!tarball) throw new Error("tarball not produced by npm pack");
  const tarballAbs = resolve(repo, tarball);

  // 3. Set up scratch project.
  writeFileSync(
    join(scratch, "package.json"),
    JSON.stringify({ name: "smoke", version: "1.0.0", type: "module" }, null, 2),
  );
  run(`npm install "${tarballAbs}" --no-save --no-audit --no-fund`, scratch);

  // 4. ESM import of the main entry.
  writeFileSync(
    join(scratch, "main-check.mjs"),
    `
import { ryb2rgb } from "rybitten";
const out = ryb2rgb([0, 0, 0]);
if (!Array.isArray(out) || out.length !== 3) {
  throw new Error("main-entry ryb2rgb returned unexpected shape: " + JSON.stringify(out));
}
console.log("main-entry OK:", out);
`,
  );
  run("node main-check.mjs", scratch);

  // 5. ESM import of the cubes subpath.
  writeFileSync(
    join(scratch, "cubes-check.mjs"),
    `
import { cubes, RYB_ITTEN } from "rybitten/cubes";
if (!(cubes instanceof Map) || cubes.size === 0) {
  throw new Error("cubes subpath: cubes is not a non-empty Map");
}
if (!Array.isArray(RYB_ITTEN) || RYB_ITTEN.length !== 8) {
  throw new Error("cubes subpath: RYB_ITTEN shape unexpected");
}
console.log("cubes subpath OK: " + cubes.size + " cubes");
`,
  );
  run("node cubes-check.mjs", scratch);

  // 6. UMD smoke test — load the UMD file directly from node_modules.
  // We intentionally do NOT go through Node's package-exports resolution
  // because dist/ internals are not (and should not be) part of the public
  // exports map. The UMD is shipped via the `files` array in package.json,
  // so reading it straight from the scratch install is the correct check.
  writeFileSync(
    join(scratch, "umd-check.mjs"),
    `
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const umdPath = resolve(here, "node_modules/rybitten/dist/rybitten.umd.js");
const code = readFileSync(umdPath, "utf8");
const globalTarget = {};
const factory = new Function("self", "window", "globalThis", code + "; return (self || window || globalThis);");
factory.call(globalTarget, globalTarget, globalTarget, globalTarget);
if (typeof globalTarget.rybitten?.ryb2rgb !== "function") {
  throw new Error("UMD global rybitten.ryb2rgb not found. Keys: " + Object.keys(globalTarget.rybitten ?? {}));
}
console.log("UMD OK");
`,
  );
  run("node umd-check.mjs", scratch);

  console.log("\nSmoke test passed.");
} finally {
  rmSync(scratch, { recursive: true, force: true });
  // Clean up the tarball we created at repo root.
  for (const f of readdirSync(repo)) {
    if (f.startsWith("rybitten-") && f.endsWith(".tgz")) {
      rmSync(resolve(repo, f), { force: true });
    }
  }
}
