# `hta.v1`: async scalar adapter

This sample reuses the tiny scalar `add.wasm` module from the `core.v1` example, but the semantic interface declares the Hara operation asynchronous:

```text
add(i64, i64) -> i64
```

Because the interface carries HTA lifecycle meaning, bindgen selects `hta.v1` instead of silently exposing a synchronous direct call. For this scalar, import-free shape the current generator can also emit a deterministic `adapter.wasm` plus adapter provenance.

## Bind and validate

```shell
hara extension bind interface.hal \
  --module add.wasm \
  --out dist

hara extension check dist
hara extension test dist
```

Inspect the generated output for:

```text
dist/adapter.wasm
dist/adapter.edn
dist/bindings.edn
dist/package.edn
```

Generated HTA packages are consumed through Hara's `:require` route. HTA is also the route used when an interface needs cancellation, host calls, callbacks, handles, resources, or richer asynchronous lifecycle semantics.

Automatic adapter generation is deliberately conservative. More complex HTA interfaces may require an existing HTA-shaped module/provider rather than this scalar adapter path.
