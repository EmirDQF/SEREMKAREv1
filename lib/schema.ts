import { site } from "@/data/site";
import { primaryLocation, primaryWhatsAppLine } from "@/lib/locations";
import type { ClinicLocation, FAQItem, OpeningHours } from "@/types/medical";

type JsonLdObject = Record<string, unknown>;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

function postalAddress(location: ClinicLocation): JsonLdObject {
  return {
    "@type": "PostalAddress",
    streetAddress: location.street,
    addressLocality: location.district,
    addressRegion: location.region,
    addressCountry: "PE",
  };
}

/** Solo se publica el horario confirmado: un horario falso en Google es peor que ninguno. */
function openingHours(hours: OpeningHours): JsonLdObject {
  if (!hours.confirmed) return {};
  return {
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days.map((d) => DAY_NAMES[d]),
        opens: toTime(hours.opensAt),
        closes: toTime(hours.closesAt),
      },
    ],
  };
}

/** @id de la empresa (KARE SAC): la usan todos los nodos que la referencian. */
export const ORGANIZATION_ID = `${site.url}/#organization`;
const ORGANIZATION_REF = { "@id": ORGANIZATION_ID } as const;

/** @id del MedicalClinic de una sede: vive en su propia página (/sedes/<slug>). */
export const locationClinicId = (location: ClinicLocation) => `${site.url}/sedes/${location.id}#clinic`;

const locationRefs = (locations: readonly ClinicLocation[]) => locations.map((location) => ({ "@id": locationClinicId(location) }));

/**
 * MedicalOrganization (la empresa). La dirección y el horario van en cada sede, no aquí.
 * No incluye aggregateRating a propósito: Google exige reseñas reales y verificables;
 * agregarlo cuando existan reseñas de pacientes reales.
 */
export function organizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": ORGANIZATION_ID,
    name: `${site.name} — ${site.legalTagline}`,
    legalName: site.legalName,
    ...(site.taxId ? { taxID: site.taxId } : {}),
    url: site.url,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/opengraph-image`,
    telephone: `+${primaryWhatsAppLine().number}`,
    ...(site.email ? { email: site.email } : {}),
    slogan: site.slogan,
    medicalSpecialty: ["Rheumatologic", "PhysicalTherapy"],
    subOrganization: locationRefs(site.locations),
    ...(site.socials.length > 0 ? { sameAs: site.socials.map((s) => s.href) } : {}),
  };
}

/** Intro de la sede, con la referencia del hospital al inicio si la intro no la menciona ya. */
function locationDescription(location: ClinicLocation): string {
  const { reference, intro } = location;
  return reference && !intro.includes(reference) ? `${reference}. ${intro}` : intro;
}

/** MedicalClinic de una sede, enlazada a la organización. Sin geo hasta tener coordenadas confirmadas. */
export function locationClinicSchema(location: ClinicLocation): JsonLdObject {
  const path = `/sedes/${location.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": locationClinicId(location),
    name: `${site.name} — Sede ${location.name}`,
    url: `${site.url}${path}`,
    parentOrganization: ORGANIZATION_REF,
    description: locationDescription(location),
    telephone: `+${location.whatsapp.number}`,
    address: postalAddress(location),
    hasMap: location.mapsUrl,
    ...openingHours(location.hours),
    areaServed: location.nearbyDistricts.map((name) => ({ "@type": "AdministrativeArea", name })),
    availableService: { "@type": "DiagnosticProcedure", name: "Densitometría ósea (DXA)" },
  };
}

export function faqSchema(items: readonly FAQItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbSchema(items: readonly Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };
}

interface ProcedureInfo {
  name: string;
  alternateName: readonly string[];
  description: string;
  path: string;
  bodyLocation: string;
  howPerformed: string;
  preparation: string;
  followup: string;
  /** Sedes donde se hace; si se omite, apunta a la organización. */
  availableAt?: readonly ClinicLocation[];
}

type ProcedureType = "DiagnosticProcedure" | "TherapeuticProcedure";

/** Procedimiento médico (diagnóstico o terapéutico) ofrecido por la clínica. */
export function procedureSchema(type: ProcedureType, info: ProcedureInfo): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${site.url}${info.path}#procedure`,
    name: info.name,
    alternateName: info.alternateName,
    description: info.description,
    url: `${site.url}${info.path}`,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: info.bodyLocation,
    howPerformed: info.howPerformed,
    preparation: info.preparation,
    followup: info.followup,
    availableAt: info.availableAt ? locationRefs(info.availableAt) : ORGANIZATION_REF,
  };
}

/** Procedimiento diagnóstico (p. ej. densitometría ósea). */
export function diagnosticProcedureSchema(info: ProcedureInfo): JsonLdObject {
  return procedureSchema("DiagnosticProcedure", info);
}

interface ServiceInfo {
  name: string;
  description: string;
  path: string;
  offers: readonly string[];
}

/** Servicio de la clínica (pilar) con su catálogo de subservicios. */
export function medicalServiceSchema(info: ServiceInfo): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${info.path}#service`,
    name: info.name,
    description: info.description,
    url: `${site.url}${info.path}`,
    serviceType: info.name,
    areaServed: { "@type": "City", name: "Lima" },
    provider: ORGANIZATION_REF,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: info.name,
      itemListElement: info.offers.map((offer) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: offer } })),
    },
  };
}

interface ConditionInfo {
  name: string;
  description: string;
  path: string;
  symptoms: readonly string[];
}

/** Página informativa de una condición (MedicalCondition dentro de una MedicalWebPage). */
export function medicalConditionSchema(info: ConditionInfo): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    url: `${site.url}${info.path}`,
    name: info.name,
    about: {
      "@type": "MedicalCondition",
      name: info.name,
      description: info.description,
      signOrSymptom: info.symptoms.map((symptom) => ({ "@type": "MedicalSignOrSymptom", name: symptom })),
    },
    publisher: ORGANIZATION_REF,
  };
}

interface PhysicianInfo {
  name: string;
  path: string;
  specialty: string;
  /** null = sin foto real todavía (no se publica `image`). */
  image: string | null;
  knowsAbout: readonly string[];
}

export function physicianSchema(info: PhysicianInfo): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: info.name,
    url: `${site.url}${info.path}`,
    ...(info.image ? { image: info.image } : {}),
    medicalSpecialty: "Rheumatologic",
    description: info.specialty,
    knowsAbout: info.knowsAbout,
    worksFor: ORGANIZATION_REF,
    address: postalAddress(primaryLocation()),
  };
}

interface ArticleInfo {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  /** null = equipo editorial: el autor es la organización. */
  author: { name: string; path: string } | null;
}

export function blogPostingSchema(info: ArticleInfo): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: info.title,
    description: info.description,
    url: `${site.url}${info.path}`,
    image: info.image,
    datePublished: info.datePublished,
    inLanguage: "es-PE",
    author: info.author
      ? { "@type": "Person", name: info.author.name, url: `${site.url}${info.author.path}` }
      : ORGANIZATION_REF,
    publisher: ORGANIZATION_REF,
  };
}

/** Servicio de teleconsulta reumatológica (datos reales del material de la clínica). */
export function teleconsultServiceSchema(path: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${path}#teleconsulta`,
    name: "Teleconsulta reumatológica",
    serviceType: "Teleconsulta reumatológica",
    description:
      "Consulta reumatológica virtual por videollamada para pacientes de todo el Perú: revisión de exámenes previos, plan de tratamiento, receta digital y órdenes de exámenes si el doctor lo indica, y seguimiento.",
    url: `${site.url}${path}`,
    provider: ORGANIZATION_REF,
    areaServed: { "@type": "Country", name: site.serviceArea },
    availableChannel: [
      { "@type": "ServiceChannel", name: "WhatsApp Videollamada" },
      { "@type": "ServiceChannel", name: "Zoom" },
      { "@type": "ServiceChannel", name: "Google Meet" },
    ],
  };
}
