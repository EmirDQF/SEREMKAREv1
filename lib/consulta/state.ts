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
const UID = /^[A-Za-z0-9_-]{6,80}$/;
const REASON_MAX = 500;

/*
 * Validación manual (sin zod) para no sumar ~90 KB al JS inicial: estos datos vienen de
 * sessionStorage del propio navegador, pero igual se validan antes de usarlos.
 */
const ZONES = new Set(["cuello", "hombros", "manos", "espalda", "cadera", "rodillas", "pies"]);
const CONDITIONS = new Set(["artrosis", "artritis-reumatoide", "gota", "lupus", "fibromialgia", "osteoporosis", "espondiloartritis"]);
const RED_FLAG_IDS = new Set(["articulacion", "fiebre", "fractura", "esfinteres", "vision", "debilidad", "pecho", "aire"]);
const STEPS = new Set<string>(STEP_ORDER);

type Unknown = Record<string, unknown>;
const isObject = (value: unknown): value is Unknown => typeof value === "object" && value !== null && !Array.isArray(value);
const isNullableBool = (value: unknown) => value === null || typeof value === "boolean";
const isOneOf = (value: unknown, options: readonly string[]) => value === null || (typeof value === "string" && options.includes(value));
const isIsoDate = (value: unknown): value is string => typeof value === "string" && !Number.isNaN(Date.parse(value)) && /^\d{4}-\d{2}-\d{2}T/.test(value);
const isHttpsOrNull = (value: unknown) => value === null || (typeof value === "string" && /^https:\/\/[^\s]+$/.test(value));

function isEntry(value: unknown): boolean {
  if (value === null) return true;
  if (!isObject(value)) return false;
  switch (value.kind) {
    case "zone":
      return typeof value.zone === "string" && ZONES.has(value.zone);
    case "condition":
      return typeof value.slug === "string" && CONDITIONS.has(value.slug);
    case "bone":
    case "unsure":
      return true;
    default:
      return false;
  }
}

function isBoneRisks(value: unknown): boolean {
  return value === null || (isObject(value) && Object.entries(value).every(([key, flag]) => key.length <= 40 && typeof flag === "boolean"));
}

function isAnswers(value: unknown): value is TriageAnswers {
  return (
    isObject(value) &&
    typeof value.redFlagsChecked === "boolean" &&
    Array.isArray(value.redFlags) &&
    value.redFlags.every((flag) => typeof flag === "string" && RED_FLAG_IDS.has(flag)) &&
    isEntry(value.entry) &&
    isOneOf(value.duration, ["lt6w", "6w-3m", "gt3m"]) &&
    isNullableBool(value.swelling) &&
    isOneOf(value.stiffness, ["none", "lt30", "gt30"]) &&
    isNullableBool(value.backPattern) &&
    isBoneRisks(value.boneRisks) &&
    isNullableBool(value.priorExams)
  );
}

function isState(value: unknown): value is ConsultaState {
  return (
    isObject(value) &&
    value.version === 1 &&
    typeof value.step === "string" &&
    STEPS.has(value.step) &&
    isAnswers(value.answers) &&
    typeof value.skipped === "boolean" &&
    isOneOf(value.service, ["teleconsulta", "densitometria"]) &&
    (value.doctorId === null || (typeof value.doctorId === "string" && value.doctorId.length <= 60 && SLUG.test(value.doctorId))) &&
    (value.slotStart === null || isIsoDate(value.slotStart)) &&
    typeof value.reason === "string" &&
    value.reason.length <= REASON_MAX
  );
}

function safeJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseState(raw: string | null): ConsultaState {
  const value = safeJson(raw);
  return isState(value) ? value : INITIAL_STATE;
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

function isConfirmation(value: unknown): value is BookingConfirmation {
  return (
    isObject(value) &&
    typeof value.uid === "string" &&
    UID.test(value.uid) &&
    typeof value.doctorId === "string" &&
    value.doctorId.length <= 60 &&
    (value.modality === "meet" || value.modality === "presencial") &&
    isIsoDate(value.start) &&
    isIsoDate(value.end) &&
    (value.status === "accepted" || value.status === "pending" || value.status === "cancelled") &&
    isHttpsOrNull(value.meetingUrl) &&
    isHttpsOrNull(value.rescheduleUrl) &&
    isHttpsOrNull(value.cancelUrl) &&
    typeof value.isDemo === "boolean"
  );
}

/** Confirmación guardada en este navegador (validada: nada de enlaces que no sean https). */
export function parseConfirmation(raw: string | null): BookingConfirmation | null {
  const value = safeJson(raw);
  return isConfirmation(value) ? value : null;
}
