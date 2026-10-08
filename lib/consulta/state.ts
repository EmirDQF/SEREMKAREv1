import { z } from "zod";
import type { BookingConfirmation } from "@/lib/booking-provider/types";
import { EMPTY_ANSWERS, type TriageAnswers, type TriageResult } from "@/lib/triage/engine";

/**
 * Estado del consultorio virtual. Vive en sessionStorage (se conserva al recargar y se borra al
 * cerrar la pestaña). NUNCA guarda datos personales: nombre, documento, celular y correo solo
 * existen en el formulario y viajan directo al servidor.
 */

export const CONSULTA_STORAGE_KEY = "sermekare:consulta";
const CONFIRMATION_PREFIX = "sermekare:cita:";

export type ConsultaStep = "evaluacion" | "orientacion" | "horario" | "datos";
export const STEP_ORDER: readonly ConsultaStep[] = ["evaluacion", "orientacion", "horario", "datos"];

export type ConsultaService = "teleconsulta" | "densitometria";

export interface ConsultaState {
  version: 1;
  step: ConsultaStep;
  answers: TriageAnswers;
  /** «Ya sé lo que necesito»: solo se respondió el filtro de alarmas. */
  skipped: boolean;
  service: ConsultaService | null;
  doctorId: string | null;
  slotStart: string | null;
  /** Motivo editable (precargado desde la evaluación). */
  reason: string;
}

export const INITIAL_STATE: ConsultaState = {
  version: 1,
  step: "evaluacion",
  answers: EMPTY_ANSWERS,
  skipped: false,
  service: null,
  doctorId: null,
  slotStart: null,
  reason: "",
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const entrySchema = z.union([
  z.object({ kind: z.literal("zone"), zone: z.enum(["cuello", "hombros", "manos", "espalda", "cadera", "rodillas", "pies"]) }),
  z.object({
    kind: z.literal("condition"),
    slug: z.enum(["artrosis", "artritis-reumatoide", "gota", "lupus", "fibromialgia", "osteoporosis", "espondiloartritis"]),
  }),
  z.object({ kind: z.literal("bone") }),
  z.object({ kind: z.literal("unsure") }),
]);

const answersSchema = z.object({
  redFlagsChecked: z.boolean(),
  redFlags: z.array(z.enum(["articulacion", "fiebre", "fractura", "esfinteres", "vision", "debilidad", "pecho", "aire"])),
  entry: entrySchema.nullable(),
  duration: z.enum(["lt6w", "6w-3m", "gt3m"]).nullable(),
  swelling: z.boolean().nullable(),
  stiffness: z.enum(["none", "lt30", "gt30"]).nullable(),
  backPattern: z.boolean().nullable(),
  boneRisks: z.record(z.string().max(40), z.boolean()).nullable(),
  priorExams: z.boolean().nullable(),
});

const stateSchema = z.object({
  version: z.literal(1),
  step: z.enum(["evaluacion", "orientacion", "horario", "datos"]),
  answers: answersSchema,
  skipped: z.boolean(),
  service: z.enum(["teleconsulta", "densitometria"]).nullable(),
  doctorId: z.string().regex(SLUG).max(60).nullable(),
  slotStart: z.iso.datetime({ offset: true }).nullable(),
  reason: z.string().max(500),
});

function safeJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseState(raw: string | null): ConsultaState {
  const parsed = stateSchema.safeParse(safeJson(raw));
  return parsed.success ? (parsed.data as ConsultaState) : INITIAL_STATE;
}

export function serializeState(state: ConsultaState): string {
  return JSON.stringify(state);
}

/** El filtro de alarmas está respondido y no marcó ninguna. */
function cleared(state: ConsultaState): boolean {
  return state.answers.redFlagsChecked && state.answers.redFlags.length === 0;
}

/** Reglas de navegación: nunca se llega al calendario sin pasar el filtro de alarmas. */
export function canEnter(step: ConsultaStep, state: ConsultaState): boolean {
  switch (step) {
    case "evaluacion":
      return true;
    case "orientacion":
      return state.answers.redFlagsChecked;
    case "horario":
      return cleared(state);
    case "datos":
      return cleared(state) && state.doctorId !== null && state.slotStart !== null;
  }
}

const ORIENTATION_LABEL: Readonly<Record<string, string>> = {
  inflamacion: "posible inflamación articular",
  desgaste: "artrosis referida por el paciente",
  "larga-evolucion": "molestia de larga evolución",
  "salud-osea": "evaluación de salud ósea",
  general: "evaluación general",
};

/** Resumen para las notas de la cita (lo lee el médico; no es un diagnóstico). */
export function triageNotes(result: TriageResult | null): string | null {
  if (!result || result.kind !== "orientation") return null;
  return [
    `Orientación de la web: ${ORIENTATION_LABEL[result.orientation] ?? result.orientation}`,
    `Prioridad: ${result.urgency}`,
    `Exámenes previos: ${result.bringExams ? "sí" : "no"}`,
  ].join(". ");
}

export const confirmationKey = (uid: string) => `${CONFIRMATION_PREFIX}${uid}`;

const confirmationSchema = z.object({
  uid: z.string().regex(/^[A-Za-z0-9_-]{6,80}$/),
  doctorId: z.string().max(60),
  modality: z.enum(["meet", "presencial"]),
  start: z.iso.datetime({ offset: true }),
  end: z.iso.datetime({ offset: true }),
  status: z.enum(["accepted", "pending", "cancelled"]),
  meetingUrl: z.url({ protocol: /^https$/ }).nullable(),
  rescheduleUrl: z.url({ protocol: /^https$/ }).nullable(),
  cancelUrl: z.url({ protocol: /^https$/ }).nullable(),
  isDemo: z.boolean(),
});

/** Confirmación guardada en este navegador (validada: nada de enlaces que no sean https). */
export function parseConfirmation(raw: string | null): BookingConfirmation | null {
  const parsed = confirmationSchema.safeParse(safeJson(raw));
  return parsed.success ? parsed.data : null;
}
