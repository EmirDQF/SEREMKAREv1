import { addDaysISO, limaSlotToISO } from "@/lib/slots";
import {
  fail,
  ok,
  type BookingConfirmation,
  type BookingInput,
  type BookingModality,
  type BookingProvider,
  type BookingStatus,
  type Result,
  type SlotDay,
  type SlotQuery,
} from "@/lib/booking-provider/types";

/**
 * Proveedor Cal.com (API v2). Solo se usa en el servidor: la API key nunca llega al cliente.
 * Endpoints y versiones verificados en la documentación oficial (cal.com/docs/api-reference/v2):
 * - GET  /v2/slots              · cal-api-version 2024-09-04
 * - POST /v2/bookings           · cal-api-version 2026-02-25
 * - GET  /v2/bookings/{uid}     · cal-api-version 2026-02-25
 */

export const SLOTS_API_VERSION = "2024-09-04";
export const BOOKINGS_API_VERSION = "2026-02-25";
const TIME_ZONE = "America/Lima";
const REQUEST_TIMEOUT_MS = 10_000;
const NOTES_MAX = 1000;

export interface CalcomConfig {
  apiKey: string;
  /** p. ej. https://api.cal.com/v2 */
  apiUrl: string;
  /** Web pública de Cal.com para reprogramar/cancelar (p. ej. https://cal.com). */
  webUrl: string;
}

/** Devuelve el ID del tipo de evento de Cal.com del médico y la modalidad (o null). */
export type EventTypeLookup = (doctorId: string, modality: BookingModality) => number | null;

const PROVIDER_ERROR = "No pudimos conectar con la agenda. Intenta de nuevo en unos minutos o escríbenos por WhatsApp.";
const SLOT_TAKEN = "Ese horario acaba de ocuparse. Elige otro, por favor.";

interface CalcomBooking {
  uid: string;
  start: string;
  end: string;
  status?: string;
  location?: string | null;
  meetingUrl?: string | null;
  eventTypeId?: number;
}

function toStatus(raw: string | undefined): BookingStatus {
  if (raw === "cancelled" || raw === "rejected") return "cancelled";
  if (raw === "pending" || raw === "awaiting_host") return "pending";
  return "accepted";
}

function meetingLink(booking: CalcomBooking): string | null {
  const candidate = booking.location ?? booking.meetingUrl ?? null;
  return candidate && /^https:\/\//.test(candidate) ? candidate : null;
}

function buildNotes(input: BookingInput): string {
  const lines = [
    `Motivo: ${input.reason}`,
    input.triageSummary ? `Orientación previa (no es diagnóstico): ${input.triageSummary}` : null,
    `Documento: ${input.patient.document}`,
    `Para: ${input.patient.forWhom === "mi" ? "el mismo paciente" : "un familiar"}`,
    "Reserva hecha desde la web de SERMEKARE.",
  ];
  return lines.filter(Boolean).join("\n").slice(0, NOTES_MAX);
}

export function createCalcomProvider(config: CalcomConfig, eventTypeIdFor: EventTypeLookup): BookingProvider {
  const base = config.apiUrl.replace(/\/$/, "");
  const web = config.webUrl.replace(/\/$/, "");

  async function request(path: string, version: string, init: RequestInit = {}): Promise<Response | null> {
    try {
      return await fetch(`${base}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "cal-api-version": version,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        cache: "no-store",
      });
    } catch {
      return null;
    }
  }

  const getRescheduleUrl = (uid: string) => `${web}/reschedule/${encodeURIComponent(uid)}`;
  const getCancelUrl = (uid: string) => `${web}/booking/${encodeURIComponent(uid)}?cancel=true`;

  function toConfirmation(booking: CalcomBooking, doctorId: string, modality: BookingModality): BookingConfirmation {
    return {
      uid: booking.uid,
      doctorId,
      modality,
      start: new Date(booking.start).toISOString(),
      end: new Date(booking.end).toISOString(),
      status: toStatus(booking.status),
      meetingUrl: meetingLink(booking),
      rescheduleUrl: getRescheduleUrl(booking.uid),
      cancelUrl: getCancelUrl(booking.uid),
      isDemo: false,
    };
  }

  async function getSlots(query: SlotQuery): Promise<Result<SlotDay[]>> {
    const eventTypeId = eventTypeIdFor(query.doctorId, query.modality);
    if (eventTypeId === null) return fail("not_configured", "La agenda de este especialista aún no está configurada.");
    const params = new URLSearchParams({
      eventTypeId: String(eventTypeId),
      start: limaSlotToISO(query.from, 0),
      end: limaSlotToISO(addDaysISO(query.to, 1), 0),
      timeZone: TIME_ZONE,
      format: "range",
    });
    const response = await request(`/slots?${params}`, SLOTS_API_VERSION);
    if (!response?.ok) return fail("provider_error", PROVIDER_ERROR);
    const body = (await response.json()) as { data?: Record<string, { start: string }[]> };
    const days = Object.entries(body.data ?? {})
      .map(([date, slots]) => ({ date, slots: slots.map((slot) => ({ start: new Date(slot.start).toISOString() })) }))
      .filter((day) => day.slots.length > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
    return ok(days);
  }

  async function createBooking(input: BookingInput): Promise<Result<BookingConfirmation>> {
    const eventTypeId = eventTypeIdFor(input.doctorId, input.modality);
    if (eventTypeId === null) return fail("not_configured", "La agenda de este especialista aún no está configurada.");
    const response = await request("/bookings", BOOKINGS_API_VERSION, {
      method: "POST",
      body: JSON.stringify({
        start: new Date(input.start).toISOString(),
        eventTypeId,
        attendee: {
          name: input.patient.fullName,
          email: input.patient.email,
          timeZone: TIME_ZONE,
          phoneNumber: `+${input.patient.phone}`,
          language: "es",
        },
        bookingFieldsResponses: { notes: buildNotes(input) },
        metadata: { source: "sermekare-web", modality: input.modality, doctorId: input.doctorId },
      }),
    });
    if (!response) return fail("provider_error", PROVIDER_ERROR);
    if (response.status === 409 || response.status === 400) return fail("slot_unavailable", SLOT_TAKEN);
    if (!response.ok) return fail("provider_error", PROVIDER_ERROR);
    const body = (await response.json()) as { data?: CalcomBooking };
    if (!body.data?.uid) return fail("provider_error", PROVIDER_ERROR);
    return ok(toConfirmation(body.data, input.doctorId, input.modality));
  }

  async function getBooking(uid: string): Promise<Result<BookingConfirmation>> {
    const response = await request(`/bookings/${encodeURIComponent(uid)}`, BOOKINGS_API_VERSION);
    if (response?.status === 404) return fail("not_found", "No encontramos esa cita.");
    if (!response?.ok) return fail("provider_error", PROVIDER_ERROR);
    const body = (await response.json()) as { data?: CalcomBooking & { metadata?: { modality?: BookingModality; doctorId?: string } } };
    if (!body.data?.uid) return fail("not_found", "No encontramos esa cita.");
    const modality = body.data.metadata?.modality === "presencial" ? "presencial" : "meet";
    return ok(toConfirmation(body.data, body.data.metadata?.doctorId ?? "", modality));
  }

  return { id: "calcom", getSlots, createBooking, getBooking, getRescheduleUrl, getCancelUrl };
}
