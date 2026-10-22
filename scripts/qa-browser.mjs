#!/usr/bin/env node
/**
 * QA en navegador (solo lectura): por página, ancho y tema revisa scroll horizontal, texto < 16 px,
 * áreas táctiles < 48 px, imágenes rotas, enlaces wa.me/tel: vacíos y errores de consola, y guarda una
 * captura de página completa. No envía formularios ni modifica nada.
 *
 * Requiere el build servido (npm run build && npm run start) y puppeteer-core (viene con Lighthouse):
 *   PUPPETEER_CORE=<ruta a node_modules/puppeteer-core> node scripts/qa-browser.mjs [--base=http://localhost:3100] [--shots] [/ /servicios …]
 * Salida: tabla en consola y capturas en .lighthouse/shots/ (carpeta ignorada por git).
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const MOBILE_WIDTHS = [320, 360, 390, 412, 430, 768];
const DESKTOP_WIDTH = 1366;
const MIN_TEXT_PX = 16;
const MIN_TARGET_PX = 48;
const DEFAULT_PAGES = ["/", "/servicios", "/densitometria-osea", "/consulta-virtual", "/suplementos", "/seguimiento", "/sedes", "/contacto", "/teleconsulta", "/tarifas", "/staff", "/blog", "/preguntas-frecuentes", "/politica-de-privacidad", "/terminos", "/libro-de-reclamaciones", "/no-existe-404"];

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("--base=")) ?? "--base=http://localhost:3100").slice(7);
const takeShots = args.includes("--shots");
const pages = args.filter((a) => a.startsWith("/"));
const corePath = process.env.PUPPETEER_CORE;
const puppeteer = (await import(corePath ? pathToFileURL(join(corePath, "lib/puppeteer/puppeteer-core.js")).href : "puppeteer-core")).default;

/** Se ejecuta en la página: problemas de maquetación y accesibilidad táctil. */
function audit(minText, minTarget) {
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none" && !el.closest("[aria-hidden=true], dialog:not([open]), .sr-only");
  };
  const smallText = new Set();
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || el.closest("svg")) continue;
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (ownText && parseFloat(getComputedStyle(el).fontSize) < minText - 0.5) smallText.add(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}: "${el.textContent.trim().slice(0, 30)}"`);
  }
  const smallTargets = [];
  for (const el of document.querySelectorAll("a[href], button, summary, input:not([type=hidden]), select, textarea, label:has(input)")) {
    if (!visible(el)) continue;
    const rect = el.getBoundingClientRect();
    // Excepciones de WCAG 2.5.8: enlaces dentro de una frase y controles cuya etiqueta ya es el área táctil.
    const inline = getComputedStyle(el).display === "inline" && el.closest("p, li, label span") && !el.closest("nav");
    const label = el.matches("input") ? el.closest("label") : null;
    if (label && label.getBoundingClientRect().height >= minTarget - 0.5) continue;
    if (!inline && (rect.height < minTarget - 0.5 || rect.width < 24)) smallTargets.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28)}" ${Math.round(rect.width)}×${Math.round(rect.height)}`);
  }
  const brokenImages = [...document.images].filter((img) => img.complete && img.naturalWidth === 0 && img.loading !== "lazy").map((img) => img.currentSrc || img.src);
  const emptyLinks = [...document.querySelectorAll("a[href^='https://wa.me'], a[href^='tel:']")].filter((a) => /wa\.me\/?(\?|$)|^tel:\+?$/.test(a.getAttribute("href"))).map((a) => a.getAttribute("href"));
  const overflow = document.documentElement.scrollWidth - window.innerWidth;
  const offenders = overflow > 0 ? [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && visible(el)).slice(0, 3).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 2).join(".")}`) : [];
  return { overflow, offenders, smallText: [...smallText].slice(0, 6), smallTextCount: smallText.size, smallTargets: smallTargets.slice(0, 6), smallTargetCount: smallTargets.length, brokenImages, emptyLinks };
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-first-run"] });
if (takeShots) mkdirSync(".lighthouse/shots", { recursive: true });
let problems = 0;

for (const path of pages.length > 0 ? pages : DEFAULT_PAGES) {
  for (const theme of ["light", "dark"]) {
    for (const width of [...MOBILE_WIDTHS, DESKTOP_WIDTH]) {
      const page = await browser.newPage();
      const errors = [];
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text().slice(0, 120)));
      page.on("pageerror", (err) => errors.push(String(err).slice(0, 120)));
      const mobile = width < 1024;
      await page.setViewport({ width, height: mobile ? 800 : 900, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
      await page.evaluateOnNewDocument((t) => localStorage.setItem("sermekare-theme", t), theme);
      const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle0" });
      const result = await page.evaluate(audit, MIN_TEXT_PX, MIN_TARGET_PX);
      const status = response?.status() ?? 0;
      const realErrors = errors.filter((e) => !/404 \(Not Found\)/.test(e) || path !== "/no-existe-404");
      const bad = result.overflow > 0 || result.brokenImages.length > 0 || result.emptyLinks.length > 0 || realErrors.length > 0;
      // Texto y áreas táctiles se informan una vez por página (390 px, claro) para no repetir 14 veces.
      const detail = width === 390 && theme === "light";
      if (bad || (detail && (result.smallTextCount > 0 || result.smallTargetCount > 0))) {
        problems += bad ? 1 : 0;
        process.stdout.write(
          `${path} ${width}px ${theme} [${status}]` +
            (result.overflow > 0 ? ` · SCROLL-X +${result.overflow}px (${result.offenders.join(", ")})` : "") +
            (result.brokenImages.length ? ` · IMG ROTAS ${result.brokenImages.join(" ")}` : "") +
            (result.emptyLinks.length ? ` · ENLACES VACÍOS ${result.emptyLinks.join(" ")}` : "") +
            (realErrors.length ? ` · CONSOLA ${realErrors.join(" | ")}` : "") +
            (detail && result.smallTextCount ? `\n   texto<16px (${result.smallTextCount}): ${result.smallText.join(" · ")}` : "") +
            (detail && result.smallTargetCount ? `\n   táctil<48px (${result.smallTargetCount}): ${result.smallTargets.join(" · ")}` : "") +
            "\n",
        );
      }
      if (takeShots && (width === 390 || width === DESKTOP_WIDTH)) {
        const name = `${path === "/" ? "home" : path.slice(1).replaceAll("/", "_")}-${width}-${theme}.png`;
        // content-visibility:auto deja en blanco las secciones fuera de pantalla en una captura completa.
        // Igual las entradas ligadas al scroll: en una captura completa quedarían a medio camino.
        await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}[data-reveal],.progress-track{animation:none!important}" });
        await page.screenshot({ path: join(".lighthouse/shots", name), fullPage: true });
      }
      await page.close();
    }
  }
}
await browser.close();
process.stdout.write(problems === 0 ? "QA: sin scroll horizontal, imágenes rotas, enlaces vacíos ni errores de consola.\n" : `QA: ${problems} combinaciones con problemas.\n`);
process.exitCode = problems === 0 ? 0 : 1;
