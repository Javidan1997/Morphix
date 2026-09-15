// Local static server that mimics how GitHub Pages serves `dist/`, so routes,
// redirects and 404s can be verified before deploying:
//   /foo        -> dist/foo.html (200) when that file exists
//   /dir        -> 301 to /dir/ when dist/dir/ exists
//   /dir/       -> dist/dir/index.html
//   anything else -> dist/404.html with status 404
// Text responses are gzipped like the production CDN.
//
// Usage: node scripts/serve-pages.mjs [port]   (default 4173)

import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

// DIST_DIR serves another build (e.g. a saved baseline) for comparisons.
const dist = process.env.DIST_DIR ? normalize(process.env.DIST_DIR) : fileURLToPath(new URL("../dist", import.meta.url));
const port = Number(process.argv[2]) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".glb": "model/gltf-binary",
  ".hdr": "application/octet-stream",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".xml", ".txt", ".svg", ".hdr"]);

const isFile = (path) => existsSync(path) && statSync(path).isFile();
const isDir = (path) => existsSync(path) && statSync(path).isDirectory();

function send(req, res, file, status = 200) {
  // dist/ can be mid-rebuild; answer plainly instead of crashing the server.
  if (!isFile(file)) {
    res.writeHead(503, { "Content-Type": "text/plain" });
    return res.end("dist is rebuilding");
  }
  const ext = extname(file);
  const headers = { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "max-age=600" };
  const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  if (gzip) headers["Content-Encoding"] = "gzip";
  else headers["Content-Length"] = statSync(file).size;
  res.writeHead(status, headers);
  if (req.method === "HEAD") return res.end();
  const stream = createReadStream(file);
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const target = normalize(join(dist, pathname));
  if (!target.startsWith(dist)) return send(req, res, join(dist, "404.html"), 404);

  if (pathname.endsWith("/")) {
    const index = join(target, "index.html");
    if (isFile(index)) return send(req, res, index);
  } else if (isFile(target)) {
    return send(req, res, target);
  } else if (isDir(target)) {
    res.writeHead(301, { Location: `${pathname}/${url.search}` });
    return res.end();
  } else if (isFile(`${target}.html`)) {
    return send(req, res, `${target}.html`);
  }
  return send(req, res, join(dist, "404.html"), 404);
}).listen(port, () => console.log(`Serving dist/ like GitHub Pages at http://localhost:${port}`));
