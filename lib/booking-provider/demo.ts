import { doctors as publishedDoctors } from "@/data/doctors";
import { DEMO_TELECONSULT_HOURS } from "@/data/teleconsult";
import { addDaysISO, availableSlots, isoToLimaSlot, limaSlotToISO, weekdayOfISO } from "@/lib/slots";
import type { Doctor, TeleconsultHours, TimeWindow } from "@/types/medical";
import {
  fail,
  ok,
  type BookingConfirmation,
  type BookingInput,
  type BookingModality,
  type BookingProvider,
  type Result,
  type SlotDay,
  type SlotQuery,
} from "@/lib/booking-provider/types";

/** Rango máximo de días por consulta de horarios. */
export const MAX_RANGE_DAYS = 31;
/** 1 de cada N turnos aparece «ocupado» para que la agenda demo se vea realista (determinista). */
const TAKEN_EVERY = 4;
const MS_PER_MINUTE = 60_000;

interface DemoOptions {
  now?: () => Date;
  hours?: TeleconsultHours;
  roster?: readonly Doctor[];
}

/** Hash simple y estable (FNV-1a) para decidir qué turnos demo aparecen ocupados. */
function stableHash(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function doctorWindows(doctor: Doctor, date: string, modality: BookingModality): TimeWindow[] {
  const weekday = weekdayOfISO(date);
  return doctor.schedule
    .filter((block) => block.days.includes(weekday))
    .filter((block) => modality === "presencial" || block.modalities.includes("videollamada"))
    .map(({ from, to }) => ({ from, to }));
}

function daysBetween(from: string, to: string): string[] | null {
  const days: string[] = [];
  for (let day = from; day <= to; day = addDaysISO(day, 1)) {
    days.push(day);
    if (days.length > MAX_RANGE_DAYS) return null;
  }
  return days;
}

export function createDemoProvider(options: DemoOptions = {}): BookingProvider {
  const now = options.now ?? (() => new Date());
  const hours = options.hours ?? DEMO_TELECONSULT_HOURS;
  const roster = options.roster ?? publishedDoctors;

  function slotsFor(doctor: Doctor, date: string, modality: BookingModality, at: Date): number[] {
    const minutes = new Set<number>();
    for (const window of doctorWindows(doctor, date, modality)) {
      for (const start of availableSlots(hours, date, at, window)) minutes.add(start);
    }
    return [...minutes]
      .sort((a, b) => a - b)
      .filter((start) => stableHash(`${doctor.slug}|${date}|${start}`) % TAKEN_EVERY !== 0);
  }

  async function getSlots(query: SlotQuery): Promise<Result<SlotDay[]>> {
    const doctor = roster.find((d) => d.slug === query.doctorId);
    if (!doctor) return fail("not_found", "No encontramos a ese especialista.");
    const days = daysBetween(query.from, query.to);
    if (!days) return fail("validation", `Consulta como máximo ${MAX_RANGE_DAYS} días de horarios a la vez.`);
    const at = now();
    const result = days
      .map((date) => ({ date, slots: slotsFor(doctor, date, query.modality, at).map((m) => ({ start: limaSlotToISO(date, m) })) }))
      .filter((day) => day.slots.length > 0);
    return ok(result);
  }

  async function createBooking(input: BookingInput): Promise<Result<BookingConfirmation>> {
    const doctor = roster.find((d) => d.slug === input.doctorId);
    if (!doctor) return fail("not_found", "No encontramos a ese especialista.");
    const { date, minutes } = isoToLimaSlot(input.start);
    if (!slotsFor(doctor, date, input.modality, now()).includes(minutes)) {
      return fail("slot_unavailable", "Ese horario ya no está disponible. Elige otro, por favor.");
    }
    const start = limaSlotToISO(date, minutes);
    return ok({
      uid: `demo-${crypto.randomUUID()}`,
      doctorId: doctor.slug,
      modality: input.modality,
      start,
      end: new Date(Date.parse(start) + hours.slotMinutes * MS_PER_MINUTE).toISOString(),
      status: "accepted",
      // Sin enlace inventado: en demo no se crea una reunión real.
      meetingUrl: null,
      rescheduleUrl: null,
      cancelUrl: null,
      isDemo: true,
    });
  }

  async function getBooking(): Promise<Result<BookingConfirmation>> {
    return fail("not_found", "En modo demo la cita solo se guarda en este navegador.");
  }

  return {
    id: "demo",
    getSlots,
    createBooking,
    getBooking,
    getRescheduleUrl: () => null,
    getCancelUrl: () => null,
  };
}
