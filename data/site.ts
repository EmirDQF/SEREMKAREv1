import { buildMapsEmbedUrl, buildMapsSearchUrl, formatAddress } from "@/lib/maps";
import { visibility } from "@/data/visibility";
import type { ClinicLocation, OpeningHours, OpeningScheduleRow, SiteConfig, WhatsAppLine } from "@/types/medical";

const MINUTES_PER_HOUR = 60;

/**
 * Posicionamiento del centro (decisión del cliente, 2026-10-22). Se usa en el hero, los metadatos
 * y el pie. Es una aspiración, no una acreditación: no se afirman certificaciones ni rankings.
 * CONFIRMAR: uso de la denominación y posibles conflictos de marca.
 */
export const CENTER_TAGLINE = "Centro de Excelencia en Reumatología";
/** Una frase para metadatos y pie. */
export const CENTER_MISSION =
  "Centro especializado en reumatología con atención integral: prevención, diagnóstico, tratamiento y seguimiento continuo para mejorar la calidad de vida del paciente reumático.";
const TIME_ZONE = "America/Lima";

/** Las 3 líneas de WhatsApp de la tarjeta de KARE SAC (no hay teléfono fijo ni correo en la tarjeta). */
const WHATSAPP_LINES: readonly WhatsAppLine[] = [
  { label: "Línea principal", display: "+51 994 931 540", number: "51994931540" },
  { label: "Línea 2", display: "+51 945 553 676", number: "51945553676" },
  { label: "Línea 3", display: "+51 922 281 624", number: "51922281624" },
];
const [PRIMARY_LINE] = WHATSAPP_LINES;

/**
 * Única fuente del contacto directo con el doctor («Hablar con el doctor», WhatsApp y llamada).
 * CONFIRMAR: cuál es el número directo del doctor; mientras tanto se usa la línea principal.
 * Con null se ocultan esos botones en todo el sitio (nunca se generan enlaces vacíos).
 */
const DOCTOR_LINE: WhatsAppLine | null = PRIMARY_LINE;

/**
 * Horario general indicado por el cliente (2026-10-22): lunes a viernes 08:00–20:00 y sábados
 * 08:00–13:00. Se muestra en la Home, /sedes, /contacto y el pie.
 * CONFIRMAR: horario por sede. Mientras `confirmed` sea false no se publica en el JSON-LD ni se
 * muestra «Abierto ahora» (el modelo OpeningHours tiene una sola franja y el sábado cierra antes).
 */
export const OPENING_SCHEDULE: readonly OpeningScheduleRow[] = [
  { days: "Lunes a viernes", shortDays: "Lun–Vie", hours: "08:00 a 20:00" },
  { days: "Sábados", shortDays: "Sáb", hours: "08:00 a 13:00" },
];

/** "Lun–Vie 08:00 a 20:00 · Sáb 08:00 a 13:00" */
export const OPENING_SCHEDULE_LABEL = OPENING_SCHEDULE.map((row) => `${row.shortDays} ${row.hours}`).join(" · ");

const PROVISIONAL_HOURS: OpeningHours = {
  days: [1, 2, 3, 4, 5, 6],
  opensAt: 8 * MINUTES_PER_HOUR,
  closesAt: 20 * MINUTES_PER_HOUR,
  timeZone: TIME_ZONE,
  label: OPENING_SCHEDULE_LABEL,
  closedLabel: "Atención con cita previa: escríbenos por WhatsApp para coordinar",
  confirmed: false, // CONFIRMAR: horario por sede
};

/** PROVISIONAL: datos de prueba, ocultos hasta tener los reales. */
const SAMPLE_EMAIL = "contacto@sermekare.com";
const SAMPLE_SOCIALS: SiteConfig["socials"] = [
    { network: "instagram", label: "Instagram", href: "https://instagram.com/sermekare" }, // PROVISIONAL
    { network: "facebook", label: "Facebook", href: "https://facebook.com/sermekare" }, // PROVISIONAL
    { network: "tiktok", label: "TikTok", href: "https://tiktok.com/@sermekare" }, // PROVISIONAL
    { network: "youtube", label: "YouTube", href: "https://youtube.com/@sermekare" }, // PROVISIONAL
];

/** CONFIRMAR: dominio real. Se define con NEXT_PUBLIC_SITE_URL al publicar (sin barra final). */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sermekare.com").replace(/\/$/, "");

const DENSITOMETRY_SERVICE = "Densitometría ósea (DXA) de columna y caderas";

type LocationInput = Omit<ClinicLocation, "mapsUrl" | "mapsEmbedUrl">;

function defineLocation(input: LocationInput): ClinicLocation {
  const address = formatAddress(input);
  return {
    ...input,
    mapsUrl: buildMapsSearchUrl(address, input.reference),
    mapsEmbedUrl: buildMapsEmbedUrl(address, input.reference),
  };
}

const LOCATIONS: readonly ClinicLocation[] = [
  defineLocation({
    id: "los-olivos",
    name: "Los Olivos",
    street: "Av. Alfredo Mendiola 5875, Urb. Villasol", // CONFIRMAR: la tarjeta dice «Lafredo Mendiola»
    district: "Los Olivos",
    city: "Lima",
    region: "Lima",
    whatsapp: PRIMARY_LINE, // CONFIRMAR: qué línea atiende cada sede
    hours: PROVISIONAL_HOURS,
    howToArrive: [
      "Sobre la Av. Alfredo Mendiola 5875, en la Urb. Villasol.",
      "Atendemos con cita previa: escríbenos por WhatsApp antes de venir.",
      // CONFIRMAR: paraderos y transporte cercano
    ],
    intro:
      "Nuestra sede de Los Olivos está sobre la Av. Alfredo Mendiola, en la Urb. Villasol. Es la más cómoda si vives en Lima Norte: Los Olivos, Comas, Independencia o San Martín de Porres.",
    nearbyDistricts: ["Los Olivos", "Comas", "Independencia", "San Martín de Porres"],
    services: [DENSITOMETRY_SERVICE],
    provisional: true,
  }),
  defineLocation({
    id: "callao",
    name: "Callao",
    placeName: "el Callao",
    street: "Av. Guardia Chalaca con Topacios", // CONFIRMAR: nombre exacto de la calle transversal
    district: "Callao", // CONFIRMAR: ¿Callao Cercado o Bellavista?
    city: "Callao",
    region: "Callao",
    reference: "Frente al Hospital Nacional Daniel Alcides Carrión",
    shortReference: "frente al Hosp. Daniel A. Carrión",
    whatsapp: PRIMARY_LINE, // CONFIRMAR: qué línea atiende cada sede
    hours: PROVISIONAL_HOURS,
    howToArrive: [
      "Frente al Hospital Nacional Daniel Alcides Carrión, sobre la Av. Guardia Chalaca.",
      "Atendemos con cita previa: escríbenos por WhatsApp antes de venir.",
      // CONFIRMAR: paraderos y transporte cercano
    ],
    intro:
      "En el Callao nos encuentras frente al Hospital Nacional Daniel Alcides Carrión, en la Av. Guardia Chalaca. Si te atiendes en el hospital o tu médico trabaja ahí, puedes hacerte la densitometría a pocos pasos.",
    nearbyDistricts: ["Callao", "Bellavista", "Ventanilla"],
    services: [DENSITOMETRY_SERVICE],
    provisional: true,
  }),
  defineLocation({
    id: "puente-piedra",
    name: "Puente Piedra",
    street: "Jr. Faustino Sarmiento", // CONFIRMAR: número de puerta; la tarjeta dice «Sermiento»
    district: "Puente Piedra",
    city: "Lima",
    region: "Lima",
    reference: "Frente al Hospital Carlos Lanfranco La Hoz",
    shortReference: "frente al Hosp. Carlos Lanfranco La Hoz",
    whatsapp: PRIMARY_LINE, // CONFIRMAR: qué línea atiende cada sede
    hours: PROVISIONAL_HOURS,
    howToArrive: [
      "Frente al Hospital Carlos Lanfranco La Hoz, en el Jr. Faustino Sarmiento.",
      "Atendemos con cita previa: escríbenos por WhatsApp antes de venir.",
      // CONFIRMAR: paraderos y transporte cercano
    ],
    intro:
      "En Puente Piedra estamos frente al Hospital Carlos Lanfranco La Hoz, en el Jr. Faustino Sarmiento. Te queda cerca si vives en Puente Piedra, Carabayllo o Ancón.",
    nearbyDistricts: ["Puente Piedra", "Carabayllo", "Ancón"],
    services: [DENSITOMETRY_SERVICE],
    provisional: true,
  }),
];

export const site: SiteConfig = {
  name: "SERMEKARE", // CONFIRMAR: nombre comercial en la web («SERMEKARE» o «KARE SAC»)
  legalName: "KARE SAC",
  taxId: undefined, // CONFIRMAR: RUC
  legalTagline: "KARE SAC — Servicios Médicos",
  slogan: "Mejorar la vida de nuestros pacientes",
  domain: new URL(SITE_URL).host,
  url: SITE_URL,
  serviceArea: "Perú",
  anchors: {
    // Texto real de la teleconsulta (index.html de SEREMKAREWEB)
    online: "Teleconsulta por videollamada: WhatsApp, Zoom o Google Meet",
    prescription: "Recibe tu plan de tratamiento y, si el doctor lo indica, la receta y las órdenes de exámenes",
  },
  timeZone: TIME_ZONE,
  locations: LOCATIONS,
  primaryLocationId: "los-olivos", // CONFIRMAR: sede principal
  whatsappLines: WHATSAPP_LINES,
  doctorLine: DOCTOR_LINE,
  defaultWhatsAppMessage: "Hola SERMEKARE, quisiera agendar una consulta.",
  // CONFIRMAR: la tarjeta no trae correo; se publica solo con visibility.email.
  email: visibility.email ? SAMPLE_EMAIL : null,
  // CONFIRMAR: redes reales; se publican solo con visibility.socials.
  socials: visibility.socials ? SAMPLE_SOCIALS : [],
  stats: {
    consultations: { value: 15000, prefix: "+", label: "consultas realizadas" }, // PROVISIONAL: la tarjeta no lo respalda
    rating: { value: 4.9, decimals: 1, label: "calificación promedio" }, // PROVISIONAL: la tarjeta no lo respalda
    years: { value: 12, prefix: "+", label: "años de experiencia" }, // PROVISIONAL: la tarjeta no lo respalda
    specialists: { value: 8, label: "especialistas" }, // PROVISIONAL: la tarjeta no lo respalda
    reviewsCount: 640, // PROVISIONAL
  },
  youtubeVideoId: "aqz-KE-bpKQ", // PROVISIONAL: video de muestra, reemplazar por el video institucional
  provisional: true,
};

export const MEDICAL_DISCLAIMER =
  "La información de esta web es orientativa y no reemplaza una consulta médica. La teleconsulta no es para emergencias: acude a emergencias o llama al SAMU 106.";
