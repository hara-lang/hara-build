# Hara compiler stack example

This example is ordinary Hara source. It is intentionally not tied to an invented compiler CLI command.

The current compiler facade lives in `hara-lang/hara/core/rust/compiler/src/lib.rs` and exposes two explicit products:

```text
source.hal
   |
   v
validated Program
   |
   v
HbcModule / hbc0
   |
   +-- execute in the Hara VM
   |
   `-- WholeWasm / hnw0/2
```

The source program uses literals, `defn`, `loop`/`recur`, `if`, arithmetic and a direct call, all of which are lowered by the current bytecode compiler.

Conceptually, a host using the Rust compiler API performs:

```rust
use hara_compiler::{compile, CompileTarget};

let source = std::fs::read_to_string("source.hal")?;

let hbc = compile(&source, CompileTarget::HbcModule)?;
assert_eq!(hbc.manifest().abi_version, "hbc0");

let whole = compile(&source, CompileTarget::WholeWasm)?;
assert_eq!(whole.manifest().abi_version, "hnw0/2");
```

`WholeWasm` is not compiled through a second Hara-language frontend. The compiler first produces the canonical HBC program, then the whole-Wasm target packages that program. The compiled-product manifest records the source digest and HBC module digest so the relationship is verifiable.

See the public guide at `/docs/compiler-stack/` and the implementation in `hara-lang/hara` for the exact API and artifact schemas.
