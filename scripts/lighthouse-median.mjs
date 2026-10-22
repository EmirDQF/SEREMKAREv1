#!/usr/bin/env node
/**
 * Lighthouse móvil, N corridas por página y mediana de cada métrica (la puntuación de esta máquina
 * oscila ±10 puntos entre corridas). Requiere el build de producción servido (npm run build && npm run start).
 *
 * Uso: node scripts/lighthouse-median.mjs [--runs=5] [--throttling=simulate|devtools] [--base=http://localhost:3100] [/ /servicios …]
 * Salida: tabla en consola y JSON en .lighthouse/<throttling>-<fecha>.json (carpeta ignorada por git).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_PAGES = ["/", "/servicios", "/densitometria-osea", "/consulta-virtual"];
const OUT_DIR = ".lighthouse";

const flags = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => arg.slice(2).split("=")),
);
const pages = process.argv.slice(2).filter((arg) => arg.startsWith("/"));
const runs = Number(flags.runs ?? 5);
const throttling = flags.throttling ?? "simulate";
const base = flags.base ?? "http://localhost:3100";

const median = (values) => {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

/** Selector del elemento LCP: el nombre del audit cambió entre versiones de Lighthouse (busca el primer nodo). */
function findLcpSelector(report) {
  const ids = Object.keys(report.audits).filter((id) => id.includes("largest-contentful-paint") || id.includes("lcp"));
  for (const id of ids) {
    const match = JSON.stringify(report.audits[id].details ?? {}).match(/"selector":"([^"]+)"/);
    if (match) return match[1];
  }
  return "—";
}

function runOnce(url, file) {
  const args = [
    "--no-install",
    "lighthouse",
    url,
    "--quiet",
    "--output=json",
    `--output-path=${file}`,
    `--throttling-method=${throttling}`,
    // Con shell (Windows) los argumentos se unen con espacios: las comillas mantienen juntos los flags de Chrome.
    `--chrome-flags="--headless=new --no-first-run"`,
  ];
  execFileSync("npx", args, { stdio: "ignore", shell: process.platform === "win32" });
  const report = JSON.parse(readFileSync(file, "utf8"));
  rmSync(file);
  const audit = (id) => report.audits[id]?.numericValue ?? 0;
  const score = (id) => Math.round((report.categories[id]?.score ?? 0) * 100);
  return {
    performance: score("performance"),
    accessibility: score("accessibility"),
    bestPractices: score("best-practices"),
    seo: score("seo"),
    lcp: audit("largest-contentful-paint"),
    cls: audit("cumulative-layout-shift"),
    tbt: audit("total-blocking-time"),
    weightKb: audit("total-byte-weight") / 1024,
    lcpElement: findLcpSelector(report),
  };
}

mkdirSync(OUT_DIR, { recursive: true });
const results = {};
for (const page of pages.length > 0 ? pages : DEFAULT_PAGES) {
  const samples = [];
  for (let run = 0; run < runs; run += 1) {
    samples.push(runOnce(`${base}${page}`, join(OUT_DIR, "tmp.json")));
  }
  const pick = (key) => median(samples.map((sample) => sample[key]));
  results[page] = {
    performance: pick("performance"),
    performanceRuns: samples.map((sample) => sample.performance),
    accessibility: pick("accessibility"),
    bestPractices: pick("bestPractices"),
    seo: pick("seo"),
    lcpMs: Math.round(pick("lcp")),
    cls: Number(pick("cls").toFixed(3)),
    tbtMs: Math.round(pick("tbt")),
    weightKb: Math.round(pick("weightKb")),
    lcpElement: samples[0].lcpElement,
  };
  const r = results[page];
  process.stdout.write(
    `${page.padEnd(22)} Rend ${r.performance} (${r.performanceRuns.join("/")}) · A11y ${r.accessibility} · BP ${r.bestPractices} · SEO ${r.seo} · LCP ${(r.lcpMs / 1000).toFixed(2)} s · CLS ${r.cls} · TBT ${r.tbtMs} ms · ${r.weightKb} KB · ${r.lcpElement}\n`,
  );
}
const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
writeFileSync(join(OUT_DIR, `${throttling}-${stamp}.json`), JSON.stringify(results, null, 2));
