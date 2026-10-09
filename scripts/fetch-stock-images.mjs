#!/usr/bin/env node
/**
 * Descarga las fotos ilustrativas (Unsplash, licencia Unsplash) y las guarda optimizadas en
 * public/images/stock/ (WebP, calidad 75, ≤ 150 KB). Así el sitio no depende de images.unsplash.com
 * (ni de su CSP) y next/image las sirve desde el propio dominio en AVIF/WebP.
 *
 * Uso: node scripts/fetch-stock-images.mjs   (requiere internet; reescribe los archivos)
 */
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = "public/images/stock";
const MAX_BYTES = 150 * 1024;
const DEFAULT_QUALITY = 75;
const KB = 1024;

/** nombre local → id de la foto en Unsplash, ancho final y calidad (≤ 75; menos en fotos con mucho detalle). */
const PHOTOS = {
  "videoconsulta-laptop": { id: "1758691463620-188ca7c1a04f", width: 1200 },
  "videoconsulta-escritorio": { id: "1758691462858-f1286e5daf40", width: 1200 },
  "ecografia-monitor": { id: "1666214280557-f1b5022eb634", width: 1200 },
  "videollamada-paciente": { id: "1758691461932-d0aa0ebf6b31", width: 1200 },
  "paso-reserva": { id: "1758691462749-a95ce1bd7f96", width: 1000 },
  "paso-videollamada": { id: "1758691462743-f9fc9e430d39", width: 1000 },
  "paso-revision": { id: "1758691463606-1493d79cc577", width: 1000 },
  "examen-rodilla": { id: "1649751361457-01d3a696c7e6", width: 1200 },
  "blog-imagenes-medicas": { id: "1666214280391-8ff5bd3c0bf0", width: 1200 },
  "blog-oficina": { id: "1573496359142-b8d87734a5a2", width: 1200 },
  "blog-corredor": { id: "1476480862126-209bfaa8edc8", width: 1000, quality: 60 },
  "blog-teclado-estetoscopio": { id: "1576091160550-2173dba999ef", width: 1200 },
  "blog-adulto-mayor": { id: "1631217868264-e5b90bb7e133", width: 1200 },
  "blog-estetoscopio": { id: "1505751172876-fa1923c5c528", width: 1200 },
};

mkdirSync(OUT_DIR, { recursive: true });
let tooBig = false;
for (const [name, { id, width, quality = DEFAULT_QUALITY }] of Object.entries(PHOTOS)) {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85&fm=jpg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const file = join(OUT_DIR, `${name}.webp`);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(file);
  const bytes = statSync(file).size;
  tooBig ||= bytes > MAX_BYTES;
  process.stdout.write(`${file}  ${(bytes / KB).toFixed(1)} KB${bytes > MAX_BYTES ? "  > 150 KB" : ""}\n`);
}
if (tooBig) process.exit(1);
