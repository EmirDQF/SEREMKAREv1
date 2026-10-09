#!/usr/bin/env node
/**
 * Foto del Dr. Daniel Ccolcca para la web: AVIF + WebP en public/images/doctor/.
 *
 * - Recorte 4:5 a cabeza y hombros, por ENCIMA del bordado de la bata (la bata del original lleva
 *   otro nombre y otra especialidad; ver docs/OPTIMIZACION.md, decisión 1).
 * - Anchos pedidos: 400, 800 y 1200 px. El recorte mide 552 px de ancho: no se amplía (más peso sin
 *   más nitidez), así que los anchos mayores se reemplazan por el ancho real del recorte.
 * - Calidad ≤ 75 y ningún archivo > 150 KB (si no, el script falla).
 * - Además, un JPEG del recorte para Open Graph y JSON-LD.
 *
 * Uso: node scripts/optimize-doctor-photo.mjs [original]
 * Original por defecto: assets/originals/danielccolcca.png (fuera de public/ y fuera de git).
 */
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SOURCE = process.argv[2] ?? "assets/originals/danielccolcca.png";
const OUT_DIR = "public/images/doctor";
const BASENAME = "daniel-ccolcca";
/** Coordenadas sobre el original de 1536 × 1024. */
const EXPECTED_SIZE = { width: 1536, height: 1024 };
const CROP = { left: 429, top: 0, width: 552, height: 690 };
const REQUESTED_WIDTHS = [400, 800, 1200];
const FORMATS = {
  avif: (image) => image.avif({ quality: 55, effort: 6 }),
  webp: (image) => image.webp({ quality: 75, effort: 6 }),
};
const MAX_BYTES = 150 * 1024;
const KB = 1024;

const { width, height } = await sharp(SOURCE).metadata();
if (width !== EXPECTED_SIZE.width || height !== EXPECTED_SIZE.height) {
  throw new Error(`Se esperaba un original de ${EXPECTED_SIZE.width}×${EXPECTED_SIZE.height} y llegó ${width}×${height}: revisa CROP.`);
}

const widths = [...new Set(REQUESTED_WIDTHS.map((w) => Math.min(w, CROP.width)))];
mkdirSync(OUT_DIR, { recursive: true });

let tooBig = false;
for (const outWidth of widths) {
  for (const [format, encode] of Object.entries(FORMATS)) {
    const file = join(OUT_DIR, `${BASENAME}-${outWidth}.${format}`);
    await encode(sharp(SOURCE).extract(CROP).resize({ width: outWidth, withoutEnlargement: true })).toFile(file);
    const bytes = statSync(file).size;
    tooBig ||= bytes > MAX_BYTES;
    process.stdout.write(`${file}  ${(bytes / KB).toFixed(1)} KB${bytes > MAX_BYTES ? "  > 150 KB" : ""}\n`);
  }
}
// JPEG para Open Graph (app/opengraph-image.tsx) y el JSON-LD Physician: lo leen WhatsApp, Facebook y Google.
const jpeg = join(OUT_DIR, `${BASENAME}-${CROP.width}.jpg`);
await sharp(SOURCE).extract(CROP).jpeg({ quality: 75, mozjpeg: true }).toFile(jpeg);
const jpegBytes = statSync(jpeg).size;
tooBig ||= jpegBytes > MAX_BYTES;
process.stdout.write(`${jpeg}  ${(jpegBytes / KB).toFixed(1)} KB\n`);

if (tooBig) process.exit(1);
