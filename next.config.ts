import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

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

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Las fotos locales miden como máximo 1200 px: sin variantes de 1920–3840 px en los srcset.
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  poweredByHeader: false,
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
