import { buildMapsEmbedUrl, buildMapsSearchUrl, formatAddress } from "@/lib/maps";
import { visibility } from "@/data/visibility";
import type { ClinicLocation, OpeningHours, SiteConfig, WhatsAppLine } from "@/types/medical";

const MINUTES_PER_HOUR = 60;
const TIME_ZONE = "America/Lima";

/** Las 3 líneas de WhatsApp de la tarjeta de KARE SAC (no hay teléfono fijo ni correo en la tarjeta). */
const WHATSAPP_LINES: readonly WhatsAppLine[] = [
  { label: "Línea principal", display: "+51 994 931 540", number: "51994931540" },
  { label: "Línea 2", display: "+51 945 553 676", number: "51945553676" },
  { label: "Línea 3", display: "+51 922 281 624", number: "51922281624" },
];
const [PRIMARY_LINE] = WHATSAPP_LINES;

/**
 * PROVISIONAL: la tarjeta solo dice «Atención con cita previa». Los días y horas no se muestran
 * ni se publican en el JSON-LD mientras `confirmed` sea false.
 */
const PROVISIONAL_HOURS: OpeningHours = {
  days: [1, 2, 3, 4, 5, 6],
  opensAt: 8 * MINUTES_PER_HOUR,
  closesAt: 20 * MINUTES_PER_HOUR,
  timeZone: TIME_ZONE,
  label: "Atención con cita previa",
  closedLabel: "Escríbenos por WhatsApp para coordinar tu cita",
  confirmed: false,
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
