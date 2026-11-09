// Builds a static, server-free copy of the site into ./out for sharing as a preview.
// Server-only routes (contact API, robots, sitemap, OG image) are set aside during
// the build and always put back afterwards.
import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const app = "src/app";
const serverOnly = ["api", "robots.ts", "sitemap.ts", "opengraph-image.tsx"];
const hold = mkdtempSync(join(tmpdir(), "preview-hold-"));
const moved = [];
try {
  for (const f of serverOnly) {
    if (existsSync(join(app, f))) {
      renameSync(join(app, f), join(hold, f));
      moved.push(f);
    }
  }
  execSync("next build", { stdio: "inherit", env: { ...process.env, STATIC_PREVIEW: "1" } });
} finally {
  for (const f of moved) renameSync(join(hold, f), join(app, f));
}

// The preview host reserves names that start with "_", so move Next's asset
// folder to next-assets/ and point every reference at it.
const out = "out";
renameSync(join(out, "_next"), join(out, "next-assets"));
for (const f of readdirSync(out)) {
  if (f.startsWith("_") || f.startsWith("__next") || f.endsWith(".txt")) rmSync(join(out, f), { recursive: true, force: true });
}
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
for (const file of walk(out).filter((f) => /\.(js|css|html)$/.test(f))) {
  let text = readFileSync(file, "utf8");
  const next = text.replaceAll("_next/static", "next-assets/static").replaceAll('"./_next/"', '"./next-assets/"')
    // The host rejects literal U+FFFD; inside JS strings the escape is equivalent.
    .replaceAll("\uFFFD", "\\uFFFD");
  text = file === join(out, "index.html") ? next.replace(/<title>[^<]*<\/title>/, "<title>Ritesh Jena Portfolio</title>") : next;
  writeFileSync(file, text);
}
console.log("Preview ready in ./out");
