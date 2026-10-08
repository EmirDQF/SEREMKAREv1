import { formatTime, getZonedClock, todayISO } from "@/lib/schedule";
import type { TeleconsultHours, Slot, TimeWindow, Weekday } from "@/types/medical";

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] as const;
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre",
] as const;
/** Tope de días a recorrer al buscar días hábiles (evita bucles con calendarios vacíos). */
const MAX_LOOKAHEAD_DAYS = 31;

function parseISO(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** "2026-10-30" + 3 → "2026-11-02" (aritmética de calendario, sin zona horaria). */
export function addDaysISO(iso: string, days: number): string {
  const date = parseISO(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekdayOfISO(iso: string): Weekday {
  return parseISO(iso).getUTCDay() as Weekday;
}

/** "2026-10-12" → "lunes 12 de octubre" */
export function formatDayISO(iso: string): string {
  const date = parseISO(iso);
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} de ${MONTHS[date.getUTCMonth()]}`;
}

/** "lunes 12 de octubre, 7:30 p.m." */
export function formatSlot(slot: Slot): string {
  return `${formatDayISO(slot.date)}, ${formatTime(slot.minutes)}`;
}

/** Inicios de turno dentro del horario del sitio, recortados a la franja indicada (p. ej. la de un doctor). */
export function slotStarts(hours: TeleconsultHours, window?: TimeWindow): number[] {
  const from = Math.max(hours.opensAt, window?.from ?? hours.opensAt);
  const to = Math.min(hours.closesAt, window?.to ?? hours.closesAt);
  const starts: number[] = [];
  for (let start = hours.opensAt; start + hours.slotMinutes <= to; start += hours.slotMinutes) {
    if (start >= from) starts.push(start);
  }
  return starts;
}

/** Turnos que todavía se pueden reservar ese día (hoy: solo con la anticipación mínima). */
export function availableSlots(hours: TeleconsultHours, iso: string, now: Date, window?: TimeWindow): number[] {
  const today = todayISO(hours.timeZone, now);
  if (iso < today || !hours.days.includes(weekdayOfISO(iso))) return [];
  const starts = slotStarts(hours, window);
  if (iso > today) return starts;
  const earliest = getZonedClock(now, hours.timeZone).minutes + hours.minLeadMinutes;
  return starts.filter((start) => start >= earliest);
}

/** Próximos días hábiles con turnos disponibles (hoy incluido si aún quedan). */
export function nextBusinessDays(hours: TeleconsultHours, count: number, now: Date): string[] {
  const today = todayISO(hours.timeZone, now);
  const days: string[] = [];
  for (let offset = 0; offset < MAX_LOOKAHEAD_DAYS && days.length < count; offset++) {
    const iso = addDaysISO(today, offset);
    if (availableSlots(hours, iso, now).length > 0) days.push(iso);
  }
  return days;
}

export function isSlotAvailable(hours: TeleconsultHours, slot: Slot, now: Date, window?: TimeWindow): boolean {
  return availableSlots(hours, slot.date, now, window).includes(slot.minutes);
}

const SHORT_MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"] as const;

/** Etiqueta de los chips de día: { title: "Hoy" | "Mañana" | "Lunes", subtitle: "12 oct" }. */
export function dayChipLabel(iso: string, todayIso: string): { title: string; subtitle: string } {
  const date = parseISO(iso);
  const weekday = WEEKDAYS[date.getUTCDay()];
  const title =
    iso === todayIso ? "Hoy" : iso === addDaysISO(todayIso, 1) ? "Mañana" : weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return { title, subtitle: `${date.getUTCDate()} ${SHORT_MONTHS[date.getUTCMonth()]}` };
}

/** Lima no tiene horario de verano: siempre UTC−5. */
const LIMA_OFFSET_MINUTES = -5 * 60;
const MS_PER_MINUTE = 60_000;
const MINUTES_PER_DAY = 24 * 60;

/** Turno en hora de Lima → instante ISO (UTC). ("2026-10-05", 570) → "2026-10-05T14:30:00.000Z" */
export function limaSlotToISO(date: string, minutes: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const utcMs = Date.UTC(year, month - 1, day) + (minutes - LIMA_OFFSET_MINUTES) * MS_PER_MINUTE;
  return new Date(utcMs).toISOString();
}

/** Instante ISO → turno en hora de Lima (fecha AAAA-MM-DD y minuto del día). */
export function isoToLimaSlot(iso: string): Slot {
  const limaMs = Date.parse(iso) + LIMA_OFFSET_MINUTES * MS_PER_MINUTE;
  const lima = new Date(limaMs);
  const minutes = Math.floor((limaMs / MS_PER_MINUTE) % MINUTES_PER_DAY + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return { date: lima.toISOString().slice(0, 10), minutes };
}
