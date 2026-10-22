#!/usr/bin/env node
/**
 * SEO por página (build servido): recorre el sitemap y comprueba título y descripción únicos y con
 * largo razonable, canonical al dominio público, un solo <h1>, Open Graph con imagen, lang="es-PE"
 * y JSON-LD válido. Uso: npm run build && npm run start, y luego:
 *   node scripts/check-seo.mjs [http://localhost:3000] [https://sermekare.com]
 */
const [base = "http://localhost:3000", publicOrigin = "https://sermekare.com"] = process.argv.slice(2);
const TITLE_MAX = 70;
const DESCRIPTION_RANGE = [70, 170];

const pick = (html, re) => re.exec(html)?.[1]?.trim() ?? "";
const decode = (text) => text.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const seenTitles = new Map();
const seenDescriptions = new Map();
const problems = [];

for (const path of paths) {
  const html = await (await fetch(`${base}${path}`)).text();
  const title = decode(pick(html, /<title>([^<]*)<\/title>/));
  const description = decode(pick(html, /<meta name="description" content="([^"]*)"/));
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
  const ogImage = pick(html, /<meta property="og:image" content="([^"]*)"/);
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  const lang = pick(html, /<html[^>]*lang="([^"]*)"/);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

  const issues = [];
  if (!title) issues.push("sin <title>");
  if (title.length > TITLE_MAX) issues.push(`título de ${title.length} caracteres`);
  if (description.length < DESCRIPTION_RANGE[0] || description.length > DESCRIPTION_RANGE[1]) issues.push(`descripción de ${description.length} caracteres`);
  if (canonical !== `${publicOrigin}${path === "/" ? "" : path}` && canonical !== `${publicOrigin}${path}`) issues.push(`canonical «${canonical}»`);
  if (!ogImage.startsWith(publicOrigin)) issues.push("og:image sin dominio público");
  if (h1Count !== 1) issues.push(`${h1Count} <h1>`);
  if (lang !== "es-PE") issues.push(`lang="${lang}"`);
  for (const block of jsonLd) {
    try {
      JSON.parse(block);
    } catch {
      issues.push("JSON-LD inválido");
    }
  }
  if (seenTitles.has(title)) issues.push(`título repetido con ${seenTitles.get(title)}`);
  if (seenDescriptions.has(description)) issues.push(`descripción repetida con ${seenDescriptions.get(description)}`);
  seenTitles.set(title, path);
  seenDescriptions.set(description, path);
  if (issues.length > 0) problems.push(`${path}: ${issues.join(" · ")}`);
}

process.stdout.write(`${paths.length} URLs del sitemap revisadas.\n`);
process.stdout.write(problems.length === 0 ? "SEO: sin problemas.\n" : `${problems.join("\n")}\n`);
process.exitCode = problems.length === 0 ? 0 : 1;
