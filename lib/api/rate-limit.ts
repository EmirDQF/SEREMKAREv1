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

/** Clave del cliente: primera IP de x-forwarded-for (proxy de Vercel) o x-real-ip. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "anon";
}
