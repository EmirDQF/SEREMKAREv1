import type { DensitometryContent } from "@/types/medical";

/**
 * Densitometría ósea (DXA). Contenido médico tomado del brief aprobado (criterios de la OMS);
 * no agregar datos clínicos sin validación del equipo médico.
 * Confirmado por SERMEKARE (2026-10-04): no es obligatoria la orden médica y los resultados
 * se entregan el mismo día o en 24 horas.
 */
export const densitometry: DensitometryContent = {
  whatIs:
    "Es una prueba rápida e indolora que mide qué tan fuertes (densos) están tus huesos, con rayos X de dosis muy baja.",
  technicalName: "Su nombre técnico es DXA o DEXA.",
  measuredAt: "Se mide sobre todo en la columna lumbar y la cadera.",
  purpose: [
    "Detectar osteopenia u osteoporosis antes de que ocurra una fractura.",
    "Valorar tu riesgo de fractura junto con tu médico.",
    "Ver si un tratamiento para fortalecer el hueso está funcionando.",
  ],
  howItWorks: [
    "Te recuestas en una camilla y el brazo del equipo pasa por encima, sin tocarte.",
    "Dura de 10 a 20 minutos.",
    "No duele, no hay agujas y no se usa un túnel cerrado.",
  ],
  safety: [
    "La radiación es mucho menor que la de una radiografía de tórax, similar a la radiación natural que recibes en un día.",
    "No se recomienda durante el embarazo: avisa si existe la posibilidad.",
  ],
  preparation: [
    "Puedes comer normalmente.",
    "No tomes suplementos de calcio 24 horas antes.",
    "Usa ropa cómoda sin metales (cierres, botones, hebillas).",
    "Avisa si te hicieron un estudio con contraste o de medicina nuclear en los últimos días.",
  ],
  states: [
    {
      id: "normal",
      label: "Normal",
      range: "T-score de −1,0 o más",
      explanation: "Tus huesos tienen una densidad dentro de lo esperado.",
    },
    {
      id: "osteopenia",
      label: "Osteopenia",
      range: "T-score entre −1,0 y −2,5",
      explanation: "Masa ósea baja: el hueso empieza a perder densidad, pero aún no es osteoporosis.",
    },
    {
      id: "osteoporosis",
      label: "Osteoporosis",
      range: "T-score de −2,5 o menos",
      explanation: "El hueso es más poroso y frágil, y aumenta el riesgo de fracturas.",
    },
  ],
  tScoreNote: "El T-score se usa en mujeres posmenopáusicas y en hombres de 50 años o más.",
  zScore: {
    range: "Z-score de −2,0 o menos",
    explanation: "Significa “por debajo de lo esperado para tu edad” y requiere evaluación médica.",
    note: "El Z-score se usa en mujeres antes de la menopausia y en hombres menores de 50 años.",
  },
  interpretationNote: "Tu especialista interpreta el resultado junto con tu historia clínica.",
  audiences: [
    {
      id: "para-ti",
      title: "Para ti, si…",
      items: [
        "Tomas corticoides (como prednisona) por 3 meses o más.",
        "Tienes artritis reumatoide, lupus u otra enfermedad inflamatoria.",
        "Tuviste la menopausia antes de los 45 años.",
        "Te fracturaste con un golpe leve.",
        "Tienes bajo peso o trastornos de la alimentación.",
        "Tienes problemas de tiroides o paratiroides, celiaquía u otra enfermedad que afecte la absorción.",
        "Recibes tratamientos que afectan el hueso.",
        "Fumas o consumes alcohol con frecuencia.",
      ],
    },
    {
      id: "para-tus-padres",
      title: "Para tus padres, si…",
      items: [
        "Es mujer de 65 años o más.",
        "Es hombre de 70 años o más.",
        "Ha perdido estatura.",
        "Ha tenido caídas o fracturas.",
        "Hay antecedentes familiares de fractura de cadera.",
      ],
    },
  ],
  followUp:
    "También sirve para el control de quienes ya reciben tratamiento para la osteoporosis: tu médico define cada cuánto (usualmente cada 1 a 2 años).",
  relatedServices: [
    "Evaluación de osteoporosis severa (VFA)",
    "Densitometría en caderas con prótesis",
    "Análisis de composición corporal",
  ],
  steps: [
    { id: "agenda", title: "Agenda", description: "Escríbenos por WhatsApp y elige el día que te acomode.", icon: "calendar" },
    { id: "preparacion", title: "Preparación", description: "Ropa cómoda sin metales y sin calcio 24 horas antes.", icon: "clipboard" },
    { id: "estudio", title: "Estudio breve", description: "Te recuestas y el equipo pasa por encima, sin tocarte.", icon: "scan" },
    {
      id: "resultado",
      title: "Resultado explicado",
      description: "El mismo día o en 24 horas. Puedes revisarlo con un reumatólogo en una teleconsulta.",
      icon: "file-check",
    },
  ],
  checklist: [
    { id: "corticoides", question: "¿Tomas corticoides (como prednisona) desde hace 3 meses o más?" },
    { id: "inflamatoria", question: "¿Tienes artritis reumatoide, lupus u otra enfermedad inflamatoria?" },
    { id: "menopausia", question: "¿Tuviste la menopausia antes de los 45 años?" },
    { id: "fractura", question: "¿Te fracturaste un hueso con un golpe leve o una caída simple?" },
    { id: "edad", question: "¿Eres mujer de 65 años o más, u hombre de 70 años o más?" },
    { id: "estatura", question: "¿Has perdido estatura o tienes caídas frecuentes?" },
    { id: "familia", question: "¿Hay antecedentes de fractura de cadera en tu familia?" },
    { id: "habitos", question: "¿Fumas o consumes alcohol con frecuencia?" },
  ],
  faq: [
    {
      id: "duele",
      question: "¿Duele?",
      answer:
        "No. Te recuestas en una camilla y el brazo del equipo pasa por encima sin tocarte. No hay agujas ni túnel cerrado.",
    },
    {
      id: "radiacion",
      question: "¿Es segura la radiación?",
      answer:
        "Sí. La dosis es mucho menor que la de una radiografía de tórax, similar a la radiación natural que recibes en un día. No se recomienda durante el embarazo: avísanos si existe la posibilidad.",
    },
    {
      id: "orden",
      question: "¿Necesito orden médica?",
      answer:
        "No es obligatoria. Atendemos pacientes particulares y también a quienes vienen con orden médica.",
    },
    {
      id: "comer",
      question: "¿Puedo comer antes?",
      answer:
        "Sí, puedes comer normalmente. Solo evita los suplementos de calcio 24 horas antes y usa ropa cómoda sin metales.",
    },
    {
      id: "repetir",
      question: "¿Cada cuánto debo repetirla?",
      answer:
        "Lo define tu médico según tu resultado y tu tratamiento. Para el control de la osteoporosis, usualmente se repite cada 1 a 2 años.",
    },
    {
      id: "resultados",
      question: "¿Cuándo tengo los resultados?",
      answer:
        "Te entregamos el resultado el mismo día o en un máximo de 24 horas. Si quieres, puedes revisarlo con un reumatólogo en una teleconsulta.",
    },
  ],
  cta: {
    label: "Agendar densitometría",
    message: "Hola SERMEKARE, quisiera agendar una densitometría ósea de columna y cadera.",
    support: "Resultados el mismo día o en 24 horas · sin orden médica",
  },
  disclaimer: "Esta información es orientativa y no reemplaza la evaluación de un especialista.",
  hud: ["Estudio breve", "Indolora", "Dosis muy baja"],
};

export const DENSITOMETRY_PATH = "/densitometria-osea";
