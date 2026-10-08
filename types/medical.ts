/** Teleconsulta por videollamada o por llamada telefónica. */
export type Modality = "videollamada" | "llamada";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface OpeningHours {
  /** Días de atención (0 = domingo … 6 = sábado). */
  days: readonly Weekday[];
  /** Inicio de la atención, en minutos desde medianoche. */
  opensAt: number;
  /** Fin de la atención, en minutos desde medianoche (el último turno termina a esta hora). */
  closesAt: number;
  timeZone: string;
  /** "Lunes a viernes · 7:00 p.m. – 10:00 p.m." */
  label: string;
  closedLabel: string;
  /** Solo si es true se muestra «Abierto ahora / Cerrado» y se publica en el JSON-LD. */
  confirmed: boolean;
}

/** Horario de teleconsulta: además de la franja, la duración de cada turno. */
export interface TeleconsultHours extends OpeningHours {
  /** Duración de cada turno de teleconsulta, en minutos. */
  slotMinutes: number;
  /** Anticipación mínima para reservar un turno de hoy, en minutos. */
  minLeadMinutes: number;
  /** "Lun–Vie desde 7:00 p.m." (badges y espacios reducidos) */
  shortLabel: string;
}

export type LocationId = "los-olivos" | "callao" | "puente-piedra";

/** Sede elegida en el formulario: una sede concreta o «la más cercana / no sé». */
export type LocationChoice = LocationId | "cualquiera";

export interface WhatsAppLine {
  label: string;
  /** Como se muestra: "+51 994 931 540". */
  display: string;
  /** Para wa.me y tel:, solo dígitos con código de país: "51994931540". */
  number: string;
}

export interface ClinicLocation {
  id: LocationId;
  name: string;
  /** Cómo se nombra el lugar en una frase: «en el Callao». Por defecto, el nombre. */
  placeName?: string;
  street: string;
  district: string;
  city: string;
  region: string;
  /** Referencia para llegar (p. ej. «Frente al Hospital …»). Es lo que más ayuda al paciente. */
  reference?: string;
  /** Versión corta de la referencia para mensajes de WhatsApp. */
  shortReference?: string;
  whatsapp: WhatsAppLine;
  hours: OpeningHours;
  mapsUrl: string;
  mapsEmbedUrl: string;
  /** Solo con coordenadas confirmadas. */
  geo?: { lat: number; lng: number };
  howToArrive: readonly string[];
  /** Presentación propia de la sede (página /sedes/[slug]). */
  intro: string;
  /** Distritos cercanos que atiende la sede (SEO local y areaServed). */
  nearbyDistricts: readonly string[];
  /** Estudios disponibles en esta sede. */
  services: readonly string[];
  provisional: boolean;
}

/** Franja horaria en minutos desde medianoche: [from, to). */
export interface TimeWindow {
  from: number;
  to: number;
}

/** Turno concreto: fecha ISO (AAAA-MM-DD, hora de Lima) y minuto de inicio. */
export interface Slot {
  date: string;
  minutes: number;
}

export interface SocialLink {
  network: "instagram" | "facebook" | "tiktok" | "youtube";
  label: string;
  href: string;
}

export interface TrustStat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export interface SiteConfig {
  name: string;
  /** Razón social que figura en la tarjeta y en los documentos legales. */
  legalName: string;
  /** RUC (obligatorio para el Libro de Reclamaciones). */
  taxId?: string;
  legalTagline: string;
  slogan: string;
  domain: string;
  url: string;
  /** País donde se atiende por teleconsulta. */
  serviceArea: string;
  /** Mensajes ancla de la teleconsulta. */
  anchors: { online: string; prescription: string };
  timeZone: string;
  locations: readonly ClinicLocation[];
  primaryLocationId: LocationId;
  /** Las líneas de WhatsApp de la empresa; la primera es la principal. */
  whatsappLines: readonly WhatsAppLine[];
  defaultWhatsAppMessage: string;
  /** null = sin correo real confirmado (la tarjeta no trae correo): no se muestra. */
  email: string | null;
  socials: readonly SocialLink[];
  stats: {
    consultations: TrustStat;
    rating: TrustStat;
    years: TrustStat;
    specialists: TrustStat;
    reviewsCount: number;
  };
  youtubeVideoId: string;
  provisional: boolean;
}

export type SpecialtySlug =
  | "artrosis"
  | "artritis-reumatoide"
  | "gota"
  | "lupus"
  | "fibromialgia"
  | "osteoporosis"
  | "espondiloartritis";

export interface Specialty {
  slug: SpecialtySlug;
  name: string;
  shortName: string;
  summary: string;
  symptoms: readonly string[];
  alertSigns: readonly string[];
  approach: string;
  doctorSlug: string;
  /** Si aparece como chip en el triage por condición. */
  inTriage: boolean;
  provisional: boolean;
}

export interface Service {
  name: string;
  description?: string;
}

export interface ServicePillar {
  slug: string;
  name: string;
  tagline: string;
  icon: IconName;
  services: readonly Service[];
  /** Tamaño en la grilla bento de la Home. */
  size: "lg" | "md" | "sm";
}

export interface Treatment {
  slug: string;
  name: string;
  summary: string;
  indicatedFor: string;
  benefits: readonly string[];
  duration: string;
  icon: IconName;
  provisional: boolean;
}

/** Bloque de atención de un doctor: días hábiles, franja (desde las 7 p.m.) y modalidades. */
export interface DoctorSchedule extends TimeWindow {
  days: readonly Weekday[];
  modalities: readonly Modality[];
}

export interface Doctor {
  slug: string;
  name: string;
  title: string;
  specialty: string;
  /** null = por confirmar (no se inventa). */
  cmp: string | null;
  rne: string | null;
  yearsOfExperience: number | null;
  education: readonly string[];
  focus: readonly string[];
  /** null = sin foto real todavía: se muestra un retrato con iniciales. */
  photo: string | null;
  photoAlt: string;
  /** Iniciales para el retrato provisional ("DC"). */
  initials: string;
  /** Médico de muestra (ficticio): se oculta con visibility.sampleDoctors. */
  sample: boolean;
  /** IDs de los tipos de evento de Cal.com por modalidad (null = sin configurar → modo demo). */
  booking: { calEventTypeIds: { meet: number | null; presencial: number | null } };
  /** Molestias que atiende (filtra las tarjetas del agendador). */
  complaints: readonly ComplaintId[];
  schedule: readonly DoctorSchedule[];
  provisional: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  age: number;
  condition: string;
  specialtySlug: SpecialtySlug;
  treatmentTime: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  featured?: boolean;
  provisional: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  /** null = equipo editorial (los artículos no tienen autor médico confirmado). */
  authorSlug: string | null;
  publishedAt: string;
  cover: string;
  coverAlt: string;
}

export type BodyZoneId =
  | "cuello"
  | "hombros"
  | "manos"
  | "espalda"
  | "cadera"
  | "rodillas"
  | "pies";

export interface BodyZone {
  id: BodyZoneId;
  label: string;
  possibleCauses: string;
  alertSigns: readonly string[];
  approach: string;
  specialtySlug: SpecialtySlug;
  doctorSlug: string;
}

export interface PainPoint {
  id: string;
  quote: string;
  context: string;
  target: { kind: "zone"; zone: BodyZoneId } | { kind: "condition"; slug: SpecialtySlug };
}

export interface Insurer {
  id: string;
  label: string;
  kind: "eps" | "seguro" | "alianza";
}

export type AppointmentFor = "mi" | "familiar";
/** @deprecated Formulario de una sola pantalla; lo reemplaza BookingDraft (asistente de 3 pasos, fase C). */
export interface Appointment {
  modality: Modality;
  /** Obligatoria en la modalidad presencial. */
  location?: LocationChoice;
  forWhom: AppointmentFor;
  specialty: string;
  doctorName?: string;
  fullName: string;
  phone: string;
  reason: string;
  preferredDate?: string;
}

/** Molestia principal que elige el paciente en el paso 1 del agendador. */
export type ComplaintId = "articulaciones" | "espalda" | "rodilla" | "huesos" | "generalizado" | "general";

export interface Complaint {
  id: ComplaintId;
  label: string;
  hint: string;
  /** Zonas del mapa corporal que precargan esta molestia. */
  zones: readonly BodyZoneId[];
  /** Condiciones del triage que precargan esta molestia. */
  specialties: readonly SpecialtySlug[];
}

/** Señales de alarma: no son para teleconsulta (emergencias / SAMU 106). */
export type RedFlagId = "articulacion" | "fiebre" | "fractura" | "esfinteres" | "vision" | "debilidad" | "pecho" | "aire";

export interface RedFlag {
  id: RedFlagId;
  label: string;
}

export type SinceId = "dias" | "semanas" | "meses" | "anos";

/** Estado del asistente de 3 pasos (lo que el paciente va completando). */
export interface BookingDraft {
  /** Texto del campo de edad; se valida con parseAge. */
  age: string;
  forWhom: AppointmentFor;
  complaint: ComplaintId | null;
  /** Intensidad del dolor de 1 a 10 (opcional). */
  intensity: number | null;
  since: SinceId | null;
  redFlags: readonly RedFlagId[];
  /** "Entiendo que no es una emergencia y quiero agendar igual". */
  modality: Modality;
  doctorSlug: string | null;
  slot: Slot | null;
  fullName: string;
  phone: string;
  consent: boolean;
}

/** Datos con los que el mapa corporal o el triage precargan el agendador. */
export interface BookingPrefill {
  complaint: ComplaintId;
  doctorSlug?: string;
}

export type BookingStep = 1 | 2 | 3;
export type BookingField =
  | "age"
  | "complaint"
  | "redFlags"
  | "doctor"
  | "slot"
  | "fullName"
  | "phone"
  | "consent";
export type BookingErrors = Partial<Record<BookingField, string>>;

export type IconName =
  | "scan"
  | "syringe"
  | "video"
  | "crosshair"
  | "stethoscope"
  | "activity"
  | "flask"
  | "pill"
  | "waves"
  | "dumbbell"
  | "microscope"
  | "calendar"
  | "clipboard"
  | "file-check";

/* ---------- Densitometría ósea ---------- */

/** Categorías de la OMS para el T-score. */
export type BoneDensityLevel = "normal" | "osteopenia" | "osteoporosis";

export interface BoneDensityState {
  id: BoneDensityLevel;
  label: string;
  /** Rango del T-score en texto (p. ej. "−1,0 o más"). */
  range: string;
  /** Explicación en una frase, sin jerga. */
  explanation: string;
}

export interface DensitometryAudience {
  id: "para-ti" | "para-tus-padres";
  title: string;
  items: readonly string[];
}

export interface DensitometryStep {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface DensitometryQuestion {
  id: string;
  question: string;
}

export interface DensitometryContent {
  whatIs: string;
  technicalName: string;
  measuredAt: string;
  purpose: readonly string[];
  howItWorks: readonly string[];
  safety: readonly string[];
  preparation: readonly string[];
  states: readonly BoneDensityState[];
  tScoreNote: string;
  zScore: { range: string; explanation: string; note: string };
  interpretationNote: string;
  audiences: readonly DensitometryAudience[];
  followUp: string;
  relatedServices: readonly string[];
  steps: readonly DensitometryStep[];
  checklist: readonly DensitometryQuestion[];
  faq: readonly FAQItem[];
  cta: { label: string; message: string; support: string };
  disclaimer: string;
  hud: readonly string[];
}

/* ---------- Detalle de páginas internas (servicios y tratamientos) ---------- */

export interface ServiceDetail {
  intro: string;
  highlights: readonly string[];
  /** Descripción breve de cada subservicio, por su nombre exacto en data/services.ts. */
  serviceNotes: Readonly<Record<string, string>>;
  relatedTreatments: readonly string[];
}

export interface TreatmentDetail {
  pillarSlug: string;
  kind: "therapeutic" | "diagnostic";
  procedure: readonly string[];
  /** Cuidados posteriores (y preparación, cuando aplica). */
  aftercare: readonly string[];
}

export interface SpecialtyDetail {
  whoIsAffected: string;
  diagnosis: readonly string[];
  /** Slugs de data/treatments.ts relacionados con la condición. */
  treatments: readonly string[];
  faq: readonly FAQItem[];
}

export interface BlogSection {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
}

export interface BlogArticle {
  intro: string;
  sections: readonly BlogSection[];
  takeaway: string;
}

export interface FAQGroup {
  id: string;
  title: string;
  items: readonly FAQItem[];
}
