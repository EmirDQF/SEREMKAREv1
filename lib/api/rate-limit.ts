/**
 * Rate limit básico en memoria (ventana deslizante por clave). Suficiente para frenar abuso
 * simple en v1; en serverless cada instancia lleva su propia cuenta (ver docs/CONFIGURAR-CITAS.md).
 */

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
  /** Tope de claves en memoria (se descartan las más antiguas). */
  maxKeys?: number;
}

export interface RateLimiter {
  /** true si la petición entra; false si superó el límite. */
  check(key: string): boolean;
}

const DEFAULT_MAX_KEYS = 5000;

export function createRateLimiter({ limit, windowMs, now = Date.now, maxKeys = DEFAULT_MAX_KEYS }: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key) {
      const current = now();
      const recent = (hits.get(key) ?? []).filter((time) => current - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      hits.delete(key);
      hits.set(key, [...recent, current]);
      if (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) hits.delete(oldest);
      }
      return true;
    },
  };
}

/**
 * Clave del cliente. Prioriza las cabeceras que el proxy de Vercel fija y el cliente no puede
 * falsificar (x-vercel-forwarded-for, x-real-ip); x-forwarded-for queda como último recurso.
 * Como defensa adicional, la creación de citas limita también por identidad del paciente.
 */
export function clientKey(headers: Headers): string {
  const trusted = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim();
  return trusted || headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
}

/** Huella no reversible de un dato (para limitar por identidad sin guardar el dato). */
export async function fingerprint(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.trim().toLowerCase()));
  return Buffer.from(digest).toString("hex");
}

/** true si la cabecera Content-Length declara más bytes que el máximo (se rechaza sin leer). */
export function exceedsContentLength(headers: Headers, maxBytes: number): boolean {
  const declared = Number(headers.get("content-length"));
  return Number.isFinite(declared) && declared > maxBytes;
}
