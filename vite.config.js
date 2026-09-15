import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The pergola landing page is a separate, lightweight HTML entry so a direct
// visit loads only its own code, not the whole site bundle.
const PERGOLA_PATH = "/pergola-configurator";

function pergolaDevRoutes() {
  return {
    name: "pergola-dev-routes",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [path, query = ""] = req.url.split("?");
        if (path === "/pergola-configurators" || path === "/pergola-configurators/") {
          res.statusCode = 301;
          res.setHeader("Location", `${PERGOLA_PATH}${query ? `?${query}` : ""}`);
          return res.end();
        }
        if (path === PERGOLA_PATH) req.url = `/pergola.html${query ? `?${query}` : ""}`;
        next();
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), pergolaDevRoutes()],
  assetsInclude: ["**/*.glb"],
  build: isSsrBuild
    ? { outDir: "dist-ssr", emptyOutDir: true }
    : {
        chunkSizeWarningLimit: 650,
        rollupOptions: {
          input: { main: "index.html", pergola: "pergola.html" },
          output: {
            manualChunks(id) {
              if (/node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return "react";
              // Core only; add-ons (loaders, controls) stay with their importer.
              if (/node_modules[\/]three[\/]build[\/]/.test(id)) return "three";
              return undefined;
            },
          },
        },
      },
}));
