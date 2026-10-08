/**
 * Contrato del adaptador de reservas. La web solo conoce esta interfaz: hoy hay un proveedor
 * demo (por defecto) y uno de Cal.com; mañana podría ser Google Calendar o una base propia.
 */

export type BookingModality = "meet" | "presencial";
export type ProviderId = "demo" | "calcom";
export type BookingStatus = "accepted" | "pending" | "cancelled";
export type ForWhom = "mi" | "familiar";

export type BookingErrorCode =
  | "validation"
  | "slot_unavailable"
  | "not_found"
  | "provider_error"
  | "rate_limited"
  | "not_configured";

export interface BookingError {
  code: BookingErrorCode;
  /** Mensaje en español apto para mostrar al paciente (sin detalles internos). */
  message: string;
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: BookingError };

export interface SlotTime {
  /** Inicio en ISO 8601 (UTC). */
  start: string;
}

export interface SlotDay {
  /** Fecha en hora de Lima: AAAA-MM-DD. */
  date: string;
  slots: readonly SlotTime[];
}

export interface SlotQuery {
  doctorId: string;
  modality: BookingModality;
  /** Fechas en hora de Lima (AAAA-MM-DD), ambas incluidas. */
  from: string;
  to: string;
}

export interface PatientInput {
  fullName: string;
  /** DNI o carné de extranjería. */
  document: string;
  /** Celular con WhatsApp, solo dígitos con código de país (51…). */
  phone: string;
  email: string;
  forWhom: ForWhom;
}

export interface BookingInput {
  doctorId: string;
  modality: BookingModality;
  /** Inicio del turno en ISO 8601. */
  start: string;
  patient: PatientInput;
  reason: string;
  /** Resumen orientativo del triage (va a las notas de la cita, nunca a la URL). */
  triageSummary: string | null;
}

export interface BookingConfirmation {
  uid: string;
  doctorId: string;
  modality: BookingModality;
  start: string;
  end: string;
  status: BookingStatus;
  /** Enlace de Google Meet (lo genera Cal.com). null en demo o si aún no existe. */
  meetingUrl: string | null;
  rescheduleUrl: string | null;
  cancelUrl: string | null;
  isDemo: boolean;
}

export interface BookingProvider {
  readonly id: ProviderId;
  getSlots(query: SlotQuery): Promise<Result<SlotDay[]>>;
  createBooking(input: BookingInput): Promise<Result<BookingConfirmation>>;
  getBooking(uid: string): Promise<Result<BookingConfirmation>>;
  getRescheduleUrl(uid: string): string | null;
  getCancelUrl(uid: string): string | null;
}

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const fail = <T>(code: BookingErrorCode, message: string): Result<T> => ({ ok: false, error: { code, message } });
