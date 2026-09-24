/* =========================================================
   Blue Ember image optimiser
   Downloads every image the site uses from blueemberja.com and
   saves small WebP copies in /img at three widths:
     320  (tickers, tiles)   640 (cards, fans, phone)   1400 (full-screen viewer)
   Run once:  npm install  then  npm run images
   Safe to re-run: files that already exist are skipped.
   ========================================================= */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const BASE = process.env.SOURCE_BASE || "https://blueemberja.com/wp-content/uploads/2018/04/";
const OUT = path.join(ROOT, "img");
const WIDTHS = [320, 640, 1400];
const QUALITY = 72;

// 1. Find every image filename the site references
const files = new Set();
for (const name of await fs.readdir(ROOT)) {
  if (!/\.(html|js)$/.test(name)) continue;
  const text = await fs.readFile(path.join(ROOT, name), "utf8");
  for (const m of text.matchAll(/uploads\/2018\/04\/([\w.\-]+\.(?:jpe?g|png))/gi)) files.add(m[1]);
  for (const m of text.matchAll(/["']([\w.\-]+\.(?:jpe?g|png))["']/gi)) files.add(m[1]);
}
await fs.mkdir(OUT, { recursive: true });
console.log(`Found ${files.size} images. Optimising...\n`);

// 2. Download with retries (their server can be slow)
async function download(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (i === tries) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

let before = 0, after = 0, done = 0, missing = [];
async function handle(file) {
  const stem = file.replace(/\.[a-z]+$/i, "");
  const targets = WIDTHS.map((w) => ({ w, out: path.join(OUT, `${stem}-${w}.webp`) }));
  const todo = [];
  for (const t of targets) { try { await fs.access(t.out); } catch { todo.push(t); } }
  if (!todo.length) { done++; return; }
  const buf = await download(BASE + file).catch((e) => { console.warn(`  ! ${file}: ${e.message}`); return null; });
  if (!buf) { missing.push(file); return; }
  before += buf.length;
  try {
    for (const t of todo) {
      const info = await sharp(buf, { limitInputPixels: 1e10 }).rotate().resize({ width: t.w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 }).toFile(t.out);
      after += info.size;
    }
  } catch (err) { // an old print scan that is too big for the pipeline: the site falls back to the original
    console.warn(`  ! ${file}: ${err.message}`);
    for (const t of todo) { try { await fs.rm(t.out); } catch {} }
    missing.push(file);
    return;
  }
  done++;
  process.stdout.write(`  ${String(done).padStart(3)} / ${files.size}  ${file}\n`);
}

// 3. Four at a time so we don't hammer their server
const queue = [...files];
await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) await handle(queue.shift()); }));

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(`\nDone. ${done} images ready in /img.`);
if (before) console.log(`Originals: ${kb(before)}  ->  all WebP sizes combined: ${kb(after)}`);
if (missing.length) console.log(`Not found on the server (the site falls back automatically): ${missing.join(", ")}`);
