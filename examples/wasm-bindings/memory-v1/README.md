# `memory.v1`: exact byte round-trip

`echo.wasm` exports one bounded linear memory plus:

```text
alloc(i32) -> i32
free(i32) -> void
echo_bytes(i32 pointer, i32 length) -> i64 packed(pointer,length)
release_count() -> i32
```

`interface.hal` describes what the raw integer values mean and who owns each allocation. The input is borrowed; the result is caller-owned and is released exactly once after Hara copies it out of module memory.

## Bind and validate

```shell
hara extension inspect echo.wasm \
  --out inspected.hal \
  --namespace example.codec

hara extension bind interface.hal \
  --module echo.wasm \
  --out dist

hara extension check dist
hara extension test dist
```

The generated package selects `memory.v1` and records the canonical plan in `bindings.edn`.

A native package consumer can use the memory binding through the package import route. The browser SDK can install exactly the same contract with `installMemoryWasmBinding(manifest, interfaceSource, bindingsSource, wasmBytes)` and then `require` the installed namespace.

```clojure
(ns sample.memory)

(:import example.codec)

(example.codec/echo (bytes 1 2 3 4))
;; => #bytes[1 2 3 4]
```

The current alpha contract bounds linear memory and copied values, validates all pointer ranges, and rejects `reallocate` until a later ABI revision.
