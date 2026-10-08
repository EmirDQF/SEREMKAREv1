#!/usr/bin/env node
/**
 * Rastrea el sitio servido (npm run start) desde "/" y falla si algún enlace interno,
 * imagen local o recurso de /_next responde distinto de 200.
 * Uso: node scripts/check-links.mjs [http://localhost:3000]
 */
const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const MAX_PAGES = 400;
const ATTR_RE = /\s(?:href|src)="([^"#]+)(?:#[^"]*)?"/g;
const SRCSET_RE = /\ssrcset="([^"]+)"/g;

function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

function toInternal(raw) {
  const value = decodeHtml(raw.trim());
  if (!value || /^(mailto:|tel:|https?:|data:|javascript:|blob:)/i.test(value)) return null;
  if (!value.startsWith("/")) return null;
  return value;
}

function extract(html) {
  const found = new Set();
  for (const match of html.matchAll(ATTR_RE)) {
    const url = toInternal(match[1]);
    if (url) found.add(url);
  }
  for (const match of html.matchAll(SRCSET_RE)) {
    for (const part of match[1].split(",")) {
      const url = toInternal(part.trim().split(/\s+/)[0] ?? "");
      if (url) found.add(url);
    }
  }
  return found;
}

const isPage = (url) => !url.startsWith("/_next/") && !/\.[a-z0-9]{2,5}(\?|$)/i.test(url.split("?")[0]);

async function main() {
  const queue = ["/"];
  const seen = new Set(queue);
  const broken = [];
  let pages = 0;

  while (queue.length > 0 && pages < MAX_PAGES) {
    const url = queue.shift();
    const response = await fetch(`${BASE}${url}`, { redirect: "follow" }).catch(() => ({ status: 0 }));
    if (response.status !== 200) {
      broken.push(`${response.status} ${url}`);
      continue;
    }
    if (!isPage(url)) continue;
    pages += 1;
    const html = await response.text();
    for (const link of extract(html)) {
      if (seen.has(link)) continue;
      seen.add(link);
      queue.push(link);
    }
  }

  process.stdout.write(`Páginas rastreadas: ${pages} · URLs revisadas: ${seen.size}\n`);
  if (broken.length > 0) {
    process.stdout.write(`Rotos (${broken.length}):\n${broken.join("\n")}\n`);
    process.exit(1);
  }
  process.stdout.write("0 enlaces rotos.\n");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
