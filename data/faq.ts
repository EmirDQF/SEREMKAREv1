import { teleconsultFaq } from "@/data/teleconsult-content";
import type { FAQItem } from "@/types/medical";

/**
 * PROVISIONAL (oculto, D2): FAQ de muestra con afirmaciones no respaldadas por el material real
 * (seguros/EPS, duración, infiltraciones, laboratorio). Se conserva para reactivarla con datos reales.
 */
export const sampleFaq: readonly FAQItem[] = [
  {
    id: "seguros",
    question: "¿Atienden con seguros y EPS?",
    answer: "Sí, trabajamos con diversas aseguradoras y EPS. Escríbenos por WhatsApp con el nombre de tu seguro y te confirmamos la cobertura antes de tu cita.",
  },
  {
    id: "costos",
    question: "¿Cuánto cuesta la consulta?",
    answer: "El costo depende de la especialidad y la modalidad (presencial o teleconsulta). Te lo confirmamos al agendar, sin cobros sorpresa.",
  },
  {
    id: "referencia",
    question: "¿Necesito una referencia médica para atenderme?",
    answer: "No. Puedes agendar directamente con nuestros especialistas. Si tu seguro exige referencia, te orientamos para gestionarla.",
  },
  {
    id: "que-llevar",
    question: "¿Qué debo llevar a mi primera consulta?",
    answer: "Tu DNI, la lista de medicamentos que tomas, tus análisis o imágenes recientes (si los tienes) y tus preguntas anotadas. Si vienes por un familiar, trae también sus documentos.",
  },
  {
    id: "teleconsulta",
    question: "¿Cómo funciona la teleconsulta?",
    answer: "Agendas tu horario, te enviamos un enlace por WhatsApp y te conectas desde el celular o la computadora. Recibes tu receta y tus indicaciones en formato digital.",
  },
  {
    id: "duracion",
    question: "¿Cuánto dura la consulta?",
    answer: "La primera consulta dura entre 30 y 45 minutos, para revisar tu historia con calma. Los controles suelen durar entre 20 y 30 minutos.",
  },
  {
    id: "infiltraciones",
    question: "¿Las infiltraciones duelen?",
    answer: "La mayoría de pacientes siente solo una molestia leve. Al guiarlas con ecografía, la aguja llega con precisión y se reducen las molestias. Puedes retomar tus actividades livianas el mismo día.",
  },
  {
    id: "resultados",
    question: "¿Cuándo tengo los resultados de laboratorio?",
    answer: "La mayoría de resultados están listos entre 24 y 72 horas. Los perfiles inmunológicos especiales pueden tardar algunos días más; te avisamos por WhatsApp.",
  },
];

/** FAQ publicada: la del material real de la teleconsulta (index.html de SEREMKAREWEB). */
export const homeFaq: readonly FAQItem[] = teleconsultFaq;
