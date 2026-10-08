import { visibility } from "@/data/visibility";
import type { Modality, RedFlag, SinceId, TeleconsultHours } from "@/types/medical";

const MINUTES_PER_HOUR = 60;

/**
 * Horario real de la teleconsulta. CONFIRMAR: el index.html de SEREMKAREWEB lo deja como
 * [HORARIO_TELECONSULTA]. Mientras sea null, la UI muestra «Horario por confirmar».
 */
export const TELECONSULT_HOURS = null as TeleconsultHours | null;

/**
 * Horario simulado SOLO para el modo demo (agenda sin Cal.com). No es un dato real:
 * toda pantalla que lo use muestra la etiqueta «demo».
 */
export const DEMO_TELECONSULT_HOURS: TeleconsultHours = {
  days: [1, 2, 3, 4, 5],
  opensAt: 9 * MINUTES_PER_HOUR,
  closesAt: 22 * MINUTES_PER_HOUR,
  slotMinutes: 30,
  minLeadMinutes: 60,
  timeZone: "America/Lima",
  label: "Horario de demostración",
  shortLabel: "Horario demo",
  closedLabel: "Horario por confirmar",
  confirmed: false,
};

/** Horario con el que se calculan los turnos: el real si existe; si no, el de demostración. */
export const teleconsultSchedule: TeleconsultHours = TELECONSULT_HOURS ?? DEMO_TELECONSULT_HOURS;
export const isDemoSchedule = TELECONSULT_HOURS === null;

/** Texto público del horario: nunca muestra el horario demo como si fuera real. */
export const TELECONSULT_HOURS_LABEL = TELECONSULT_HOURS?.label ?? "Horario por confirmar";

export const MODALITY_LABEL: Readonly<Record<Modality, string>> = {
  videollamada: "Videollamada",
  llamada: "Llamada",
};

export const MODALITY_HINT: Readonly<Record<Modality, string>> = {
  // Texto real (index.html): «WhatsApp, Zoom o Google Meet (el que prefieras)».
  videollamada: "Por WhatsApp, Zoom o Google Meet, desde tu celular, tablet o computadora",
  llamada: "Si tu internet es lento o prefieres solo voz",
};

/** Modalidades publicadas (D8: la llamada telefónica no figura en el material real). */
export const ENABLED_MODALITIES: readonly Modality[] = visibility.phoneCallModality
  ? ["videollamada", "llamada"]
  : ["videollamada"];

/** Señales de alarma: si alguna aplica, la teleconsulta no es el canal adecuado. */
export const RED_FLAGS: readonly RedFlag[] = [
  { id: "fractura", label: "Golpe fuerte con deformidad o posible fractura reciente" },
  { id: "pecho", label: "Dolor de pecho" },
  { id: "aire", label: "Falta de aire" },
  { id: "fiebre", label: "Fiebre con una articulación muy hinchada y caliente" },
  { id: "debilidad", label: "Pérdida súbita de fuerza o de sensibilidad (cara, brazo o pierna)" },
];

export const SINCE_OPTIONS: readonly { id: SinceId; label: string }[] = [
  { id: "dias", label: "Días" },
  { id: "semanas", label: "Semanas" },
  { id: "meses", label: "Meses" },
  { id: "anos", label: "Años" },
];

export const EMERGENCY = {
  notice: "La teleconsulta no es para emergencias.",
  action: "Acude a emergencias o llama al SAMU 106.",
  phone: "106",
} as const;
