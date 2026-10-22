#!/usr/bin/env node
/**
 * Empaqueta el sitio para Hostinger (aplicación Node.js) en deploy/ (carpeta ignorada por git):
 *   - deploy/sermekare-fuente.zip  → Opción A: Hostinger instala (npm ci), compila y arranca (npm run start).
 *   - deploy/sermekare-listo/ y .zip → Opción B: ya compilado (output "standalone"); arranca con `node server.js`.
 *
 * Uso (Windows, desde la raíz del proyecto): node scripts/package-hostinger.mjs
 * Compila dos veces: primero con HOSTINGER_STANDALONE=1 (Opción B) y al final de nuevo normal, para dejar
 * .next como lo usa `npm run start`. Los ZIP se crean con el tar.exe de Windows (bsdtar): rutas con «/».
 */
import { execFileSync, execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DEPLOY = "deploy";
const READY = join(DEPLOY, "sermekare-listo");
const BSDTAR = process.env.BSDTAR ?? "C:/Windows/System32/tar.exe";

/** Opción A: solo lo necesario para `npm ci && npm run build && npm run start`. */
const SOURCE_ENTRIES = [
  "app",
  "components",
  "data",
  "lib",
  "public",
  "types",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "next-env.d.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  ".env.example",
  "README.md",
];

/** Lo que nunca debe viajar en el paquete compilado. */
const FORBIDDEN = [/^\.env(?!\.example$)/, /^ocultar_gemini\.py$/, /^\.git$/, /^tests$/, /^docs$/, /^\.lighthouse$/, /^deploy$/];

function run(command, args, env = {}) {
  // Con shell en Windows (npm es un .cmd); los argumentos son fijos, no vienen del usuario.
  execFileSync([command, ...args].join(" "), { stdio: "inherit", shell: true, env: { ...process.env, ...env } });
}

function zip(target, cwd, entries) {
  rmSync(target, { force: true });
  execFileSync(BSDTAR, ["-a", "-c", "-f", target, ...entries], { cwd, stdio: "inherit" });
}

function sizeOf(path) {
  if (!statSync(path).isDirectory()) return statSync(path).size;
  return readdirSync(path).reduce((total, entry) => total + sizeOf(join(path, entry)), 0);
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

rmSync(DEPLOY, { recursive: true, force: true });
mkdirSync(DEPLOY, { recursive: true });

// Opción A
for (const entry of SOURCE_ENTRIES) {
  if (!existsSync(entry)) throw new Error(`Falta ${entry} para el ZIP fuente`);
}
zip(join(DEPLOY, "sermekare-fuente.zip"), ".", SOURCE_ENTRIES);

// Opción B
run("npm", ["run", "build"], { HOSTINGER_STANDALONE: "1" });
rmSync(READY, { recursive: true, force: true });
cpSync(join(".next", "standalone"), READY, { recursive: true });
cpSync(join(".next", "static"), join(READY, ".next", "static"), { recursive: true });
cpSync("public", join(READY, "public"), { recursive: true });
cpSync(".env.example", join(READY, ".env.example"));
for (const entry of readdirSync(READY)) {
  if (FORBIDDEN.some((pattern) => pattern.test(entry))) rmSync(join(READY, entry), { recursive: true, force: true });
}
// server.js escucha en process.env.HOSTNAME; en Linux esa variable suele traer el NOMBRE de la máquina
// (Docker y algunos paneles la definen) y entonces la app no responde en localhost. Se respeta HOSTNAME
// solo si es una dirección (IP, ::, localhost); si no, 0.0.0.0 (todas las interfaces). LISTEN_HOSTNAME
// fuerza otra si algún día hiciera falta.
const SERVER = join(READY, "server.js");
const HOSTNAME_LINE = "const hostname = process.env.HOSTNAME || '0.0.0.0'";
const serverSource = readFileSync(SERVER, "utf8");
if (!serverSource.includes(HOSTNAME_LINE)) throw new Error("server.js cambió: revisa cómo elige el hostname");
const LISTEN_LINE = String.raw`const hostname = process.env.LISTEN_HOSTNAME || (/^(\d{1,3}(\.\d{1,3}){3}|::1?|localhost)$/.test(process.env.HOSTNAME || '') ? process.env.HOSTNAME : '0.0.0.0')`;
writeFileSync(SERVER, serverSource.replace(HOSTNAME_LINE, LISTEN_LINE));

// sharp solo lo usa el optimizador de next/image (el sitio no lo usa) y aquí trae binarios de Windows
// que no cargan en el Linux de Hostinger: se retira para no subir 19 MB inútiles.
for (const nativeModule of ["@img", "sharp"]) {
  rmSync(join(READY, "node_modules", nativeModule), { recursive: true, force: true });
}
zip(join("..", "sermekare-listo.zip"), READY, readdirSync(READY));

// Guía para subir (fuente versionada en docs/; en deploy/ va en .md y en .txt con el mismo contenido).
cpSync(join("docs", "LEEME-SUBIR-A-HOSTINGER.md"), join(DEPLOY, "LEEME-SUBIR-A-HOSTINGER.md"));
cpSync(join("docs", "LEEME-SUBIR-A-HOSTINGER.md"), join(DEPLOY, "LEEME-SUBIR-A-HOSTINGER.txt"));

// Deja .next como lo usa `npm run start` (sin standalone).
run("npm", ["run", "build"]);

// Huella del paquete: con qué código y con qué Node se generó, y el SHA-256 de cada ZIP (para comprobar
// que lo que se sube es exactamente lo que se probó).
const git = (args) => execSync(`git ${args}`, { encoding: "utf8" }).trim();
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const dirty = git("status --porcelain --untracked-files=no") !== "";
writeFileSync(
  join(DEPLOY, "VERSION.txt"),
  [
    "SERMEKARE · paquetes para Hostinger",
    `Generado: ${new Date().toLocaleString("es-PE", { timeZone: "America/Lima" })} (hora de Lima)`,
    `Rama: ${git("rev-parse --abbrev-ref HEAD")}`,
    `Commit: ${git("rev-parse HEAD")}${dirty ? " (con cambios sin confirmar)" : ""}`,
    `Node usado para compilar: ${process.version}`,
    `Next.js: ${JSON.parse(readFileSync(join("node_modules", "next", "package.json"), "utf8")).version}`,
    "",
    "SHA-256",
    `sermekare-fuente.zip  ${sha256(join(DEPLOY, "sermekare-fuente.zip"))}`,
    `sermekare-listo.zip   ${sha256(join(DEPLOY, "sermekare-listo.zip"))}`,
    "",
  ].join("\n"),
);

process.stdout.write(
  `\nPaquetes en ${DEPLOY}/:\n` +
    `  sermekare-fuente.zip  ${mb(sizeOf(join(DEPLOY, "sermekare-fuente.zip")))}\n` +
    `  sermekare-listo/      ${mb(sizeOf(READY))}\n` +
    `  sermekare-listo.zip   ${mb(sizeOf(join(DEPLOY, "sermekare-listo.zip")))}\n`,
);
