/** Formatos de fecha y hora SIEMPRE en hora de Lima (independiente de la zona del dispositivo). */

const TIME_ZONE = "America/Lima";
const LOCALE = "es-PE";

const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
});
const timeFormat = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" });
const dayFormat = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long" });
const hourFormat = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", hourCycle: "h23" });

/** "martes, 6 de octubre, 9:00 a. m." */
export function formatLimaDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

/** "9:30 a. m." */
export function formatLimaTime(iso: string): string {
  return timeFormat.format(new Date(iso));
}

/** "AAAA-MM-DD" (fecha de Lima, sin zona) → "martes, 6 de octubre" */
export function formatLimaDay(date: string): string {
  // Mediodía UTC: cae el mismo día calendario en Lima (UTC−5).
  return dayFormat.format(new Date(`${date}T12:00:00Z`));
}

/** Hora (0–23) en Lima, para agrupar turnos en mañana y tarde. */
export function limaHour(iso: string): number {
  return Number(hourFormat.format(new Date(iso)));
}

/** Fecha de hoy en Lima: AAAA-MM-DD. */
export function limaToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}
