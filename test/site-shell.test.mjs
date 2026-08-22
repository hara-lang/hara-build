import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../src/layouts/AppLayout.astro", import.meta.url), "utf8");
const adoption = await readFile(new URL("../src/styles/v2-adoption.css", import.meta.url), "utf8");
const config = await readFile(new URL("../astro.config.mjs", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const acceptedRevision = "a2ab66d0fde79edb1cee46b79528098b3fda68cf";

test("uses the canonical Build domain", () => {
  assert.match(config, /https:\/\/build\.hara-lang\.org/);
  assert.doesNotMatch(config, /hara-lang\.io/);
  assert.match(readme, /build\.hara-lang\.org/);
  assert.doesNotMatch(readme, /specs\.hara-lang\.io/);
});

test("publishes a dedicated maximum-resolution specifications card", () => {
  assert.match(layout, /og-hara-build\.jpg/);
  assert.match(layout, /og:image:width" content="3840"/);
  assert.match(layout, /og:image:height" content="2016"/);
});

test("pins and consumes the accepted shared v2 shell contract", () => {
  assert.equal(
    packageJson.dependencies["@hara-lang/visual-language"],
    `github:hara-lang/visual-language#${acceptedRevision}`
  );
  for (const component of ["Shell", "Header", "ContextNav"]) {
    assert.match(layout, new RegExp(`import ${component} from "@hara-lang/visual-language/astro/v2/${component}\\.astro"`));
    assert.match(layout, new RegExp(`<${component}`));
  }
  assert.match(layout, /@hara-lang\/visual-language\/v2\.css/);
  assert.match(layout, /body class="hara-v2 build-product"/);
  assert.match(layout, /<Shell sidebar=\{false\} aside=\{false\} mainId="content" class="build-v2-shell">/);
});

test("keeps ecosystem and workflow destinations distinct and ordered", () => {
  assert.match(layout, /Play[\s\S]*Learn[\s\S]*Build/);
  assert.match(layout, /https:\/\/learn\.hara-lang\.org\//);
  assert.match(layout, /Overview[\s\S]*Registry[\s\S]*Check[\s\S]*Publish[\s\S]*API/);
  assert.match(layout, /href: "\/developers"/);
  assert.match(layout, /label="Build workflow navigation"/);
  assert.doesNotMatch(layout, />Source<\/a>/);
});

test("preserves central identity and delegates theme state to the shared toggle", () => {
  assert.match(layout, /data-hara-identity/);
  assert.match(layout, /https:\/\/id\.hara-lang\.org/);
  assert.match(layout, /https:\/\/id\.testing\.hara-lang\.org/);
  assert.match(layout, /identity-client\.js/);
  assert.match(layout, /<ThemeToggle label="Theme" \/>/);
  assert.doesNotMatch(layout, /const themeIcons|themeOrder|syncThemeIcon/);
  assert.doesNotMatch(layout, /\/auth\/github\?return_to=/);
  assert.doesNotMatch(layout, /fetch\("\/api\/auth\/session"/);
  assert.match(readme, /shared GitHub identity/);
});

test("the product mapping preserves full-width workflows, touch, focus and reduced motion", () => {
  assert.match(adoption, /\.build-v2-shell \.hara-v2-main[\s\S]*padding: 0/);
  assert.match(adoption, /\.hara-v2-main > \.hara-v2-content[\s\S]*width: 100%/);
  assert.match(adoption, /\.hara-v2-context-items a[\s\S]*min-height: 44px/);
  assert.match(adoption, /:focus-visible/);
  assert.match(adoption, /scroll-margin-top/);
  assert.match(adoption, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(adoption, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "Specs may consume but not redefine protected v2 tokens");
});

test("identifies Greenways stewardship and the repository licence", () => {
  assert.match(layout, /A Greenways Open Source Project/);
  assert.match(layout, /opensource\.greenways\.ai\/open-source/);
  assert.match(layout, /hara-build\/blob\/main\/LICENSE">Apache-2\.0/);
});
