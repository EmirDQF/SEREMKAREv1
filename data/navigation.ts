export interface NavLink {
  label: string;
  href: string;
}

export const primaryLinks: readonly NavLink[] = [
  { label: "Staff médico", href: "/staff" },
  { label: "Blog", href: "/blog" },
  { label: "Sedes", href: "/sedes" },
  { label: "Contacto", href: "/contacto" },
];

export const legalLinks: readonly NavLink[] = [
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Links de interés", href: "/links-de-interes" },
];

export const BOOKING_HREF = "/#agendar";
export const LOCATIONS_PATH = "/sedes";
export const TRIAGE_HREF = "/#donde-te-duele";
