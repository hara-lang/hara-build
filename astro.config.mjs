import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://build.hara-lang.org",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "directory"
  }
});
