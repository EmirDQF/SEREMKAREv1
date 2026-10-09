import { visibility } from "@/data/visibility";
import type { BlogPost, Insurer, PainPoint } from "@/types/medical";

const unsplash = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/** Fotos de la Home. PROVISIONAL: ver public/images/README.md */
export const homeImages = {
  // Fotos ilustrativas de videoconsulta (Unsplash, licencia libre). No son personal de SERMEKARE.
  hero: unsplash("1758691463620-188ca7c1a04f", 1000),
  heroAlt: "Médico en una videoconsulta con su paciente desde la laptop (foto ilustrativa)",
  careJourney: unsplash("1758691462858-f1286e5daf40", 900),
  careJourneyAlt: "Médica conversando con un paciente adulto mayor en el consultorio",
  guided: unsplash("1666214280557-f1b5022eb634", 1000),
  guidedAlt: "Especialista revisando imágenes de ecografía en un monitor",
  telemedicine: unsplash("1758691461932-d0aa0ebf6b31", 900),
  telemedicineAlt: "Médico conversando con una paciente por videollamada (foto ilustrativa)",
  stepBook: unsplash("1758691462749-a95ce1bd7f96", 700),
  stepBookAlt: "Médica conectada a una videoconsulta desde su escritorio (foto ilustrativa)",
  stepLink: unsplash("1758691462743-f9fc9e430d39", 700),
  stepLinkAlt: "Videollamada médica en curso en una laptop (foto ilustrativa)",
  stepReview: unsplash("1758691463606-1493d79cc577", 700),
  stepReviewAlt: "Especialista revisando el caso de su paciente durante la videoconsulta (foto ilustrativa)",
  video: unsplash("1649751361457-01d3a696c7e6", 1200),
  videoAlt: "Especialista examinando la rodilla de un paciente en la camilla",
} as const;

export const painPoints: readonly PainPoint[] = [
  {
    id: "manos",
    quote: "Mis manos amanecen rígidas",
    context: "Si dura más de 30 minutos, puede ser inflamación.",
    target: { kind: "zone", zone: "manos" },
  },
  {
    id: "espalda",
    quote: "Me duele la espalda después de un día frente a la computadora",
    context: "El dolor postural tiene solución con un plan guiado.",
    target: { kind: "zone", zone: "espalda" },
  },
  {
    id: "corriendo",
    quote: "Me lesioné corriendo y no mejora",
    context: "Vemos la lesión por ecografía en la misma consulta.",
    target: { kind: "zone", zone: "rodillas" },
  },
  {
    id: "hinchazon",
    quote: "Mis articulaciones se hinchan sin razón",
    context: "Detectar a tiempo una enfermedad autoinmune cambia su evolución.",
    target: { kind: "condition", slug: "artritis-reumatoide" },
  },
  {
    id: "mama",
    quote: "Quiero cuidar los huesos de mi mamá",
    context: "Densitometría y prevención de caídas en una sola visita.",
    target: { kind: "condition", slug: "osteoporosis" },
  },
];

// PROVISIONAL: logos genéricos. No usar marcas reales hasta firmar convenios.
const sampleInsurers: readonly Insurer[] = [
  { id: "a", label: "Aseguradora A", kind: "seguro" },
  { id: "b", label: "EPS B", kind: "eps" },
  { id: "c", label: "Seguro de salud C", kind: "seguro" },
  { id: "d", label: "EPS D", kind: "eps" },
  { id: "e", label: "Aseguradora E", kind: "seguro" },
  { id: "f", label: "Red de laboratorios aliada", kind: "alianza" },
  { id: "g", label: "Programa empresas", kind: "alianza" },
  { id: "h", label: "Clínica aliada", kind: "alianza" },
];

/** Aseguradoras publicadas: ninguna hasta firmar convenios (D2). */
export const insurers: readonly Insurer[] = visibility.insurers ? sampleInsurers : [];

// Metadatos del blog (el contenido MDX llega en el bloque 4).
export const blogPosts: readonly BlogPost[] = [
  {
    slug: "infiltraciones-guiadas-vs-a-ciegas",
    title: "Infiltración guiada por ecografía vs a ciegas: ¿qué cambia para ti?",
    excerpt: "La precisión importa: te explicamos por qué ver la articulación en tiempo real mejora la experiencia y los resultados.",
    category: "Procedimientos",
    readingMinutes: 6,
    authorSlug: null,
    publishedAt: "2026-09-22",
    cover: unsplash("1666214280391-8ff5bd3c0bf0"),
    coverAlt: "Dos especialistas revisando imágenes médicas en monitores",
  },
  {
    slug: "dolor-lumbar-trabajo-oficina",
    title: "Dolor lumbar por trabajo de oficina: 5 señales para consultar",
    excerpt: "Sentarte 8 horas pasa factura. Aprende a distinguir un dolor postural de uno que necesita evaluación.",
    category: "Dolor de espalda",
    readingMinutes: 5,
    authorSlug: null,
    publishedAt: "2026-09-08",
    cover: unsplash("1573496359142-b8d87734a5a2"),
    coverAlt: "Profesional sentada en su oficina",
  },
  {
    slug: "lesiones-en-corredores",
    title: "Lesiones en corredores: cuándo parar y cómo volver a correr",
    excerpt: "Rodilla, tendón de Aquiles y fascia plantar: guía práctica para no convertir una molestia en lesión crónica.",
    category: "Deporte",
    readingMinutes: 7,
    authorSlug: null,
    publishedAt: "2026-08-25",
    cover: unsplash("1476480862126-209bfaa8edc8"),
    coverAlt: "Piernas de una persona corriendo escaleras arriba",
  },
  {
    slug: "dolor-de-cuello",
    title: "Dolor de cuello: postura, estrés y cuándo preocuparte",
    excerpt: "Ejercicios simples, pausas activas y las señales de alerta que no debes ignorar.",
    category: "Dolor de cuello",
    readingMinutes: 5,
    authorSlug: null,
    publishedAt: "2026-08-11",
    cover: unsplash("1576091160550-2173dba999ef"),
    coverAlt: "Manos sobre un teclado junto a un estetoscopio",
  },
  {
    slug: "caidas-en-el-adulto-mayor",
    title: "Caídas en el adulto mayor: cómo proteger los huesos de tus padres",
    excerpt: "Osteoporosis, densitometría y cambios en casa que reducen el riesgo de fracturas.",
    category: "Osteoporosis",
    readingMinutes: 6,
    authorSlug: null,
    publishedAt: "2026-07-28",
    cover: unsplash("1631217868264-e5b90bb7e133"),
    coverAlt: "Doctora conversando con una paciente adulta mayor",
  },
  {
    slug: "gota-y-dieta",
    title: "Gota y dieta: qué comer (y qué evitar) para prevenir crisis",
    excerpt: "Mitos y verdades sobre el ácido úrico, con recomendaciones prácticas de nuestro equipo.",
    category: "Gota",
    readingMinutes: 6,
    authorSlug: null,
    publishedAt: "2026-07-14",
    cover: unsplash("1505751172876-fa1923c5c528"),
    coverAlt: "Estetoscopio sobre una superficie clara",
  },
];
