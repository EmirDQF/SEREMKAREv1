/**
 * Tarifas. NINGÚN precio está confirmado: el material real (index.html de SEREMKAREWEB) dice
 * «Al agendar por WhatsApp te confirmamos el monto, el momento del pago y los datos para pagar»
 * y deja [METODOS_PAGO] vacío. Mientras el valor sea null, la UI muestra «Precio por confirmar».
 */

export type PricingId = "teleconsulta" | "densitometria" | "densitometria-teleconsulta";

export interface PricingItem {
  id: PricingId;
  name: string;
  summary: string;
  /** En soles (S/). null = por confirmar. */
  price: number | null;
  /** Duración en minutos. null = por confirmar. */
  durationMinutes: number | null;
  /** Lo que incluye, tomado del material real. */
  includes: readonly string[];
  /** Servicio a preseleccionar en /consulta-virtual. */
  service: "teleconsulta" | "densitometria";
  modality: string;
}

export const PRICE_PENDING = "Precio por confirmar";
export const PAYMENT_PENDING = "Medios de pago por confirmar";

export const pricing: readonly PricingItem[] = [
  {
    id: "teleconsulta",
    name: "Teleconsulta reumatológica",
    summary: "Consulta por videollamada con el Dr. Daniel Ccolcca, desde cualquier lugar del Perú.",
    price: null, // CONFIRMAR: index.html → [METODOS_PAGO] y monto no publicados
    durationMinutes: null, // CONFIRMAR
    includes: [
      "Videollamada por WhatsApp, Zoom o Google Meet",
      "Revisión de tus exámenes previos (foto o PDF)",
      "Plan de tratamiento en formato digital",
      "Receta y órdenes de exámenes, si el doctor lo indica",
      "Indicaciones para tu seguimiento",
    ],
    service: "teleconsulta",
    modality: "Virtual · todo el Perú",
  },
  {
    id: "densitometria",
    name: "Densitometría ósea (DXA)",
    summary: "Evaluación de columna y caderas para la detección oportuna de osteoporosis.",
    price: null, // CONFIRMAR: precio de la densitometría (o «no publicar»)
    durationMinutes: null,
    includes: ["Columna lumbar y caderas", "Resultados claros y confiables", "Atención con cita previa"],
    service: "densitometria",
    modality: "Presencial · 3 sedes",
  },
  {
    id: "densitometria-teleconsulta",
    name: "Densitometría + teleconsulta",
    summary: "Haz tu densitometría en la sede y conversa los resultados por videollamada.",
    price: null, // CONFIRMAR: si existe un paquete
    durationMinutes: null,
    includes: ["Densitometría ósea presencial", "Teleconsulta para revisar los resultados"],
    service: "densitometria",
    modality: "Presencial + virtual",
  },
];

/** "S/ 120" o «Precio por confirmar». */
export function formatPrice(price: number | null): string {
  return price === null ? PRICE_PENDING : `S/ ${price.toLocaleString("es-PE")}`;
}

/** Métodos de pago reales. CONFIRMAR: index.html → [METODOS_PAGO]. */
export const PAYMENT_METHODS: readonly string[] = [];

export function getPricing(id: PricingId): PricingItem {
  const item = pricing.find((p) => p.id === id);
  if (!item) throw new Error(`Pricing not found: ${id}`);
  return item;
}
