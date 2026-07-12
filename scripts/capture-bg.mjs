// Renders bg-render/ scene to an MP4 by driving headless Chrome frame-by-frame.
// Usage:
//   node scripts/capture-bg.mjs --palette indigo --out src/assets/automation-indigo.mp4 \
//     [--frames 360] [--fps 30] [--width 1920] [--height 1080] [--workdir <framesDir>]
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);

const palette = args.palette || "indigo";
const frames = Number(args.frames || 360);
const fps = Number(args.fps || 30);
const width = Number(args.width || 1920);
const height = Number(args.height || 1080);
const out = args.out || `src/assets/automation-${palette}.mp4`;
const port = Number(args.port || 5199);
const workdir = args.workdir || path.join(tmpdir(), `configuro-bg-${palette}`);

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) throw new Error("No Chrome/Edge executable found");

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`vite dev server never came up at ${url}`);
}

const vite = spawn("npx", ["vite", "--port", String(port), "--strictPort"], {
  cwd: process.cwd(),
  shell: true,
  stdio: "ignore",
});

let browser;
try {
  const seed = args.seed ? `&seed=${args.seed}` : "";
  const pageUrl = `http://localhost:${port}/bg-render/?palette=${palette}&headless=1${seed}`;
  await waitForServer(`http://localhost:${port}/bg-render/`);

  browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      `--window-size=${width},${height}`,
      "--hide-scrollbars",
      "--enable-gpu",
      "--use-angle=d3d11",
      "--enable-unsafe-swiftshader",
    ],
    defaultViewport: { width, height, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForFunction("window.__ready === true", { timeout: 30000 });

  rmSync(workdir, { recursive: true, force: true });
  mkdirSync(workdir, { recursive: true });

  const started = Date.now();
  for (let i = 0; i < frames; i += 1) {
    const dataUrl = await page.evaluate(
      (f, total) => window.__seek(f, total),
      i,
      frames
    );
    writeFileSync(
      path.join(workdir, `f${String(i).padStart(5, "0")}.png`),
      Buffer.from(dataUrl.slice("data:image/png;base64,".length), "base64")
    );
    if (i % 60 === 0) {
      console.log(`frame ${i}/${frames} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
    }
  }
  console.log(`captured ${frames} frames in ${((Date.now() - started) / 1000).toFixed(0)}s`);
} finally {
  // browser.close() can throw EPERM on Windows while deleting its temp
  // profile; the capture is already on disk at that point.
  try {
    if (browser) await browser.close();
  } catch {
    /* non-fatal */
  }
  vite.kill();
  // vite spawned through a shell on Windows: make sure the child dies too
  if (process.platform === "win32" && vite.pid) {
    spawnSync("taskkill", ["/pid", String(vite.pid), "/T", "/F"], { stdio: "ignore" });
  }
}

// All-intra (-g 1, no B-frames): every frame is a keyframe, so a scroll-driven
// currentTime seek decodes exactly one frame. Costs bitrate, buys smoothness.
const encode = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-framerate", String(fps),
    "-i", path.join(workdir, "f%05d.png"),
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "26",
    "-g", "1",
    "-bf", "0",
    "-tune", "fastdecode",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    out,
  ],
  { stdio: ["ignore", "inherit", "inherit"] }
);
if (encode.status !== 0) throw new Error(`ffmpeg exited with ${encode.status}`);
console.log(`wrote ${out} (${(statSync(out).size / 1024 / 1024).toFixed(1)} MB)`);
