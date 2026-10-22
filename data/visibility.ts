import type { SpecialtySlug } from "@/types/medical";

/**
 * Fuente única de lo que se publica. Nada se borra: cambiar un valor reactiva el contenido
 * (menú, footer, sitemap, enlaces internos y páginas, que responden 404 si están ocultas).
 *
 * Decisiones aprobadas (D1–D11, plan del consultorio virtual):
 * - D1: teleconsulta reumatológica activa (instrucción vigente del cliente), aunque la tarjeta
 *   de KARE SAC solo respalda la densitometría.
 * - D2: cifras, aseguradoras, testimonios y médicos de muestra ocultos hasta tener datos reales.
 * - D3: procedimientos y terapias que la tarjeta no respalda, ocultos.
 * - D8: la llamada telefónica no figura en el material real (WhatsApp, Zoom o Google Meet).
 * - D11: solo las especialidades que nombra el material de teleconsulta.
 * - D12 (2026-10-22, decisión del cliente): se muestra TODA la oferta del centro (4 pilares + la
 *   telemedicina como servicio extra). CONFIRMAR con el cliente cada servicio reactivado
 *   (docs/PENDIENTES.md → «Servicios reactivados»).
 */
export const visibility = {
  teleconsultation: true,
  stats: false,
  testimonials: false,
  insurers: false,
  sampleDoctors: false,
  sampleVideo: false,
  email: false,
  socials: false,
  phoneCallModality: false,
} as const;

/** Especialidades visibles (D11): las que nombra el index.html real de la teleconsulta. */
export const VISIBLE_SPECIALTIES: ReadonlySet<SpecialtySlug> = new Set<SpecialtySlug>([
  "artrosis",
  "artritis-reumatoide",
  "lupus",
  "osteoporosis",
]);

/** Pilares de servicio visibles (D12): los 4 pilares del cliente + telemedicina (servicio extra). */
export const VISIBLE_SERVICE_PILLARS: ReadonlySet<string> = new Set([
  "apoyo-diagnostico",
  "apoyo-terapeutico",
  "consulta-externa",
  "procedimientos",
  "telemedicina",
]);

/** Servicios concretos ocultos dentro de los pilares visibles (por nombre exacto). Hoy, ninguno (D12). */
export const HIDDEN_SERVICES: ReadonlySet<string> = new Set<string>();

/** Tratamientos visibles (D3): ninguno está respaldado por el material real. */
export const VISIBLE_TREATMENTS: ReadonlySet<string> = new Set<string>();
