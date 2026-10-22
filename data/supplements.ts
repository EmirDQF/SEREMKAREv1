import { visibility } from "@/data/visibility";
import type { Supplement, SupplementCategory, SupplementStatus } from "@/types/supplements";

/**
 * Suplementos del centro. NINGÚN producto está confirmado: sin catálogo real, /suplementos muestra
 * «Catálogo en preparación» y la Home solo las categorías.
 * CONFIRMAR: productos, marcas, presentaciones, precios, stock y registro sanitario de cada uno
 * (revisar con asesoría legal antes de publicar). CONFIRMAR: entrega a domicilio o recojo en sede.
 * Diseño de ejemplo (NO publicado): data/supplements.example.ts.
 */

export const SUPPLEMENTS_DISCLAIMER =
  "Los suplementos no son medicamentos ni reemplazan el tratamiento indicado por tu médico. Consulta antes de usarlos.";

/** CONFIRMAR: modalidad de entrega. Mientras tanto se coordina por WhatsApp. */
export const SUPPLEMENTS_DELIVERY_NOTE = "Te confirmamos por WhatsApp la disponibilidad y si puedes recogerlo en tu sede.";

export const supplementCategories: readonly SupplementCategory[] = [
  { id: "salud-osea", name: "Salud ósea", description: "Productos relacionados con el cuidado de los huesos." },
  { id: "articular", name: "Salud articular", description: "Productos relacionados con el cuidado de las articulaciones." },
  { id: "bienestar", name: "Bienestar", description: "Productos de uso general para tu día a día." },
];

/** Productos confirmados por la clínica. Vacío hasta tener los datos reales. */
const CONFIRMED_SUPPLEMENTS: readonly Supplement[] = [];

/** Productos publicados: solo con el flag activo y con registro sanitario cargado. */
export const supplements: readonly Supplement[] = visibility.supplementsCatalog
  ? CONFIRMED_SUPPLEMENTS.filter((product) => product.sanitaryRegistry !== null)
  : [];

export const SUPPLEMENT_STATUS_LABEL: Readonly<Record<SupplementStatus, string>> = {
  disponible: "Disponible",
  agotado: "Agotado por ahora",
  "por-confirmar": "Disponibilidad por confirmar",
};

export const SUPPLEMENTS_PATH = "/suplementos";
