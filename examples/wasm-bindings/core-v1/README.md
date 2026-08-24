# `core.v1`: direct scalar addition

This is the smallest Hara Wasm binding. `add.wasm` is import-free and exports:

```text
add(i64, i64) -> i64
```

The `.hal` interface only adds Hara-visible names and semantic scalar types; no memory lowering is required.

## Inspect the module

```shell
hara extension inspect add.wasm \
  --out inspected.hal \
  --namespace example.math
```

The generated skeleton intentionally leaves Hara types unresolved. `interface.hal` is the completed semantic contract for this sample.

## Bind and validate

```shell
hara extension bind interface.hal \
  --module add.wasm \
  --out dist

hara extension check dist
hara extension test dist
```

The generated package selects `core.v1`. Native package consumers use the direct Wasm import route; no library-specific JavaScript, Rust, Java, or C wrapper is generated.

A Hara consumer can import the installed package namespace and call the public export:

```clojure
(ns sample.core)

(:import example.math)

(example.math/add 19 23)
;; => 42
```
