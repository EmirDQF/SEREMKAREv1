import { logEvent } from "@/lib/api/http";
import { exceedsContentLength } from "@/lib/api/rate-limit";
import { verifyCalcomSignature } from "@/lib/api/webhook-signature";
import { sendBookingConfirmation, whatsappCloudConfig } from "@/lib/api/whatsapp-cloud";

const MAX_BODY_BYTES = 256 * 1024;

interface CalcomWebhook {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    startTime?: string;
    attendees?: { name?: string; phoneNumber?: string }[];
    responses?: { attendeePhoneNumber?: { value?: string } };
  };
}

/** POST /api/webhooks/calcom — eventos firmados de Cal.com (confirmación por WhatsApp opcional). */
export async function POST(request: Request) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET ?? "";
  if (exceedsContentLength(request.headers, MAX_BODY_BYTES)) return new Response(null, { status: 413 });
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });
  if (!verifyCalcomSignature(raw, request.headers.get("x-cal-signature-256"), secret)) {
    logEvent("webhook.calcom.invalid_signature");
    return new Response(null, { status: 401 });
  }

  let event: CalcomWebhook;
  try {
    event = JSON.parse(raw) as CalcomWebhook;
  } catch {
    return new Response(null, { status: 400 });
  }

  const trigger = event.triggerEvent ?? "unknown";
  const config = whatsappCloudConfig(process.env);
  if (trigger !== "BOOKING_CREATED" || !config) {
    logEvent("webhook.calcom.received", { trigger, whatsapp: Boolean(config) });
    return Response.json({ ok: true });
  }

  const attendee = event.payload?.attendees?.[0];
  const phone = attendee?.phoneNumber ?? event.payload?.responses?.attendeePhoneNumber?.value ?? null;
  const startTime = event.payload?.startTime ?? null;
  const sent = phone && startTime ? await sendBookingConfirmation(config, { phone, name: attendee?.name ?? "", startTime }) : false;
  logEvent("webhook.calcom.booking_created", { whatsappSent: sent });
  return Response.json({ ok: true });
}
