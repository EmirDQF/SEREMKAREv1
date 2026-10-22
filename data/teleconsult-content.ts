import { PAYMENT_METHODS } from "@/data/pricing";
import { TELECONSULT_HOURS } from "@/data/teleconsult";
import type { FAQItem } from "@/types/medical";

/**
 * Contenido real de la teleconsulta, tomado del index.html de SEREMKAREWEB (solo lectura).
 * Lo que ese material no dice queda como null y la UI lo muestra como «Por confirmar».
 */

export const PENDING = "Por confirmar";

/** Datos operativos aún no publicados por la clínica. */
export const teleconsultFacts = {
  price: null as number | null, // CONFIRMAR (index.html no publica monto)
  paymentMethods: PAYMENT_METHODS, // CONFIRMAR: [METODOS_PAGO]
  hoursLabel: TELECONSULT_HOURS?.label ?? null, // CONFIRMAR: [HORARIO_TELECONSULTA]
  durationMinutes: null as number | null, // CONFIRMAR
  cancellationPolicy: null as string | null, // CONFIRMAR
  connectionIssuesPolicy: null as string | null, // CONFIRMAR
  linkDelivery: null as string | null, // CONFIRMAR: cuándo y por qué medio llega el enlace
} as const;

export const teleconsultHero = {
  eyebrow: "Consulta virtual · Todo el Perú",
  title: "Consulta reumatológica virtual: atención sin traslados por videollamada",
  lead: "Si tienes dolor de rodilla, artritis, artrosis, lupus u osteoporosis, puedes atenderte con un reumatólogo desde casa. Es ideal si te cuesta movilizarte o si vives fuera de Lima: te escuchamos, revisamos tus exámenes y te acompañamos en tu tratamiento.",
  platforms: ["WhatsApp Videollamada", "Zoom", "Google Meet"],
  law: "Atención conforme a la Ley Marco de Telesalud (Ley N.º 30421)",
} as const;

/** Motivos que nombra el material real. */
export const teleconsultReasons = ["Dolor de rodilla", "Artritis", "Artrosis", "Lupus", "Osteoporosis"] as const;

/** Qué incluye (JSON-LD del material real). */
export const teleconsultIncludes = [
  "Revisión de exámenes previos",
  "Plan de tratamiento",
  "Receta digital, si el doctor lo indica",
  "Órdenes de exámenes, si el doctor lo indica",
  "Seguimiento",
] as const;

export interface GuideStep {
  title: string;
  body: string;
  /** Datos que la clínica aún debe confirmar en este paso. */
  pending: readonly string[];
}

/** Guía de 5 pasos del paciente (texto real; lo no publicado, marcado como pendiente). */
export const teleconsultGuide: readonly GuideStep[] = [
  {
    title: "Solicitud y agendamiento",
    body: "Elige tu horario aquí en la web o escríbenos por WhatsApp. Te atiende el Dr. Daniel Ccolcca, médico reumatólogo.",
    pending: teleconsultFacts.hoursLabel ? [] : ["Horario de atención"],
  },
  {
    title: "Tus datos y exámenes",
    body: "Cuéntanos tus síntomas y envía tus exámenes previos (análisis, densitometría, ecografías) por WhatsApp, en foto o PDF.",
    pending: [],
  },
  {
    title: "Pago y confirmación",
    body: "Al agendar por WhatsApp te confirmamos el monto, el momento del pago y los datos para pagar.",
    pending: ["Precio", "Medios de pago"],
  },
  {
    title: "Conexión a la cita",
    body: "Videollamada personalizada: conversa con el Dr. Ccolcca por Zoom, Meet o WhatsApp, el que prefieras.",
    pending: ["Cuándo llega el enlace"],
  },
  {
    title: "Plan de tratamiento y seguimiento",
    body: "Al terminar la videollamada recibes en formato digital tu plan de tratamiento y, si el doctor lo indica, la receta y las órdenes de exámenes, además de las indicaciones para tu seguimiento.",
    pending: ["Duración de la consulta"],
  },
];

/** Cuándo la teleconsulta NO sirve (texto del consentimiento de /terminos). */
export const teleconsultLimits = {
  physicalExam:
    "La teleconsulta no permite un examen físico completo. Si el médico lo considera necesario, te indicará una evaluación presencial o exámenes complementarios.",
  emergency:
    "No es un servicio para emergencias. Ante una emergencia acude al servicio de emergencias más cercano o llama al SAMU 106.",
} as const;

export const teleconsultRequirements = {
  devices: "Un celular, tablet o computadora con cámara, micrófono e internet estable.",
  apps: "WhatsApp, Zoom o Google Meet (el que prefieras).",
  documents: "Ten a la mano tus exámenes previos y la lista de medicamentos que tomas.",
} as const;

/** Las 5 FAQ del material real, con su redacción original (y [METODOS_PAGO] → «por confirmar»). */
export const teleconsultFaq: readonly FAQItem[] = [
  {
    id: "tele-necesito",
    question: "¿Qué necesito para la consulta virtual?",
    answer:
      "Un celular, tablet o computadora con cámara, micrófono e internet estable, y WhatsApp, Zoom o Google Meet (el que prefieras). Ten a la mano tus exámenes previos y la lista de medicamentos que tomas.",
  },
  {
    id: "tele-pago",
    question: "¿Cómo y cuándo pago?",
    answer: `Al agendar por WhatsApp te confirmamos el monto, el momento del pago y los datos para pagar. Métodos de pago: ${
      PAYMENT_METHODS.length > 0 ? PAYMENT_METHODS.join(", ") : "por confirmar"
    }.`,
  },
  {
    id: "tele-receta",
    question: "¿Recibo receta y órdenes de exámenes?",
    answer:
      "Sí. Al terminar la videollamada recibes en formato digital tu plan de tratamiento y, si el doctor lo indica, la receta y las órdenes de exámenes, además de las indicaciones para tu seguimiento.",
  },
  {
    id: "tele-examenes",
    question: "¿Puedo enviar mis exámenes antes?",
    answer:
      "Sí, y te lo recomendamos. Envíalos por WhatsApp (foto o PDF) al agendar: análisis de laboratorio, densitometrías, ecografías, radiografías o informes previos. Así el doctor puede revisarlos antes de la videollamada.",
  },
  {
    id: "tele-presencial",
    question: "¿Y si necesito un examen presencial (densitometría o ecografía)?",
    answer:
      "Si el doctor lo considera necesario, puedes realizarte la densitometría ósea en una de nuestras sedes. Conoce nuestros servicios de diagnóstico.",
  },
  {
    id: "tele-emergencia",
    question: "¿La teleconsulta sirve para emergencias?",
    answer: "No. La teleconsulta no es para emergencias: acude a emergencias o llama al SAMU 106.",
  },
];
