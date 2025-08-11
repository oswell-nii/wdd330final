import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { defineConfig } from "vite";

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        country: resolve(__dirname, "src/country.html"),
        favorites: resolve(__dirname, "src/favorites.html"), // if exists
      },
    },
  },
});
