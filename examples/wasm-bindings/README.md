# Wasm binding examples

These projects accompany the Hara Build guide at `https://build.hara-lang.org/docs/wasm-bindings/`.

Each sample contains a tiny prebuilt Wasm fixture and the authored `interface.hal` used by `hara extension bind`. The binaries are intentionally small and deterministic so the examples do not require a C, Rust, or JavaScript build step.

- `core-v1/` — direct scalar `i64` addition.
- `memory-v1/` — exact byte round-trip through bounded linear memory.
- `hta-v1/` — the scalar module described as an asynchronous operation so bindgen selects HTA and emits an eligible adapter package.

The public interface schemas are still alpha. If a sample and the implementation disagree, follow `hara-lang/hara/core/spec/` and update the sample in the same change.
