import type { ServiceDetail } from "@/types/medical";

/**
 * Contenido de /servicios/[slug]. PROVISIONAL: descripciones generales para el paciente;
 * validar con el equipo médico antes de publicar.
 */
export const serviceDetails: Readonly<Record<string, ServiceDetail>> = {
  "apoyo-diagnostico": {
    forWhom:
      "Para quien necesita confirmar un diagnóstico o controlar su enfermedad: osteoporosis, artritis, artrosis, lupus u otras enfermedades reumáticas.",
    preparation: [
      "Densitometría: ropa cómoda sin metales y sin suplementos de calcio 24 horas antes.",
      "Trae tus exámenes y estudios anteriores (foto o PDF).",
      "Para otros estudios te damos las indicaciones al agendar.",
    ],
    intro:
      "Densitometría ósea (DXA) de columna y caderas con cita previa en 3 sedes de Lima Norte y Callao. Resultados el mismo día o en 24 horas, sin orden médica.",
    highlights: ["Resultados claros y confiables", "Atención con cita previa", "Sin orden médica"],
    serviceNotes: {
      "Densitometría ósea": "Mide la densidad de tus huesos para detectar osteopenia u osteoporosis antes de una fractura.",
      Videocapilaroscopía: "Observa los pequeños vasos de la uña para orientar el diagnóstico de enfermedades autoinmunes.",
      "Ecografía musculoesquelética y general": "Permite ver tendones, líquido y cartílago en tiempo real, en la misma consulta.",
      "Laboratorio clínico e inmunológico": "Análisis que ayudan a confirmar el diagnóstico y a controlar tu tratamiento.",
      "Evaluación de osteoporosis severa (VFA)":
        "Imagen lateral de la columna que busca fracturas vertebrales que a veces no dan síntomas.",
      "Análisis de composición corporal":
        "Estima la proporción de músculo, grasa y hueso para orientar tu plan de nutrición y ejercicio.",
      "Densitometría en caderas con prótesis":
        "Protocolo adaptado para medir la densidad ósea cuando ya tienes una prótesis de cadera.",
      "Evaluaciones estandarizadas":
        "Cuestionarios y escalas validadas para medir dolor, función y actividad de la enfermedad en el tiempo.",
    },
    relatedTreatments: ["laboratorio-y-densitometria", "videocapilaroscopia"],
  },
  "apoyo-terapeutico": {
    forWhom:
      "Para pacientes a quienes su reumatólogo indicó un tratamiento especializado (biológicos, inhibidores JAK, pulsos) y necesitan aplicación y seguimiento seguros.",
    preparation: [
      "Trae la indicación de tu médico y tus últimos exámenes.",
      "Cuéntanos qué vacunas tienes y qué medicamentos tomas.",
      "Coordinamos contigo el día y la hora de cada aplicación.",
    ],
    intro:
      "Nuestra Unidad de Terapia Biológica administra y supervisa tratamientos avanzados en un ambiente seguro, con seguimiento cercano.",
    highlights: ["Sesiones supervisadas por especialistas", "Control de riesgos y vacunas", "Seguimiento por WhatsApp"],
    serviceNotes: {
      "Administración endovenosa y subcutánea":
        "Aplicación supervisada de medicamentos por vena o bajo la piel, con monitoreo durante la sesión.",
      "Pulsos de medicación": "Dosis programadas para controlar una crisis, indicadas y controladas por tu especialista.",
      "Medicamentos biotecnológicos":
        "Terapias biológicas e inhibidores JAK para enfermedades autoinmunes que no responden al tratamiento convencional.",
      "Monitoreo de adherencia":
        "Seguimiento continuo: te recordamos tus dosis y controles, revisamos cómo te sientes y resolvemos tus dudas entre sesiones.",
      "Protocolos de administración": "Pasos estandarizados para aplicar cada medicamento de forma segura.", // CONFIRMAR
      "Gestión del riesgo e inmunizaciones":
        "Revisamos tus vacunas y controles antes y durante el tratamiento para reducir riesgos.",
    },
    relatedTreatments: ["terapias-biologicas"],
  },
  telemedicina: {
    forWhom: "Para controles, revisión de resultados o una primera orientación sin moverte de casa, desde cualquier lugar del Perú.",
    preparation: [
      "Un celular o computadora con cámara e internet estable.",
      "Tus exámenes previos a la mano (foto o PDF).",
      "Un lugar tranquilo e iluminado.",
    ],
    intro:
      "Consulta reumatológica por videollamada (WhatsApp, Zoom o Google Meet) desde cualquier lugar del Perú.",
    highlights: ["Plan de tratamiento digital", "Sin traslados ni salas de espera", "Receta y órdenes si el doctor lo indica"],
    serviceNotes: {
      Teleconsulta: "Consulta por videollamada con el Dr. Daniel Ccolcca: plan de tratamiento en formato digital y, si el doctor lo indica, receta y órdenes de exámenes.",
      Teleinterconsulta: "Tu médico tratante y nuestro especialista revisan tu caso juntos, a distancia.",
      "Atención híbrida": "Alternamos visitas presenciales y teleconsultas según lo que necesite tu tratamiento.",
    },
    relatedTreatments: [],
  },
  procedimientos: {
    forWhom: "Para quien tiene dolor o inflamación en una articulación y su reumatólogo indicó un procedimiento.",
    preparation: [
      "Primero pasas por una consulta: el especialista decide si el procedimiento es para ti.",
      "Avisa si tomas anticoagulantes o tienes alergias.",
      "Te damos las indicaciones exactas al agendar.",
    ],
    intro:
      "Procedimientos guiados por ecografía para tratar el dolor con precisión, en consultorio y sin hospitalización.",
    highlights: ["Guiados por imagen en tiempo real", "Ambulatorios: te vas el mismo día", "Menos pinchazos y molestias"],
    serviceNotes: {
      "Infiltraciones ecoguiadas por reumatólogo": "Tu reumatólogo aplica el medicamento viendo la articulación en tiempo real.",
      "Infiltraciones ecoguiadas por radiólogo":
        "Procedimientos guiados por imagen a cargo de nuestro radiólogo, cuando tu caso lo requiere.",
      Videocapilaroscopía: "Observa los pequeños vasos de la uña, sin agujas ni dolor, para orientar el diagnóstico.",
      "Laboratorio especializado": "Análisis que complementan el procedimiento y el control de tu tratamiento.", // CONFIRMAR
    },
    relatedTreatments: ["infiltraciones-ecoguiadas", "viscosuplementacion", "videocapilaroscopia"],
  },
  "consulta-externa": {
    forWhom: "Para quien tiene dolor en las articulaciones, los huesos o la espalda, o una enfermedad reumática que necesita control.",
    preparation: [
      "Trae tus exámenes, recetas y estudios anteriores.",
      "Anota tus síntomas y desde cuándo los tienes.",
      "Llega 10 minutos antes a tu sede.",
    ],
    intro: "Un equipo multidisciplinario trabaja sobre un mismo plan para tratar tu dolor desde todos los frentes.",
    highlights: ["Presencial o por teleconsulta", "Un plan compartido por todo el equipo", "Lun–Vie 08:00 a 20:00 · Sáb 08:00 a 13:00"],
    serviceNotes: {
      Reumatología: "Diagnóstico y tratamiento de enfermedades de las articulaciones, los huesos y autoinmunes.",
      "Medicina general": "Evaluación integral y control de otras condiciones de salud que influyen en tu tratamiento.",
      Psicología: "Acompañamiento para manejar el dolor crónico, el estrés y el impacto emocional de la enfermedad.",
      Nutrición: "Plan de alimentación según tu condición, por ejemplo en gota, osteoporosis o control de peso.",
      "Terapia ocupacional": "Estrategias y adaptaciones para cuidar tus articulaciones en el trabajo y en casa.",
      "Terapia física": "Ejercicio terapéutico guiado para recuperar fuerza, movilidad y confianza.",
    },
    relatedTreatments: ["terapia-fisica"],
  },
};

export function getServiceDetail(slug: string): ServiceDetail {
  const detail = serviceDetails[slug];
  if (!detail) throw new Error(`Service detail not found: ${slug}`);
  return detail;
}
