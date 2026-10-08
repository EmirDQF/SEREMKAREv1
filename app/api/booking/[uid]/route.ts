import type { NextRequest } from "next/server";
import { RATE_LIMITED_MESSAGE, errorResponse, logEvent, respond } from "@/lib/api/http";
import { clientKey, createRateLimiter } from "@/lib/api/rate-limit";
import { resolveProviderForUid } from "@/lib/booking-provider";

const limiter = createRateLimiter({ limit: 30, windowMs: 60_000 });
const UID = /^[A-Za-z0-9_-]{6,80}$/;

/** GET /api/booking/[uid] — resumen de la cita (sin datos personales del paciente). */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/booking/[uid]">) {
  if (!limiter.check(clientKey(request.headers))) return errorResponse("rate_limited", RATE_LIMITED_MESSAGE);
  const { uid } = await ctx.params;
  if (!UID.test(uid)) return errorResponse("validation", "Código de cita no válido.");

  const provider = resolveProviderForUid(process.env, uid);
  const result = await provider.getBooking(uid);
  if (!result.ok && result.error.code !== "not_found") {
    logEvent("booking.get.error", { provider: provider.id, code: result.error.code });
  }
  return respond(result);
}
