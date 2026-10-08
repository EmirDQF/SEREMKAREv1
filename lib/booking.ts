import { getComplaint } from "@/data/bodyZones";
import { doctors as defaultDoctors } from "@/data/doctors";
import { site } from "@/data/site";
import { EMERGENCY, MODALITY_LABEL, SINCE_OPTIONS, teleconsultSchedule } from "@/data/teleconsult";
import { describeDays, formatTime } from "@/lib/schedule";
import { availableSlots, formatSlot, weekdayOfISO } from "@/lib/slots";
import type {
  BookingDraft,
  BookingErrors,
  BookingPrefill,
  BookingStep,
  ComplaintId,
  Doctor,
  DoctorSchedule,
  Modality,
  TeleconsultHours,
} from "@/types/medical";

export const AGE_LIMITS = { min: 0, max: 120 } as const;
export const NAME_LIMITS = { min: 2, max: 80 } as const;
/** Celular peruano: 9 dígitos que empiezan en 9 (con o sin +51). */
const PERU_MOBILE = /^9\d{8}$/;
const PERU_PREFIX = "51";

type Roster = readonly Doctor[];

export const EMPTY_DRAFT: BookingDraft = {
  age: "",
  forWhom: "mi",
  complaint: null,
  intensity: null,
  since: null,
  redFlags: [],
  modality: "videollamada",
  doctorSlug: null,
  slot: null,
  fullName: "",
  phone: "",
  consent: false,
};

/** Edad entera de 0 a 120, o null si el texto no es válido. */
export function parseAge(raw: string): number | null {
  const text = raw.trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  const age = Number(text);
  return age >= AGE_LIMITS.min && age <= AGE_LIMITS.max ? age : null;
}

export function formatAge(age: number): string {
  if (age === 0) return "menos de 1 año";
  return age === 1 ? "1 año" : `${age} años`;
}

/** "+51 987-654-321" → "987 654 321", o null si no es un celular peruano. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith(PERU_PREFIX) ? digits.slice(PERU_PREFIX.length) : digits;
  if (!PERU_MOBILE.test(local)) return null;
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

export function hasRedFlags(draft: Pick<BookingDraft, "redFlags">): boolean {
  return draft.redFlags.length > 0;
}

/** Doctores que atienden esa molestia y ofrecen esa modalidad. */
export function doctorsFor(complaint: ComplaintId, modality: Modality, roster: Roster = defaultDoctors): Doctor[] {
  return roster.filter(
    (d) => d.complaints.includes(complaint) && d.schedule.some((block) => block.modalities.includes(modality)),
  );
}

/** Turnos libres de un doctor ese día en la modalidad elegida. */
export function doctorSlots(doctor: Doctor, iso: string, modality: Modality, now: Date, hours: TeleconsultHours = teleconsultSchedule): number[] {
  const weekday = weekdayOfISO(iso);
  const blocks = doctor.schedule.filter((b) => b.days.includes(weekday) && b.modalities.includes(modality));
  const starts = blocks.flatMap((block) => availableSlots(hours, iso, now, block));
  return [...new Set(starts)].sort((a, b) => a - b);
}

export function validateStep1(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {};
  if (parseAge(draft.age) === null) errors.age = `Escribe una edad entre ${AGE_LIMITS.min} y ${AGE_LIMITS.max} años.`;
  if (!draft.complaint) errors.complaint = "Elige qué te molesta para asignarte el doctor adecuado.";
  // D9: con una señal de alarma no se ofrece teleconsulta (sin excepción).
  if (hasRedFlags(draft)) errors.redFlags = `${EMERGENCY.notice} ${EMERGENCY.action}`;
  return errors;
}

export function validateStep2(draft: BookingDraft, now: Date = new Date(), roster: Roster = defaultDoctors): BookingErrors {
  const errors: BookingErrors = {};
  const candidates = doctorsFor(draft.complaint ?? "general", draft.modality, roster);
  const doctor = candidates.find((d) => d.slug === draft.doctorSlug);
  if (!draft.doctorSlug) errors.doctor = "Elige el doctor con quien quieres conversar.";
  else if (!doctor) errors.doctor = `Ese doctor no atiende por ${MODALITY_LABEL[draft.modality].toLowerCase()}. Elige otro.`;
  if (!draft.slot) errors.slot = "Elige el día y la hora de tu teleconsulta.";
  else if (doctor && !doctorSlots(doctor, draft.slot.date, draft.modality, now).includes(draft.slot.minutes)) {
    errors.slot = "Ese horario ya no está disponible. Elige otro, por favor.";
  }
  return errors;
}

export function validateStep3(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {};
  const name = draft.fullName.trim();
  if (name.length < NAME_LIMITS.min) errors.fullName = "Escribe el nombre del paciente.";
  else if (name.length > NAME_LIMITS.max) errors.fullName = `Máximo ${NAME_LIMITS.max} caracteres.`;
  if (!normalizePhone(draft.phone)) errors.phone = "Escribe un celular de 9 dígitos, por ejemplo 987 654 321.";
  if (!draft.consent) errors.consent = "Necesitamos tu autorización para la teleconsulta y el uso de tus datos.";
  return errors;
}

/** Primer paso con errores (para volver a él), o null si todo está listo para enviar. */
export function firstInvalidStep(draft: BookingDraft, now: Date = new Date(), roster: Roster = defaultDoctors): BookingStep | null {
  if (Object.keys(validateStep1(draft)).length > 0) return 1;
  if (Object.keys(validateStep2(draft, now, roster)).length > 0) return 2;
  if (Object.keys(validateStep3(draft)).length > 0) return 3;
  return null;
}

function describeComplaint(draft: BookingDraft): string {
  const parts = [draft.complaint ? getComplaint(draft.complaint).label : "Por definir"];
  if (draft.intensity !== null) parts.push(`intensidad ${draft.intensity}/10`);
  const since = SINCE_OPTIONS.find((o) => o.id === draft.since);
  if (since) parts.push(`desde hace ${since.label.toLowerCase()}`);
  return parts.join(" · ");
}

/** Mensaje de WhatsApp que el propio paciente envía (los datos solo viajan en este texto). */
export function buildTeleconsultMessage(draft: BookingDraft, doctorName: string): string {
  const age = parseAge(draft.age);
  return [
    `Hola ${site.name}, quiero agendar una teleconsulta.`,
    `• Paciente: ${draft.fullName.trim()}${age === null ? "" : `, ${formatAge(age)}`}`,
    `• Molestia: ${describeComplaint(draft)}`,
    `• Modalidad: ${MODALITY_LABEL[draft.modality]}`,
    `• Doctor/a: ${doctorName}`,
    `• Día y hora: ${draft.slot ? formatSlot(draft.slot) : "Por coordinar"}`,
    `• Celular: ${normalizePhone(draft.phone) ?? draft.phone.trim()}`,
  ].join("\n");
}

export interface ScheduleText {
  key: string;
  days: string;
  hours: string;
  modalities: string;
}

/** Bloque de horario legible: "Lunes, miércoles y viernes" · "7:00 p.m. – 10:00 p.m." · "Videollamada o llamada". */
export function describeBlock(block: DoctorSchedule): ScheduleText {
  const days = describeDays(block.days);
  const hours = `${formatTime(block.from)} – ${formatTime(block.to)}`;
  const modalities = block.modalities.map((m) => MODALITY_LABEL[m]).join(" o ");
  return { key: `${block.days.join("")}-${block.from}`, days, hours, modalities: capitalizeFirst(modalities) };
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/** ¿Ese doctor sirve para la molestia y la modalidad del borrador? */
function doctorFits(draft: BookingDraft, slug: string | null, roster: Roster): boolean {
  if (!slug || !draft.complaint) return false;
  return doctorsFor(draft.complaint, draft.modality, roster).some((d) => d.slug === slug);
}

/** Quita el doctor (y su turno) si dejó de servir tras un cambio. */
function keepDoctorIfFits(draft: BookingDraft, roster: Roster): BookingDraft {
  return doctorFits(draft, draft.doctorSlug, roster) ? draft : { ...draft, doctorSlug: null, slot: null };
}

export function withComplaint(draft: BookingDraft, complaint: ComplaintId, roster: Roster = defaultDoctors): BookingDraft {
  return keepDoctorIfFits({ ...draft, complaint }, roster);
}

export function withModality(draft: BookingDraft, modality: Modality, roster: Roster = defaultDoctors): BookingDraft {
  return keepDoctorIfFits({ ...draft, modality }, roster);
}

export function withDoctor(draft: BookingDraft, doctorSlug: string): BookingDraft {
  return doctorSlug === draft.doctorSlug ? draft : { ...draft, doctorSlug, slot: null };
}

/** Precarga desde el mapa corporal o el triage: molestia y, si encaja, el doctor recomendado. */
export function applyPrefill(draft: BookingDraft, prefill: BookingPrefill, roster: Roster = defaultDoctors): BookingDraft {
  const next = withComplaint(draft, prefill.complaint, roster);
  if (!prefill.doctorSlug || !doctorFits(next, prefill.doctorSlug, roster)) return next;
  return withDoctor(next, prefill.doctorSlug);
}
