import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import mkcert from "vite-plugin-mkcert"
import framer from "vite-plugin-framer"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

// Framer loads development plugins over HTTPS, so vite-plugin-mkcert issues a
// local certificate. By default it asks the GitHub API where to download mkcert
// from, which fails with "403 rate limit exceeded" on shared or busy networks
// and takes the whole dev server down with it.
//
// If ./.tools/mkcert.exe is present we use it directly and never touch the API.
// Get it once with:
//   npm run mkcert:fetch
const localMkcert = fileURLToPath(new URL("./.tools/mkcert.exe", import.meta.url))

export default defineConfig({
    plugins: [
        react(),
        mkcert(existsSync(localMkcert) ? { mkcertPath: localMkcert } : {}),
        framer(),
    ],
})
