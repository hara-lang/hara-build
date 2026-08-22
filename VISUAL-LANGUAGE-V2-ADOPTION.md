# Hara Build — Visual Language v2 adoption

## Accepted source

This adoption pins `hara-lang/visual-language` at merged revision:

```text
a2ab66d0fde79edb1cee46b79528098b3fda68cf
```

The revision includes the shared v2 document shell, review grammar, first matrix fixes and accessible evidence/data-visualisation contract.

## This first adoption slice

- replaces the hand-authored global header and workflow navigation markup with the exported `Shell`, `Header`, and `ContextNav` components;
- keeps the shared block-H mark and direct ThemeToggle;
- retains the current Overview, Registry, Check, Publish and API destinations;
- preserves the full-width product compositions inside the shared shell;
- maps compact workflow targets, focus, fragment offsets, reduced motion and flatter control surfaces onto v2 tokens;
- pins the dependency to one accepted merged revision.

## Preserved product behavior

This visual adoption does not change:

- registry source, generated index or registry JSON routes;
- checker inputs, validation outcomes or receipts;
- publish form behavior or publication authority;
- API routes or Netlify service functions;
- popup identity origin selection or loading;
- canonical, Open Graph or Twitter metadata;
- public URLs, footer links, licence or stewardship language.

## Ownership boundary

Visual Language owns shared tokens, shell geometry, ecosystem navigation, workflow navigation, responsive grammar and state presentation. `hara-build` owns registry data, checker and publisher behavior, API contracts, identity loading, canonical metadata and product-specific workflow composition.

`src/styles/v2-adoption.css` is a narrow product mapping layer. It consumes protected `--hara-v2-*` variables but does not redefine them.

## Remaining issue #37 work

This PR begins but does not close the complete Build adoption. Follow-on slices should:

1. align Registry, Check, Publish and Developer screens with the accepted `/v2/specs/` reference compositions;
2. apply the shared evidence-state and data-visualisation grammar to conformance results without transferring registry or checker authority;
3. remove obsolete shell CSS after all representative routes are visually verified;
4. attach light/dark desktop and mobile screenshots for Registry, Check, Publish and Developer views;
5. keep every downstream change pinned to a merged Visual Language revision.
