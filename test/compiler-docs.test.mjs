import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function text(relative) {
  return readFile(path.join(root, relative), "utf8");
}

test("Build docs expose the current Hara compiler stack", async () => {
  const index = await text("src/pages/docs/index.astro");
  const guide = await text("src/pages/docs/compiler-stack.astro");

  assert.match(index, /href="\/docs\/compiler-stack\/"/);

  for (const token of [
    "HbcModule",
    "WholeWasm",
    "hbc0",
    "hnw0/2",
    "compile_source",
    "compile_source_with",
    "compile_source_with_config",
    "compile_halc_module",
    "SpannedForm",
    "validated Program",
    "tree-evaluator fallback",
    "Foreign-Wasm bindgen"
  ]) {
    assert.ok(guide.includes(token), `compiler guide should contain ${token}`);
  }

  assert.ok(guide.indexOf("HBC hbc0") < guide.indexOf("Whole Wasm hnw0/2"));
  assert.match(guide, /\/docs\/wasm-bindings\//);
});

test("compiler example remains ordinary Hara source with both product identities documented", async () => {
  const source = await text("examples/compiler-stack/source.hal");
  const readme = await text("examples/compiler-stack/README.md");

  assert.match(source, /^\(ns example\.compiler-stack\)/);
  assert.match(source, /\(defn triangular/);
  assert.match(source, /\(loop /);
  assert.match(source, /\(recur /);

  assert.ok(readme.includes("CompileTarget::HbcModule"));
  assert.ok(readme.includes("CompileTarget::WholeWasm"));
  assert.ok(readme.includes("hbc0"));
  assert.ok(readme.includes("hnw0/2"));
  assert.ok(readme.includes("not tied to an invented compiler CLI command"));
});
