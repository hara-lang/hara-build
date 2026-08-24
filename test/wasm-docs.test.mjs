import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function text(relative) {
  return readFile(path.join(root, relative), "utf8");
}

async function bytes(relative) {
  return readFile(path.join(root, relative));
}

test("Build docs expose the Wasm binding guide and navigation", async () => {
  const layout = await text("src/layouts/AppLayout.astro");
  const index = await text("src/pages/docs/index.astro");
  const guide = await text("src/pages/docs/wasm-bindings.astro");

  assert.match(layout, /href: "\/docs\/", label: "Docs"/);
  assert.match(index, /href="\/docs\/wasm-bindings\/"/);
  for (const token of [
    "core.v1",
    "memory.v1",
    "hta.v1",
    "hara extension inspect",
    "hara extension bind",
    "hara extension wit-import",
    "installMemoryWasmBinding",
    "adapter.wasm"
  ]) {
    assert.ok(guide.includes(token), `guide should contain ${token}`);
  }
});

test("Wasm binding samples contain valid prebuilt modules and semantic interfaces", async () => {
  const samples = [
    ["examples/wasm-bindings/core-v1/add.wasm", "examples/wasm-bindings/core-v1/interface.hal", ":namespace example.math"],
    ["examples/wasm-bindings/memory-v1/echo.wasm", "examples/wasm-bindings/memory-v1/interface.hal", ":namespace example.codec"],
    ["examples/wasm-bindings/hta-v1/add.wasm", "examples/wasm-bindings/hta-v1/interface.hal", ":namespace example.math.async"]
  ];

  for (const [wasmPath, interfacePath, namespace] of samples) {
    const wasm = await bytes(wasmPath);
    assert.deepEqual([...wasm.subarray(0, 8)], [0, 97, 115, 109, 1, 0, 0, 0]);
    const source = await text(interfacePath);
    assert.match(source, /^\(wasm\/interface/);
    assert.ok(source.includes("hara.wasm-interface/0-alpha"));
    assert.ok(source.includes(namespace));
  }

  assert.ok((await text("examples/wasm-bindings/memory-v1/interface.hal")).includes(":ownership :caller"));
  assert.ok((await text("examples/wasm-bindings/hta-v1/interface.hal")).includes(":async true"));
});
