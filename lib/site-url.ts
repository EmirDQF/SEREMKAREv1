/**
 * Dirección pública del sitio a partir de NEXT_PUBLIC_SITE_URL, tolerante a los errores habituales al
 * escribirla en un panel de hosting: espacios, barra final, «sermekare.com» sin https:// o vacía.
 * Lógica pura (sin process.env) para usarla en next.config.ts, en data/site.ts y en los tests.
 */

export const DEFAULT_SITE_URL = "https://sermekare.com";

export const SITE_URL_HELP =
  "En Hostinger: aplicación Node.js → Variables de entorno → NEXT_PUBLIC_SITE_URL = https://sermekare.com " +
  "(dirección completa, sin barra al final). Luego vuelve a compilar (npm run build).";

export type SiteUrlResult =
  | { ok: true; url: string; usedDefault: boolean }
  | { ok: false; error: string };

export function resolveSiteUrl(raw: string | undefined): SiteUrlResult {
  const value = raw?.trim() ?? "";
  if (value === "") return { ok: true, url: DEFAULT_SITE_URL, usedDefault: true };

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname.includes(".")) throw new Error("sin dominio");
    return { ok: true, url: `${parsed.protocol}//${parsed.host}`, usedDefault: false };
  } catch {
    return {
      ok: false,
      error: `NEXT_PUBLIC_SITE_URL tiene un valor no válido («${value}»). ${SITE_URL_HELP}`,
    };
  }
}
