/* =========================================================
   CSP check: run with  npm run check
   The Content-Security-Policy only lets inline scripts run if their
   SHA-256 hash is listed. If you edit the small boot script in a page's
   <head>, its hash changes and the browser would silently block it
   (no loader, no image fallbacks). This compares every inline script
   against vercel.json and render.yaml and tells you what to paste.
   ========================================================= */
import fs from "node:fs/promises";
import crypto from "node:crypto";

const root = new URL("../", import.meta.url);
const pages = (await fs.readdir(root)).filter((f) => f.endsWith(".html"));
const vercel = await fs.readFile(new URL("vercel.json", root), "utf8");
const render = await fs.readFile(new URL("render.yaml", root), "utf8");

let problems = 0;
for (const page of pages) {
  const html = await fs.readFile(new URL(page, root), "utf8");
  for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1] || "";
    if (attrs.includes("src=") || attrs.includes("ld+json")) continue; // external files and data blocks don't need a hash
    const hash = "sha256-" + crypto.createHash("sha256").update(m[2]).digest("base64");
    const ok = vercel.includes(hash) && render.includes(hash);
    if (!ok) { problems++; console.log(`✗ ${page}: inline script hash '${hash}' is missing from vercel.json and/or render.yaml`); }
  }
}
if (problems) { console.log("\nReplace the old sha256-... value in both files with the one above."); process.exit(1); }
console.log(`✓ All inline scripts in ${pages.length} pages are allowed by the CSP.`);
