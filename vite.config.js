import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createReadStream, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { serveVideo } from "./scripts/templates/serve-video.mjs";

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

// /shopify-templates/<slug> demos are static pages rendered from the Shopify theme
// (scripts/templates/build-demos.mjs). In dev, render them on request and serve
// theme assets live, so edits to shopify/theme show on reload.
const TEMPLATE_SLUGS = /^\/shopify-templates\/(shadeline|vela|northgate|linkcore|aurel|forma|edito)\/?$/;
const ASSET_TYPES = { ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".mp4": "video/mp4" };
function templateDemoRoutes() {
  return {
    name: "template-demo-routes",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const [path] = req.url.split("?");
        const asset = path.match(/^\/shopify-templates\/assets\/([\w.-]+)$/);
        if (asset) {
          const file = join(process.cwd(), "shopify", "theme", "assets", asset[1]);
          if (!existsSync(file)) return next();
          if (extname(file) === '.mp4') return serveVideo(req, res, file);
          res.setHeader("Content-Type", ASSET_TYPES[extname(file)] || "application/octet-stream");
          return createReadStream(file).pipe(res);
        }
        const demo = path.match(TEMPLATE_SLUGS);
        if (!demo) return next();
        try {
          const builder = pathToFileURL(join(process.cwd(), "scripts", "templates", "build-demos.mjs")).href;
          const { renderDemo } = await import(`${builder}?t=${Date.now()}`);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(await renderDemo(demo[1]));
        } catch (error) {
          res.statusCode = 500;
          res.end(`<pre>${String(error.stack || error).replace(/</g, "&lt;")}</pre>`);
        }
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), pergolaDevRoutes(), templateDemoRoutes()],
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
