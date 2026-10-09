#!/usr/bin/env node
/**
 * JS inicial (gzip) por página, separando el runtime de React/Next del código propio.
 * Excluye los scripts `noModule` (polyfills que los navegadores modernos no descargan).
 * Uso: npm run build && npm run start, y luego: node scripts/measure-js.mjs [http://localhost:3000] [/ /consulta-virtual …]
 */
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const [base = "http://localhost:3000", ...paths] = process.argv.slice(2);
const pages = paths.length > 0 ? paths : ["/", "/consulta-virtual", "/teleconsulta", "/tarifas"];
const SCRIPT_RE = /<script([^>]*)src="(\/_next\/static\/chunks\/[^"]+\.js)"([^>]*)>/g;
const FRAMEWORK_RE = /AppRouter|hydrateRoot|__next_f/;
const KB = 1024;

for (const page of pages) {
  const html = await (await fetch(`${base}${page}`)).text();
  let total = 0;
  let framework = 0;
  const seen = new Set();
  for (const [, before, src, after] of html.matchAll(SCRIPT_RE)) {
    if (seen.has(src) || /noModule/i.test(before + after)) continue;
    seen.add(src);
    const code = readFileSync(`.next${src.replace("/_next", "")}`);
    const size = gzipSync(code, { level: 9 }).length;
    total += size;
    if (FRAMEWORK_RE.test(code.toString())) framework += size;
  }
  const html_kb = gzipSync(Buffer.from(html), { level: 9 }).length / KB;
  process.stdout.write(
    `${page.padEnd(20)} JS inicial ${(total / KB).toFixed(0)} KB · React/Next ${(framework / KB).toFixed(0)} KB · propio ${((total - framework) / KB).toFixed(0)} KB · HTML ${html_kb.toFixed(0)} KB (gzip)\n`,
  );
}
