/** Enlaces para agregar la cita al calendario del paciente (sin datos clínicos). */

export interface CalendarEvent {
  title: string;
  /** ISO 8601 */
  start: string;
  end: string;
  details: string;
  location?: string;
}

const TIME_ZONE = "America/Lima";
const ICS_LINE_BREAK = "\r\n";

/** "2026-10-06T14:00:00.000Z" → "20261006T140000Z" */
function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Enlace de plantilla de Google Calendar (abre el formulario de evento ya lleno). */
export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    details: event.details,
    ctz: TIME_ZONE,
  });
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Escapa texto según RFC 5545 (barra invertida, punto y coma, coma y saltos de línea). */
function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Archivo .ics (Apple Calendar, Outlook) con recordatorio 1 hora antes. */
export function buildIcs(event: CalendarEvent & { uid: string }, now: Date = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SERMEKARE//Consultorio virtual//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}@sermekare`,
    `DTSTAMP:${toCalendarStamp(now.toISOString())}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.details)}`,
    ...(event.location ? [`LOCATION:${escapeIcsText(event.location)}`] : []),
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join(ICS_LINE_BREAK) + ICS_LINE_BREAK;
}
