import type { NextRequest } from "next/server";
import { doctors } from "@/data/doctors";
import { RATE_LIMITED_MESSAGE, errorResponse, logEvent, respond } from "@/lib/api/http";
import { clientKey, createRateLimiter, exceedsContentLength, fingerprint } from "@/lib/api/rate-limit";
import { createBookingSchema, firstIssue } from "@/lib/api/schemas";
import { resolveProvider } from "@/lib/booking-provider";

/** 8 reservas por IP cada 10 minutos: de sobra para una persona, poco para un bot. */
const limiter = createRateLimiter({ limit: 8, windowMs: 10 * 60_000 });
/** 3 reservas por paciente (correo + documento) por hora. */
const identityLimiter = createRateLimiter({ limit: 3, windowMs: 60 * 60_000 });
const MAX_BODY_BYTES = 8 * 1024;

/** POST /api/booking/create — crea la cita (Cal.com o demo). Nunca registra datos personales. */
export async function POST(request: NextRequest) {
  if (!limiter.check(clientKey(request.headers))) return errorResponse("rate_limited", RATE_LIMITED_MESSAGE);
  if (exceedsContentLength(request.headers, MAX_BODY_BYTES)) return errorResponse("validation", "La solicitud es demasiado grande.");

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return errorResponse("validation", "La solicitud es demasiado grande.");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return errorResponse("validation", "Solicitud no válida.");
  }

  const parsed = createBookingSchema.safeParse(json);
  if (!parsed.success) return errorResponse("validation", firstIssue(parsed.error));
  // Los consentimientos y el honeypot ya se validaron; al proveedor solo va la cita.
  const { doctorId, modality, start, patient, reason, triageSummary } = parsed.data;
  const input = { doctorId, modality, start, patient, reason, triageSummary };

  if (!doctors.some((doctor) => doctor.slug === input.doctorId)) {
    return errorResponse("not_found", "No encontramos a ese especialista.");
  }
  if (Date.parse(input.start) <= Date.now()) {
    return errorResponse("slot_unavailable", "Ese horario ya pasó. Elige otro, por favor.");
  }
  // Segundo límite por identidad (no depende de la IP): solo se guarda una huella SHA-256.
  if (!identityLimiter.check(await fingerprint(`${patient.email}|${patient.document}`))) {
    return errorResponse("rate_limited", RATE_LIMITED_MESSAGE);
  }

  const provider = resolveProvider(process.env, input.doctorId, input.modality);
  const result = await provider.createBooking(input);
  logEvent(result.ok ? "booking.created" : "booking.create.error", {
    provider: provider.id,
    ...(result.ok ? {} : { code: result.error.code }),
  });
  return respond(result, 201);
}
