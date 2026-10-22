import type { NextConfig } from "next";
import { DEFAULT_SITE_URL, SITE_URL_HELP, resolveSiteUrl } from "./lib/site-url";

const isProduction = process.env.NODE_ENV === "production";

/*
 * NEXT_PUBLIC_SITE_URL: un valor imposible detiene el build con instrucciones; si falta, se avisa y se
 * usa https://sermekare.com (el dominio correcto), para que un olvido en el panel no tumbe el sitio.
 */
const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
if (!siteUrl.ok) throw new Error(siteUrl.error);
// Los procesos de compilación heredan el entorno: la marca evita repetir el aviso en cada uno.
if (siteUrl.usedDefault && isProduction && !process.env.SITE_URL_WARNING_SHOWN) {
  process.env.SITE_URL_WARNING_SHOWN = "1";
  console.warn(`\n⚠ Falta NEXT_PUBLIC_SITE_URL: se usa ${DEFAULT_SITE_URL}.\n  ${SITE_URL_HELP}\n`);
}

/**
 * CSP sin nonces para conservar el render estático (Lighthouse/LCP). Scripts solo del propio
 * dominio; el único iframe permitido es el mapa de Google (fachada clic-para-cargar).
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.google.com https://maps.google.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()" },
  ...(isProduction ? [{ key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }] : []),
];

/** Imágenes de /public sin hash en el nombre: 30 días + revalidación (pueden reemplazarse). */
const PUBLIC_IMAGE_CACHE = "public, max-age=2592000, stale-while-revalidate=86400";

/**
 * Paquete compilado para Hostinger (Opción B, `node server.js`): solo con HOSTINGER_STANDALONE=1.
 * Sin la variable, el build y `npm run start` quedan exactamente como siempre.
 */
const STANDALONE = process.env.HOSTINGER_STANDALONE === "1";

const nextConfig: NextConfig = {
  ...(STANDALONE ? { output: "standalone" as const } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Las fotos locales miden como máximo 1200 px: sin variantes de 1920–3840 px en los srcset.
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  poweredByHeader: false,
  experimental: {
    /*
     * CSS como archivo externo (cacheable), NO en línea. Medido en la Home (docs/MEJORA-2026.md, fase A):
     * con inlineCss, Next copia los 92 KB de CSS también dentro de la carga RSC (está documentado) y el
     * HTML pesa 92 KB gzip con TBT de 600–870 ms; sin él, 59 KB y TBT ~260 ms, a cambio de una petición
     * de CSS (19 KB gzip) que el navegador descubre en el <head> y baja en paralelo.
     */
    inlineCss: false,
  },
  async redirects() {
    // Ambas URLs funcionan: «Especialistas» es el nombre del menú; el directorio vive en /staff.
    return [{ source: "/especialistas", destination: "/staff", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: PUBLIC_IMAGE_CACHE }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
