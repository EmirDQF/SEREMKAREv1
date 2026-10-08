import type { NextRequest } from "next/server";
import { doctors } from "@/data/doctors";
import { RATE_LIMITED_MESSAGE, errorResponse, logEvent, respond } from "@/lib/api/http";
import { clientKey, createRateLimiter } from "@/lib/api/rate-limit";
import { firstIssue, slotsQuerySchema } from "@/lib/api/schemas";
import { resolveProvider } from "@/lib/booking-provider";

const limiter = createRateLimiter({ limit: 60, windowMs: 60_000 });

/** GET /api/booking/slots?doctorId=…&modality=meet&from=AAAA-MM-DD&to=AAAA-MM-DD */
export async function GET(request: NextRequest) {
  if (!limiter.check(clientKey(request.headers))) return errorResponse("rate_limited", RATE_LIMITED_MESSAGE);

  const parsed = slotsQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return errorResponse("validation", firstIssue(parsed.error));
  const query = parsed.data;
  if (!doctors.some((doctor) => doctor.slug === query.doctorId)) {
    return errorResponse("not_found", "No encontramos a ese especialista.");
  }

  const provider = resolveProvider(process.env, query.doctorId, query.modality);
  const result = await provider.getSlots(query);
  if (!result.ok) logEvent("booking.slots.error", { provider: provider.id, code: result.error.code });
  return Response.json(
    result.ok ? { ok: true, data: { days: result.data, isDemo: provider.id === "demo" } } : result,
    { status: result.ok ? 200 : respond(result).status, headers: { "Cache-Control": "no-store" } },
  );
}
