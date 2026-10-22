"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, CalendarCheck, Loader2, Lock, Video } from "lucide-react";
import { HINT, PANEL } from "@/components/consulta/ui";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { buttonVariants } from "@/components/ui/button";
import { doctors } from "@/data/doctors";
import { PAYMENT_PENDING, formatPrice, getPricing } from "@/data/pricing";
import { LIMITS, createBookingSchema } from "@/lib/api/schemas";
import type { BookingConfirmation, Result } from "@/lib/booking-provider/types";
import { confirmationKey } from "@/lib/consulta/state";
import { formatLimaDateTime } from "@/lib/lima-format";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  doctorId: string;
  slotStart: string;
  reason: string;
  triageSummary: string | null;
  onReasonChange: (reason: string) => void;
  onBack: () => void;
  /** El horario se ocupó: volver al calendario. */
  onSlotTaken: () => void;
}

type Field = "fullName" | "document" | "phone" | "email" | "reason" | "dataProcessing" | "telehealth";
type Errors = Partial<Record<Field, string>>;

const FIELD_ORDER: readonly Field[] = ["fullName", "document", "phone", "email", "reason", "dataProcessing", "telehealth"];
const INPUT =
  "mt-1.5 block min-h-12 w-full rounded-xl border border-line-strong bg-card-solid px-4 text-base text-heading placeholder:text-muted focus-visible:border-primary focus-visible:outline-3 focus-visible:outline-ring aria-[invalid=true]:border-alert";

function fieldOf(path: readonly PropertyKey[]): Field | null {
  const last = String(path[path.length - 1] ?? "");
  return (FIELD_ORDER as readonly string[]).includes(last) ? (last as Field) : null;
}

export function BookingForm({ doctorId, slotStart, reason, triageSummary, onReasonChange, onBack, onSlotTaken }: BookingFormProps) {
  const router = useRouter();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<{ message: string; slotTaken: boolean } | null>(null);
  const [sending, setSending] = useState(false);
  const doctor = doctors.find((d) => d.slug === doctorId);
  const price = getPricing("teleconsulta");

  const fieldId = (field: Field) => `${id}-${field}`;
  const errorId = (field: Field) => `${id}-${field}-error`;
  const a11y = (field: Field) => ({
    id: fieldId(field),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    const payload = {
      doctorId,
      modality: "meet" as const,
      start: slotStart,
      patient: {
        fullName: String(data.get("fullName") ?? ""),
        document: String(data.get("document") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        forWhom: data.get("forWhom") === "familiar" ? "familiar" : "mi",
      },
      reason,
      triageSummary,
      consents: { dataProcessing: data.get("dataProcessing") === "on", telehealth: data.get("telehealth") === "on" },
      website: String(data.get("website") ?? ""),
    };

    const parsed = createBookingSchema.safeParse(payload);
    if (!parsed.success) {
      const found: Errors = {};
      for (const issue of parsed.error.issues) {
        const field = fieldOf(issue.path);
        if (field && !found[field]) found[field] = issue.message;
      }
      setErrors(found);
      const first = FIELD_ORDER.find((field) => found[field]);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }

    setErrors({});
    setServerError(null);
    setSending(true);
    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as Result<BookingConfirmation>;
      if (!result.ok) {
        setServerError({ message: result.error.message, slotTaken: result.error.code === "slot_unavailable" });
        return;
      }
      try {
        // Solo datos de la cita (sin datos personales) para la pantalla de confirmación.
        window.sessionStorage.setItem(confirmationKey(result.data.uid), JSON.stringify(result.data));
      } catch {
        // Sin almacenamiento: la confirmación se consulta al proveedor.
      }
      router.push(`/cita-confirmada/${encodeURIComponent(result.data.uid)}`);
    } catch {
      setServerError({ message: "No pudimos enviar tu reserva. Revisa tu conexión e intenta de nuevo.", slotTaken: false });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_20rem]" aria-labelledby="datos-titulo">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className={PANEL}>
        <h1 id="datos-titulo" tabIndex={-1} className="text-h2 text-heading focus:outline-none">
          Tus datos para la cita
        </h1>
        <p className={cn(HINT, "inline-flex items-center gap-1.5")}>
          <Lock aria-hidden className="size-4" /> Solo los usamos para tu cita. Nunca aparecen en la dirección de la página.
        </p>

        <fieldset className="mt-6">
          <legend className="font-semibold text-heading">¿La consulta es para ti o para un familiar?</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {[
              ["mi", "Para mí"],
              ["familiar", "Para un familiar"],
            ].map(([value, label]) => (
              <label key={value} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-line px-4 has-[:checked]:border-primary has-[:checked]:bg-teal-tint">
                <input type="radio" name="forWhom" value={value} defaultChecked={value === "mi"} className="size-5 accent-[var(--teal-strong)]" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <TextField label="Nombre completo del paciente" name="fullName" autoComplete="name" maxLength={LIMITS.nameMax} error={errors.fullName} errorId={errorId("fullName")} {...a11y("fullName")} className="sm:col-span-2" />
          <TextField label="DNI o carné de extranjería" name="document" inputMode="text" autoComplete="off" maxLength={12} error={errors.document} errorId={errorId("document")} {...a11y("document")} />
          <TextField label="Celular (WhatsApp)" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="987 654 321" maxLength={20} error={errors.phone} errorId={errorId("phone")} {...a11y("phone")} />
          <TextField label="Correo electrónico (te llega el enlace)" name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.emailMax} error={errors.email} errorId={errorId("email")} {...a11y("email")} className="sm:col-span-2" />
        </div>

        <div className="mt-5">
          <label htmlFor={fieldId("reason")} className="font-semibold text-heading">
            Motivo de la consulta
          </label>
          <textarea
            name="reason"
            rows={3}
            maxLength={LIMITS.reasonMax}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className={cn(INPUT, "py-3")}
            {...a11y("reason")}
          />
          {errors.reason ? <FieldError id={errorId("reason")} message={errors.reason} /> : null}
        </div>

        {/* Honeypot: oculto para personas y lectores de pantalla. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            No llenar <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <fieldset className="mt-6 grid gap-3">
          <legend className="sr-only">Consentimientos</legend>
          <Consent name="dataProcessing" error={errors.dataProcessing} errorId={errorId("dataProcessing")} {...a11y("dataProcessing")}>
            Autorizo el tratamiento de mis datos personales y de salud para gestionar mi cita, según la{" "}
            <Link href="/politica-de-privacidad" target="_blank" className="font-semibold text-primary underline underline-offset-4">
              política de privacidad<span className="sr-only"> (se abre en otra pestaña)</span>
            </Link>{" "}
            (Ley N.° 29733).
          </Consent>
          <Consent name="telehealth" error={errors.telehealth} errorId={errorId("telehealth")} {...a11y("telehealth")}>
            Doy mi{" "}
            <Link href="/terminos#consentimiento-teleconsulta" target="_blank" className="font-semibold text-primary underline underline-offset-4">
              consentimiento informado para la teleconsulta<span className="sr-only"> (se abre en otra pestaña)</span>
            </Link>{" "}
            (Ley Marco de Telesalud, Ley N.° 30421).
          </Consent>
        </fieldset>

        {serverError ? (
          <div role="alert" className="mt-5 rounded-2xl border border-alert bg-alert-tint p-4 text-alert-strong">
            <p className="font-semibold">{serverError.message}</p>
            {serverError.slotTaken ? (
              <button type="button" onClick={onSlotTaken} className={buttonVariants({ variant: "outline", className: "mt-3" })}>
                Elegir otro horario
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={onBack} className={buttonVariants({ variant: "ghost" })}>
            <ArrowLeft aria-hidden /> Atrás
          </button>
          <button type="submit" disabled={sending} aria-busy={sending} className={buttonVariants({ size: "lg" })}>
            {sending ? <Loader2 aria-hidden className="animate-spin" /> : <CalendarCheck aria-hidden />}
            {sending ? "Reservando…" : "Confirmar mi cita"}
          </button>
        </div>
      </form>

      <aside className={cn(PANEL, "h-fit")} aria-label="Resumen de tu cita">
        <h2 className="font-display text-lg font-bold text-heading">Resumen</h2>
        {doctor ? (
          <div className="mt-4 flex items-center gap-3">
            <DoctorPortrait doctor={doctor} size={56} alt="" className="size-14 rounded-2xl" />
            <p className="text-sm">
              <span className="block font-semibold text-heading">{doctor.name}</span>
              <span className="text-muted">{doctor.title}</span>
            </p>
          </div>
        ) : null}
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-muted">Fecha y hora (Lima)</dt>
            <dd className="font-semibold text-heading first-letter:uppercase">{formatLimaDateTime(slotStart)}</dd>
          </div>
          <div>
            <dt className="text-muted">Modalidad</dt>
            <dd className="inline-flex items-center gap-1.5 font-semibold text-heading">
              <Video aria-hidden className="size-4 text-primary" /> Videollamada (Google Meet)
            </dd>
          </div>
          <div>
            <dt className="text-muted">Precio</dt>
            <dd className="font-semibold text-heading">{formatPrice(price.price)}</dd>
            <dd className="text-muted">{PAYMENT_PENDING}. Te lo confirmamos por WhatsApp.</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  errorId: string;
}

function TextField({ label, error, errorId, className, id, ...input }: TextFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="font-semibold text-heading">
        {label}
      </label>
      <input id={id} {...input} className={INPUT} />
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-alert-strong">
      {message}
    </p>
  );
}

interface ConsentProps {
  name: string;
  children: React.ReactNode;
  error?: string;
  errorId: string;
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
}

function Consent({ name, children, error, errorId, ...input }: ConsentProps) {
  return (
    <div>
      <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl p-1 text-base text-fg">
        <input type="checkbox" name={name} {...input} className="mt-0.5 size-5 shrink-0 accent-[var(--teal-strong)]" />
        <span>{children}</span>
      </label>
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}
