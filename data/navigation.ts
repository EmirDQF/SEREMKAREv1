export interface NavLink {
  label: string;
  href: string;
  /** Icono clínico sutil junto al texto (sin insignias de texto). */
  icon?: "scan" | "pill";
  /** Acceso destacado (Suplementos). */
  highlight?: boolean;
}

/**
 * Orden numerado por el cliente (2026-10-22). Se usa igual en la cabecera, el menú móvil y el pie.
 * Preguntas frecuentes y Contacto van solo en el pie.
 */
export const mainNav: readonly NavLink[] = [
  { label: "Densitometría", href: "/densitometria-osea", icon: "scan" },
  { label: "Especialidades", href: "/especialidades" },
  { label: "Especialistas", href: "/staff" },
  { label: "Teleconsulta", href: "/teleconsulta" },
  { label: "Servicios", href: "/servicios" },
  { label: "Evaluación rápida", href: "/consulta-virtual" },
  { label: "Tarifas", href: "/tarifas" },
  // Acceso destacado pedido por el cliente: justo antes de Sedes.
  { label: "Suplementos", href: "/suplementos", icon: "pill", highlight: true },
  { label: "Sedes", href: "/sedes" },
  { label: "Blog", href: "/blog" },
];

/** Cuántos ítems caben a la vista en escritorio; el resto va en «Más». */
const DESKTOP_VISIBLE = 5;

/** Cabecera de escritorio: los primeros ítems del orden del cliente. */
export const primaryLinks: readonly NavLink[] = mainNav.slice(0, DESKTOP_VISIBLE);

/** Menú «Más» de escritorio: el resto, en el mismo orden. */
export const moreLinks: readonly NavLink[] = mainNav.slice(DESKTOP_VISIBLE);

/** Solo en el pie (y al final del menú móvil). */
export const footerOnlyLinks: readonly NavLink[] = [
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

export const legalLinks: readonly NavLink[] = [
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Links de interés", href: "/links-de-interes" },
];

/** «Agendar cita»: el consultorio virtual abre con el selector de tipo de cita. */
export const APPOINTMENT_HREF = "/consulta-virtual?servicio=elegir";
/** Teleconsulta (servicio extra): el consultorio abre con la teleconsulta preseleccionada. */
export const BOOKING_HREF = "/consulta-virtual?servicio=teleconsulta";
/** Densitometría: el consultorio abre con la salud ósea preseleccionada. */
export const DENSITOMETRY_BOOKING_HREF = "/consulta-virtual?servicio=densitometria";
export const LOCATIONS_PATH = "/sedes";
/** «Evaluar mis síntomas»: el consultorio empieza por la evaluación rápida. */
export const TRIAGE_HREF = "/consulta-virtual";
