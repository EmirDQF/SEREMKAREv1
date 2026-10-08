import { z } from "zod";

/**
 * Validación en el servidor de todo lo que llega a /api/booking. Los mensajes van en español
 * y nunca reflejan el valor recibido (podría contener datos personales).
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** DNI (8 dígitos) o carné de extranjería (hasta 12 caracteres alfanuméricos). */
const DOCUMENT = /^[0-9A-Za-z]{8,12}$/;
/** Celular peruano: 9 dígitos que empiezan en 9, con o sin 51 delante. */
const PERU_MOBILE = /^(?:51)?(9\d{8})$/;
const PERU_PREFIX = "51";

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  reasonMin: 3,
  reasonMax: 500,
  summaryMax: 600,
  emailMax: 120,
} as const;

const doctorId = z.string().regex(SLUG, "Especialista no válido.").max(60);
const modality = z.enum(["meet", "presencial"], { message: "Modalidad no válida." });
const isoDate = z.string().regex(ISO_DATE, "Fecha no válida.");

const phone = z
  .string()
  .transform((raw) => raw.replace(/\D/g, ""))
  .refine((digits) => PERU_MOBILE.test(digits), "Escribe un celular válido, por ejemplo 987 654 321.")
  .transform((digits) => `${PERU_PREFIX}${digits.replace(PERU_MOBILE, "$1")}`);

export const slotsQuerySchema = z
  .object({ doctorId, modality, from: isoDate, to: isoDate })
  .refine((query) => query.from <= query.to, { message: "El rango de fechas no es válido.", path: ["to"] });

export const createBookingSchema = z.object({
  doctorId,
  modality,
  start: z.iso.datetime({ offset: true, message: "Horario no válido." }),
  patient: z.object({
    fullName: z.string().trim().min(LIMITS.nameMin, "Escribe el nombre completo.").max(LIMITS.nameMax, "El nombre es muy largo."),
    document: z.string().trim().regex(DOCUMENT, "Escribe un DNI (8 dígitos) o carné de extranjería válido."),
    phone,
    email: z.string().trim().max(LIMITS.emailMax).pipe(z.email("Escribe un correo válido.")),
    forWhom: z.enum(["mi", "familiar"]),
  }),
  reason: z.string().trim().min(LIMITS.reasonMin, "Cuéntanos brevemente el motivo.").max(LIMITS.reasonMax, "El motivo es muy largo."),
  triageSummary: z.string().trim().max(LIMITS.summaryMax).nullable(),
  consents: z.object({
    dataProcessing: z.literal(true, { message: "Necesitamos tu autorización para tratar tus datos (Ley N.° 29733)." }),
    telehealth: z.literal(true, { message: "Necesitamos tu consentimiento para la teleconsulta (Ley N.° 30421)." }),
  }),
  /** Honeypot: campo oculto que las personas dejan vacío y los bots suelen llenar. */
  website: z.string().max(0, "Solicitud no válida."),
});

export type CreateBookingRequest = z.infer<typeof createBookingSchema>;

/** Primer mensaje de error legible (para responder sin exponer detalles). */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Revisa los datos e intenta de nuevo.";
}
