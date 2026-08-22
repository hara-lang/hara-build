import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(new URL("../.github/workflows/pages-specs.yml", import.meta.url), "utf8");
const fallback = await readFile(new URL("../.github/workflows/pages-fallback.yml", import.meta.url), "utf8");
const projectContract = await readFile(new URL("../.github/workflows/project-manifest-contract.yml", import.meta.url), "utf8");
const netlify = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");

test("builds the Astro service before deploying Netlify output", () => {
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /npm install/);
  assert.match(workflow, /npm run build/);
  assert.equal((workflow.match(/--dir dist/g) ?? []).length, 2);
  assert.doesNotMatch(workflow, /--dir \.(?:\s|$)/);
});

test("deploys testing and production from their intended branches", () => {
  assert.match(workflow, /branches: \[main, testing\]/);
  assert.match(workflow, /github\.ref_name == 'testing'[\s\S]*NETLIFY_TESTING_SITE_ID/);
  assert.match(workflow, /github\.ref_name == 'main'[\s\S]*NETLIFY_PRODUCTION_SITE_ID/);
  assert.doesNotMatch(workflow, /github\.ref_name == 'production'/);
});

test("reconciles Build domains and preserves the former Specs host as a redirect alias", () => {
  const deployIndex = workflow.indexOf("Deploy main to build.hara-lang.org");
  const domainIndex = workflow.indexOf("Reconcile production Build domain");

  assert.ok(deployIndex >= 0);
  assert.ok(domainIndex > deployIndex);
  assert.match(workflow, /Reconcile testing Build domain/);
  assert.match(workflow, /reconcile-netlify-domain\.sh/);
  assert.match(workflow, /NETLIFY_LEGACY_DOMAIN: specs\.testing\.hara-lang\.org/);
  assert.match(workflow, /NETLIFY_LEGACY_DOMAIN: specs\.hara-lang\.org/);
  assert.doesNotMatch(workflow, /continue-on-error: true/);
  assert.doesNotMatch(workflow, /specs\.hara-long\.org/);
  assert.match(netlify, /from = "https:\/\/specs\.hara-lang\.org\/\*"[\s\S]*to = "https:\/\/build\.hara-lang\.org\/:splat"[\s\S]*status = 301/);
  assert.match(netlify, /from = "https:\/\/specs\.testing\.hara-lang\.org\/\*"[\s\S]*to = "https:\/\/build\.testing\.hara-lang\.org\/:splat"[\s\S]*status = 301/);
  assert.doesNotMatch(netlify, /hara-specs"/);
});

test("builds pull-request Pages fallbacks from the proposed merge result", () => {
  assert.match(fallback, /workflow_dispatch:/);
  assert.doesNotMatch(fallback, /pull_request:/);
  assert.doesNotMatch(fallback, /issue_comment:/);
  assert.match(fallback, /const generated = JSON\.parse\(fs\.readFileSync\("src\/generated\/registry\.json"/);
  assert.match(fallback, /const published = JSON\.parse\(fs\.readFileSync\("dist\/registry\/index\.json"/);
  assert.match(fallback, /published\.summary\?\.\[key\] !== generated\.summary\[key\]/);
  assert.match(fallback, /published\.source\.ref !== generated\.source\?\.ref/);
  assert.doesNotMatch(fallback, /(?:specifications|requirements)\s*!==\s*\d+/, "registry growth must not require hard-coded workflow counts");
});

test("guards project authoring sources without scanning generated registry snapshots", () => {
  assert.match(projectContract, /branches: \[main, testing\]/);
  assert.match(projectContract, /src\/generated\//);
  assert.match(projectContract, /public\/registry\//);
  assert.match(projectContract, /deprecated_tokens/);
  assert.match(projectContract, /Reject superseded project authoring contracts/);
});
