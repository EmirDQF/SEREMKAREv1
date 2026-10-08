import type { BookingErrorCode, Result } from "@/lib/booking-provider/types";

const STATUS_BY_CODE: Readonly<Record<BookingErrorCode, number>> = {
  validation: 400,
  slot_unavailable: 409,
  not_found: 404,
  rate_limited: 429,
  not_configured: 503,
  provider_error: 502,
};

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Respuesta JSON con el sobre { ok, data } / { ok, error } y sin caché (datos de citas). */
export function respond<T>(result: Result<T>, okStatus = 200): Response {
  const status = result.ok ? okStatus : STATUS_BY_CODE[result.error.code];
  return Response.json(result, { status, headers: NO_STORE });
}

export function errorResponse(code: BookingErrorCode, message: string): Response {
  return respond({ ok: false, error: { code, message } });
}

export const RATE_LIMITED_MESSAGE = "Hiciste muchas solicitudes seguidas. Espera un minuto e intenta de nuevo.";

/**
 * Registro del servidor SIN datos personales ni síntomas: solo un nombre de evento y metadatos
 * técnicos (códigos, proveedor). Nunca pasar aquí nombres, documentos, teléfonos ni motivos.
 */
export function logEvent(event: string, meta: Readonly<Record<string, string | number | boolean>> = {}): void {
  console.warn(JSON.stringify({ at: new Date().toISOString(), event, ...meta }));
}
