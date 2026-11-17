// Library build of the Shadeline viewer for the theme (no app shell).
//   npm run theme:viewer
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const ENGINE_ASSETS = 'const ASSETS = "/pergola-configurators/v2/";';

export default defineConfig({
  logLevel: "warn",
  plugins: [
    {
      // Let the theme point the engine at its own asset folder.
      name: "pergola-asset-base",
      transform(code, id) {
        if (!id.endsWith("pergola/viewer/engine.js")) return null;
        if (!code.includes(ENGINE_ASSETS)) throw new Error("engine.js asset constant changed; update vite.viewer.config.js");
        return code.replace(ENGINE_ASSETS, 'const ASSETS = (typeof window !== "undefined" && window.CFG_PERGOLA_ASSETS) || "/pergola-configurators/v2/";');
      },
    },
  ],
  build: {
    outDir: here("./theme/assets"),
    emptyOutDir: false,
    minify: true,
    lib: { entry: here("./src/shadeline-viewer.js"), formats: ["es"], fileName: () => "shadeline-viewer.js" },
    rollupOptions: { external: (id) => id === "three" },
  },
});
