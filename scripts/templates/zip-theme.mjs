// Packages shopify/theme as an uploadable zip (Online Store → Themes → Add
// theme → Upload zip file). Uses Python's zipfile so it needs no npm deps.
//   npm run theme:zip   → dist/configuro-concepts-theme.zip
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = join(root, "dist", "configuro-concepts-theme.zip");
mkdirSync(dirname(out), { recursive: true });
const py = `
import os, sys, zipfile
src, out = sys.argv[1], sys.argv[2]
dirs = ["assets", "config", "layout", "locales", "sections", "snippets", "templates"]
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for d in dirs:
        for base, _, files in os.walk(os.path.join(src, d)):
            for f in sorted(files):
                p = os.path.join(base, f)
                z.write(p, os.path.relpath(p, src))
print(out, round(os.path.getsize(out) / 1024), "KB")
`;
console.log(execFileSync("python3", ["-c", py, join(root, "shopify", "theme"), out]).toString().trim());
