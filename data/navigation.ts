export interface NavLink {
  label: string;
  href: string;
}

/** Cabecera minimalista tipo producto digital (consultorio virtual). */
export const primaryLinks: readonly NavLink[] = [
  { label: "Evaluación rápida", href: "/consulta-virtual" },
  { label: "Especialistas", href: "/staff" },
  { label: "Tarifas", href: "/tarifas" },
  { label: "Densitometría", href: "/densitometria-osea" },
];

/** Menú «Más» (y pie de página). */
export const moreLinks: readonly NavLink[] = [
  { label: "Cómo funciona la teleconsulta", href: "/teleconsulta" },
  { label: "Especialidades", href: "/especialidades" },
  { label: "Servicios", href: "/servicios" },
  { label: "Sedes", href: "/sedes" },
  { label: "Blog", href: "/blog" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

export const legalLinks: readonly NavLink[] = [
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Links de interés", href: "/links-de-interes" },
];

/** Todo CTA de «Agendar» lleva al consultorio virtual (WhatsApp queda como canal alternativo). */
export const BOOKING_HREF = "/consulta-virtual?servicio=teleconsulta";
/** Densitometría: el consultorio abre con la salud ósea preseleccionada. */
export const DENSITOMETRY_BOOKING_HREF = "/consulta-virtual?servicio=densitometria";
export const LOCATIONS_PATH = "/sedes";
/** «Evaluar mis síntomas»: el consultorio empieza por la evaluación rápida. */
export const TRIAGE_HREF = "/consulta-virtual";
