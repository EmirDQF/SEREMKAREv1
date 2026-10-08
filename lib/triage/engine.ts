import { complaintFor, getBodyZone } from "@/data/bodyZones";
import { densitometry } from "@/data/densitometry";
import { doctors } from "@/data/doctors";
import { isSpecialtyVisible } from "@/data/specialties";
import type { BodyZoneId, ComplaintId, RedFlagId, SpecialtySlug } from "@/types/medical";

/**
 * Motor de orientación del consultorio virtual. Reglas puras, sin IA: ORIENTA, nunca
 * diagnostica. Cualquier señal de alarma corta el flujo y deriva a emergencias.
 */

export type TriageEntry =
  | { kind: "zone"; zone: BodyZoneId }
  | { kind: "condition"; slug: SpecialtySlug }
  | { kind: "bone" }
  | { kind: "unsure" };

export type DurationId = "lt6w" | "6w-3m" | "gt3m";
export type StiffnessId = "none" | "lt30" | "gt30";
export type QuestionId = "redFlags" | "entry" | "duration" | "swelling" | "stiffness" | "backPattern" | "boneRisks" | "priorExams";
export type Orientation = "desgaste" | "inflamacion" | "larga-evolucion" | "salud-osea" | "general";
export type RecommendedService = "teleconsulta" | "presencial" | "densitometria";
export type Urgency = "prioritaria" | "habitual";

export interface TriageAnswers {
  /** El paciente ya respondió el filtro de alarmas (aunque no marcara ninguna). */
  redFlagsChecked: boolean;
  redFlags: readonly RedFlagId[];
  entry: TriageEntry | null;
  duration: DurationId | null;
  swelling: boolean | null;
  stiffness: StiffnessId | null;
  /** Solo espalda: ¿mejora con el movimiento y empeora en reposo? */
  backPattern: boolean | null;
  /** Solo salud ósea: respuestas al checklist de data/densitometry.ts (id → sí/no). */
  boneRisks: Readonly<Record<string, boolean>> | null;
  priorExams: boolean | null;
}

export interface EmergencyResult {
  kind: "emergency";
  flags: readonly RedFlagId[];
}

export interface OrientationResult {
  kind: "orientation";
  orientation: Orientation;
  /** Especialidad publicada para «conoce más» (null si no hay una visible que encaje). */
  specialtySlug: SpecialtySlug | null;
  recommendedService: RecommendedService;
  /** Además del servicio recomendado, conviene una teleconsulta (p. ej. densitometría + consulta). */
  alsoTeleconsult: boolean;
  suggestedDoctorIds: readonly string[];
  urgency: Urgency;
  bringExams: boolean;
  /** Texto orientativo («Por lo que nos cuentas…»). */
  message: string;
}

export type TriageResult = EmergencyResult | OrientationResult;

export const EMPTY_ANSWERS: TriageAnswers = {
  redFlagsChecked: false,
  redFlags: [],
  entry: null,
  duration: null,
  swelling: null,
  stiffness: null,
  backPattern: null,
  boneRisks: null,
  priorExams: null,
};

const RHEUMATOLOGY = "nuestro especialista en reumatología";

const MESSAGES: Readonly<Record<Orientation, string>> = {
  inflamacion: `Por lo que nos cuentas, sería útil evaluar posibles causas como una inflamación articular. Te recomendamos una teleconsulta con ${RHEUMATOLOGY}; conviene no postergarla.`,
  desgaste: `Por lo que nos cuentas, sería útil revisar cómo la artrosis está afectando tus articulaciones. Te recomendamos una teleconsulta con ${RHEUMATOLOGY}.`,
  "larga-evolucion": `Por lo que nos cuentas, sería útil una evaluación con ${RHEUMATOLOGY} para conocer el origen de tu molestia de larga evolución.`,
  general: `Por lo que nos cuentas, sería útil una evaluación con ${RHEUMATOLOGY} para entender el origen de tu molestia.`,
  "salud-osea": `Por lo que nos cuentas, sería útil evaluar tu salud ósea con ${RHEUMATOLOGY}.`,
};

const DENSITOMETRY_MESSAGE =
  "Por lo que nos cuentas, sería útil evaluar tu salud ósea: podría ser útil una densitometría ósea (presencial, en una de nuestras sedes) y conversar los resultados en una teleconsulta.";

/** Hinchazón reciente: mejor que un médico examine la articulación en persona pronto. */
const IN_PERSON_MESSAGE =
  "Por lo que nos cuentas, conviene que un especialista te examine en persona pronto. Si la articulación empeora o aparece fiebre, acude a emergencias o llama al SAMU 106.";

function isBonePath(entry: TriageEntry | null): boolean {
  return entry?.kind === "bone" || (entry?.kind === "condition" && entry.slug === "osteoporosis");
}

/** Preguntas que aplican a estas respuestas, en orden. */
export function questionFlow(answers: TriageAnswers): QuestionId[] {
  const flow: QuestionId[] = ["redFlags"];
  if (answers.redFlags.length > 0) return flow;
  flow.push("entry");
  if (!answers.entry) return flow;
  if (isBonePath(answers.entry)) return [...flow, "boneRisks", "priorExams"];
  flow.push("duration", "swelling", "stiffness");
  if (answers.entry.kind === "zone" && answers.entry.zone === "espalda") flow.push("backPattern");
  flow.push("priorExams");
  return flow;
}

function isAnswered(question: QuestionId, answers: TriageAnswers): boolean {
  switch (question) {
    case "redFlags":
      return answers.redFlagsChecked;
    case "boneRisks":
      return answers.boneRisks !== null;
    default:
      return answers[question] !== null;
  }
}

/** Siguiente pregunta sin responder, o null si ya se puede orientar. */
export function nextQuestion(answers: TriageAnswers): QuestionId | null {
  if (answers.redFlags.length > 0) return null;
  return questionFlow(answers).find((question) => !isAnswered(question, answers)) ?? null;
}

export function isComplete(answers: TriageAnswers): boolean {
  return nextQuestion(answers) === null;
}

function hasInflammatorySigns(answers: TriageAnswers): boolean {
  return answers.swelling === true || answers.stiffness === "gt30" || answers.backPattern === true;
}

function hasBoneRisk(answers: TriageAnswers): boolean {
  return Object.entries(answers.boneRisks ?? {}).some(
    ([id, value]) => value && densitometry.checklist.some((question) => question.id === id),
  );
}

function orientationFor(answers: TriageAnswers): Orientation {
  if (isBonePath(answers.entry)) return "salud-osea";
  if (hasInflammatorySigns(answers)) return "inflamacion";
  // «Desgaste» solo si el propio paciente eligió artrosis: no se etiqueta a nadie por el tiempo.
  if (answers.entry?.kind === "condition" && answers.entry.slug === "artrosis") return "desgaste";
  if (answers.duration === "gt3m") return "larga-evolucion";
  return "general";
}

function entrySpecialty(entry: TriageEntry | null): SpecialtySlug | null {
  if (!entry) return null;
  if (entry.kind === "bone") return isSpecialtyVisible("osteoporosis") ? "osteoporosis" : null;
  if (entry.kind === "unsure") return null;
  const slug = entry.kind === "zone" ? getBodyZone(entry.zone).specialtySlug : entry.slug;
  return isSpecialtyVisible(slug) ? slug : null;
}

function entryComplaint(entry: TriageEntry | null): ComplaintId {
  if (!entry || entry.kind === "unsure") return "general";
  if (entry.kind === "bone") return "huesos";
  return complaintFor(entry.kind === "zone" ? { kind: "zone", zone: entry.zone } : { kind: "condition", slug: entry.slug });
}

/** Médicos publicados que atienden la molestia; si ninguno la declara, todos los publicados. */
function suggestedDoctors(entry: TriageEntry | null): string[] {
  const complaint = entryComplaint(entry);
  const matching = doctors.filter((doctor) => doctor.complaints.includes(complaint));
  return (matching.length > 0 ? matching : doctors).map((doctor) => doctor.slug);
}

function recommendationFor(answers: TriageAnswers, orientation: Orientation) {
  if (orientation === "salud-osea" && hasBoneRisk(answers)) {
    return { recommendedService: "densitometria" as const, alsoTeleconsult: true, message: DENSITOMETRY_MESSAGE };
  }
  if (answers.swelling === true && answers.duration === "lt6w") {
    // Una teleconsulta puede ayudar a organizar los pasos si no puede acudir pronto.
    return { recommendedService: "presencial" as const, alsoTeleconsult: true, message: IN_PERSON_MESSAGE };
  }
  return { recommendedService: "teleconsulta" as const, alsoTeleconsult: false, message: MESSAGES[orientation] };
}

/**
 * Orienta según las respuestas. Falla cerrado: sin el filtro de alarmas respondido o con
 * preguntas pendientes, lanza un error en lugar de sugerir una teleconsulta.
 */
export function triage(answers: TriageAnswers): TriageResult {
  if (answers.redFlags.length > 0) return { kind: "emergency", flags: answers.redFlags };
  if (!answers.redFlagsChecked || !isComplete(answers)) throw new Error("triage: respuestas incompletas");

  const orientation = orientationFor(answers);
  return {
    kind: "orientation",
    orientation,
    specialtySlug: entrySpecialty(answers.entry),
    ...recommendationFor(answers, orientation),
    suggestedDoctorIds: suggestedDoctors(answers.entry),
    urgency: orientation === "inflamacion" ? "prioritaria" : "habitual",
    bringExams: answers.priorExams === true,
  };
}
