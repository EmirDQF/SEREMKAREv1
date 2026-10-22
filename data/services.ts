import { HIDDEN_SERVICES, VISIBLE_SERVICE_PILLARS } from "@/data/visibility";
import type { ServicePillar } from "@/types/medical";

/**
 * Todos los pilares (incluidos los ocultos por visibility). Oferta indicada por el cliente
 * (2026-10-22): 4 pilares del modelo de atención integral + la telemedicina como servicio extra.
 */
export const allServicePillars: readonly ServicePillar[] = [
  {
    slug: "apoyo-diagnostico",
    name: "Apoyo diagnóstico",
    tagline: "Diagnóstico de precisión en un solo lugar, sin vueltas.",
    summary: "Estudios para saber con precisión qué tienes, empezando por la densitometría ósea.",
    icon: "scan",
    size: "lg",
    kind: "core",
    services: [
      { name: "Densitometría ósea", description: "mide qué tan fuertes están tus huesos" },
      { name: "Evaluación de osteoporosis severa (VFA)", description: "imagen de la columna que busca fracturas que no duelen" },
      {
        name: "Análisis de composición corporal",
        description: "grasa general, grasa visceral (la que rodea los órganos) y músculo, para diagnóstico y control",
      },
      { name: "Densitometría en caderas con prótesis" },
      { name: "Videocapilaroscopía", description: "mira los vasos diminutos junto a la uña, sin agujas" },
      { name: "Ecografía musculoesquelética y general", description: "ultrasonografía: imágenes en tiempo real, sin radiación" },
      { name: "Laboratorio clínico e inmunológico", description: "análisis especializados de sangre" },
      { name: "Evaluaciones estandarizadas", description: "formatos para medir el dolor y la función en el tiempo" },
    ],
  },
  {
    slug: "apoyo-terapeutico",
    name: "Apoyo terapéutico y seguimiento",
    tagline: "Unidad de Terapia Biológica e Inhibidores JAK (UTB-JAK).",
    summary: "Aplicamos y vigilamos tratamientos especializados, y te acompañamos paso a paso entre dosis.",
    icon: "pill",
    size: "md",
    kind: "core",
    services: [
      { name: "Administración endovenosa y subcutánea", description: "EV: por la vena · SC: bajo la piel" },
      { name: "Pulsos de medicación", description: "dosis programadas indicadas por tu especialista" },
      {
        name: "Medicamentos biotecnológicos",
        description: "biológicos e inhibidores JAK: medicamentos especializados para enfermedades autoinmunes",
      },
      { name: "Monitoreo de adherencia", description: "te ayudamos a no perder dosis y a seguir tu plan" },
      { name: "Protocolos de administración" }, // CONFIRMAR: nuevo servicio indicado por el cliente
      { name: "Gestión del riesgo e inmunizaciones", description: "vacunas y controles antes y durante el tratamiento" },
    ],
  },
  {
    slug: "consulta-externa",
    name: "Consulta externa multidisciplinaria",
    tagline: "Un equipo completo alrededor de ti.",
    summary: "La reumatología al centro y un equipo de especialistas que trabaja con un mismo plan para ti.",
    icon: "stethoscope",
    size: "md",
    kind: "core",
    services: [
      { name: "Reumatología", description: "articulaciones, huesos y enfermedades autoinmunes" },
      { name: "Medicina general" },
      { name: "Psicología" },
      { name: "Nutrición" },
      { name: "Terapia ocupacional", description: "cuidar tus articulaciones en casa y en el trabajo" },
      { name: "Terapia física" },
    ],
  },
  {
    slug: "procedimientos",
    name: "Procedimientos de precisión",
    tagline: "Precisión guiada por ecografía.",
    summary: "Infiltraciones guiadas por ecografía: el médico ve la articulación en pantalla mientras aplica el medicamento.",
    icon: "crosshair",
    size: "md",
    kind: "core",
    services: [
      { name: "Infiltraciones ecoguiadas por reumatólogo", description: "inyección en la articulación guiada por ecografía" },
      { name: "Infiltraciones ecoguiadas por radiólogo" },
      { name: "Videocapilaroscopía", description: "mira los vasos diminutos junto a la uña, sin agujas" },
      { name: "Laboratorio especializado" }, // CONFIRMAR: alcance del laboratorio dentro de procedimientos
    ],
  },
  {
    slug: "telemedicina",
    name: "Telemedicina",
    tagline: "Tu control desde casa u oficina.",
    summary: "Teleconsulta, teleinterconsulta y atención híbrida: tu control sin moverte de casa.",
    icon: "video",
    size: "sm",
    kind: "extra",
    services: [
      { name: "Teleconsulta", description: "consulta por videollamada" },
      { name: "Teleinterconsulta", description: "tu médico y nuestro especialista revisan tu caso juntos" },
      { name: "Atención híbrida", description: "presencial + seguimiento virtual" },
    ],
  },
];

/** Pilares publicados (todos sus servicios, salvo los ocultos en visibility). */
export const servicePillars: readonly ServicePillar[] = allServicePillars
  .filter((pillar) => VISIBLE_SERVICE_PILLARS.has(pillar.slug))
  .map((pillar) => ({ ...pillar, services: pillar.services.filter((service) => !HIDDEN_SERVICES.has(service.name)) }));

/** Los 4 pilares del modelo de atención integral (Home y /servicios). */
export const corePillars: readonly ServicePillar[] = servicePillars.filter((pillar) => pillar.kind === "core");

/** Servicio extra: telemedicina (bloque propio, visualmente distinto). */
export const extraPillar: ServicePillar | undefined = servicePillars.find((pillar) => pillar.kind === "extra");
