"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Copy, Mail, RotateCcw } from "lucide-react";
import { SuccessBurst } from "@/components/shared/SuccessBurst";
import { buttonVariants } from "@/components/ui/button";
import { legal } from "@/data/legal";
import { site } from "@/data/site";
import {
  COMPLAINT_LIMITS,
  buildComplaintMessage,
  validateComplaint,
  type Complaint,
  type ComplaintErrors,
  type ComplaintField,
} from "@/lib/complaints";
import { todayISO } from "@/lib/schedule";
import { buildMailtoLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const INPUT =
  "min-h-12 w-full rounded-2xl border border-line-strong bg-card-solid px-4 text-fg placeholder:text-subtle transition-colors focus:border-primary focus:outline-none aria-[invalid=true]:border-coral";

const FIELD_ORDER: readonly ComplaintField[] = [
  "fullName",
  "documentNumber",
  "email",
  "phone",
  "address",
  "guardianName",
  "serviceDescription",
  "detail",
  "request",
  "consent",
];

const EMPTY: Complaint = {
  kind: "reclamo",
  fullName: "",
  documentType: "DNI",
  documentNumber: "",
  email: "",
  phone: "",
  address: "",
  isMinor: false,
  guardianName: "",
  serviceDescription: "",
  amount: "",
  detail: "",
  request: "",
};

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-display font-semibold text-heading">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-sm text-muted">{hint}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Hoja de reclamación virtual: valida los datos y genera la constancia para enviarla por correo.
 * PROVISIONAL: conectar a un sistema que asigne el número correlativo y envíe la copia automáticamente.
 */
export function ComplaintForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [complaint, setComplaint] = useState<Complaint>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ComplaintErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fieldId = (field: ComplaintField) => `${uid}-${field}`;

  function update<K extends keyof Complaint>(field: K, value: Complaint[K]) {
    setComplaint((prev) => ({ ...prev, [field]: value }));
  }

  function bind(field: "fullName" | "documentNumber" | "email" | "phone" | "address" | "guardianName" | "serviceDescription" | "amount") {
    return {
      id: fieldId(field),
      value: complaint[field],
      onChange: (event: ChangeEvent<HTMLInputElement>) => update(field, event.target.value),
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `${fieldId(field)}-error` : undefined,
      className: INPUT,
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateComplaint(complaint, consent);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstInvalid))}`)?.focus();
      return;
    }
    setMessage(buildComplaintMessage(complaint, todayISO(site.timeZone)));
  }

  async function copyMessage() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setComplaint(EMPTY);
    setConsent(false);
    setErrors({});
    setMessage(null);
    setCopied(false);
  }

  if (message) {
    const subject = `Libro de Reclamaciones — ${complaint.kind === "reclamo" ? "Reclamo" : "Queja"} de ${complaint.fullName.trim()}`;
    return (
      <div role="status" className="rounded-[1.75rem] border border-line bg-card-solid p-6 text-center shadow-lift sm:p-8">
        <SuccessBurst />
        <h3 className="text-h3 mt-4">Tu {complaint.kind} está lista para enviarse</h3>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          Envíala por correo a {legal.complaintsEmail}. Conserva el correo enviado como constancia: te responderemos en un plazo
          máximo de {legal.responseDays} días hábiles.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={buildMailtoLink(legal.complaintsEmail, subject, message)} className={buttonVariants({ variant: "primary", size: "lg" })}>
            <Mail aria-hidden strokeWidth={1.75} /> Enviar por correo
          </a>
          <button type="button" onClick={copyMessage} className={buttonVariants({ variant: "outline", size: "lg" })}>
            <Copy aria-hidden strokeWidth={1.75} /> {copied ? "Copiada" : "Copiar constancia"}
          </button>
        </div>
        <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-bg-alt p-4 text-left text-sm text-fg" data-lenis-prevent>
          {message}
        </pre>
        <button type="button" onClick={reset} className="mt-5 inline-flex min-h-12 items-center gap-2 font-semibold text-primary hover:underline">
          <RotateCcw aria-hidden className="size-4" /> Registrar otra
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8 rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft sm:p-8">
      <fieldset>
        <legend className="font-display text-lg font-bold text-heading">Tipo</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(["reclamo", "queja"] as const).map((kind) => (
            <label
              key={kind}
              className={cn(
                "flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ring",
                complaint.kind === kind ? "border-primary bg-teal-tint" : "border-line-strong hover:border-primary",
              )}
            >
              <input type="radio" name="tipo" checked={complaint.kind === kind} onChange={() => update("kind", kind)} className="mt-1 size-5 accent-[var(--teal-strong)]" />
              <span>
                <span className="block font-display font-semibold capitalize text-heading">{kind}</span>
                <span className="block text-sm text-muted">
                  {kind === "reclamo" ? "Disconformidad con el servicio contratado." : "Malestar con la atención, no relacionado con el servicio."}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="font-display text-lg font-bold text-heading sm:col-span-2">1. Tus datos</legend>
        <div className="sm:col-span-2">
          <Field id={fieldId("fullName")} label="Nombre completo" error={errors.fullName}>
            <input {...bind("fullName")} autoComplete="name" maxLength={COMPLAINT_LIMITS.name} />
          </Field>
        </div>
        <Field id={`${uid}-documentType`} label="Tipo de documento">
          <select
            id={`${uid}-documentType`}
            value={complaint.documentType}
            onChange={(event) => update("documentType", event.target.value as Complaint["documentType"])}
            className={INPUT}
          >
            <option value="DNI">DNI</option>
            <option value="CE">Carné de extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </Field>
        <Field id={fieldId("documentNumber")} label="Número de documento" error={errors.documentNumber}>
          <input {...bind("documentNumber")} inputMode={complaint.documentType === "DNI" ? "numeric" : "text"} maxLength={15} />
        </Field>
        <Field id={fieldId("email")} label="Correo electrónico" error={errors.email}>
          <input {...bind("email")} type="email" autoComplete="email" />
        </Field>
        <Field id={fieldId("phone")} label="Teléfono" error={errors.phone}>
          <input {...bind("phone")} type="tel" autoComplete="tel" />
        </Field>
        <div className="sm:col-span-2">
          <Field id={fieldId("address")} label="Dirección" error={errors.address}>
            <input {...bind("address")} autoComplete="street-address" maxLength={COMPLAINT_LIMITS.address} />
          </Field>
        </div>
        <label className="flex min-h-12 items-center gap-3 sm:col-span-2">
          <input type="checkbox" checked={complaint.isMinor} onChange={(event) => update("isMinor", event.target.checked)} className="size-5 accent-[var(--teal-strong)]" />
          <span className="text-fg">Soy menor de edad</span>
        </label>
        {complaint.isMinor ? (
          <div className="sm:col-span-2">
            <Field id={fieldId("guardianName")} label="Nombre del padre, madre o apoderado" error={errors.guardianName}>
              <input {...bind("guardianName")} maxLength={COMPLAINT_LIMITS.name} />
            </Field>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="font-display text-lg font-bold text-heading sm:col-span-2">2. Servicio contratado</legend>
        <Field id={fieldId("serviceDescription")} label="Servicio" error={errors.serviceDescription} hint="Por ejemplo: consulta de reumatología.">
          <input {...bind("serviceDescription")} maxLength={COMPLAINT_LIMITS.service} />
        </Field>
        <Field id={fieldId("amount")} label="Monto reclamado (opcional)" hint="En soles.">
          <input {...bind("amount")} inputMode="decimal" maxLength={12} />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-lg font-bold text-heading">3. Detalle</legend>
        <Field id={fieldId("detail")} label={`Detalle del ${complaint.kind}`} error={errors.detail}>
          <textarea
            id={fieldId("detail")}
            value={complaint.detail}
            onChange={(event) => update("detail", event.target.value)}
            aria-invalid={errors.detail ? true : undefined}
            aria-describedby={errors.detail ? `${fieldId("detail")}-error` : undefined}
            maxLength={COMPLAINT_LIMITS.detail}
            rows={5}
            className={cn(INPUT, "py-3")}
          />
        </Field>
        <Field id={fieldId("request")} label="Pedido" error={errors.request} hint="¿Qué solicitas para resolverlo?">
          <textarea
            id={fieldId("request")}
            value={complaint.request}
            onChange={(event) => update("request", event.target.value)}
            aria-invalid={errors.request ? true : undefined}
            aria-describedby={errors.request ? `${fieldId("request")}-error` : undefined}
            maxLength={COMPLAINT_LIMITS.request}
            rows={3}
            className={cn(INPUT, "py-3")}
          />
        </Field>
      </fieldset>

      <div>
        <label className="flex items-start gap-3">
          <input
            id={fieldId("consent")}
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${fieldId("consent")}-error` : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--teal-strong)]"
          />
          <span className="text-fg">
            Autorizo el tratamiento de mis datos para atender mi {complaint.kind}, conforme a la{" "}
            <Link href="/politica-de-privacidad" className="font-semibold text-primary underline">
              política de privacidad
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p id={`${fieldId("consent")}-error`} className="mt-1.5 text-sm font-medium text-alert">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <button type="submit" className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>
        Generar hoja de {complaint.kind}
      </button>
    </form>
  );
}
