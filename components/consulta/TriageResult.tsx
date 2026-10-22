"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, FileText, RotateCcw, ShieldCheck, Stethoscope } from "lucide-react";
import { EmergencyNotice } from "@/components/booking/EmergencyNotice";
import { DemoBadge, PANEL } from "@/components/consulta/ui";
import { useSlots } from "@/components/consulta/slots-client";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { LocationWhatsAppPicker } from "@/components/shared/LocationWhatsAppPicker";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { doctors } from "@/data/doctors";
import { getSpecialty } from "@/data/specialties";
import { credentialsLabel } from "@/lib/doctor";
import { formatLimaDateTime } from "@/lib/lima-format";
import type { TriageResult as Result } from "@/lib/triage/engine";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface TriageResultProps {
  result: Result;
  onBook: (doctorId: string) => void;
  onRestart: () => void;
}

const DENSITOMETRY_MESSAGE = "Hola SERMEKARE, quisiera agendar una densitometría ósea.";
const IN_PERSON_MESSAGE = "Hola SERMEKARE, quisiera coordinar una evaluación presencial pronto.";

export function TriageResult({ result, onBook, onRestart }: TriageResultProps) {
  if (result.kind === "emergency") return <EmergencyScreen onRestart={onRestart} />;

  const doctor = doctors.find((d) => result.suggestedDoctorIds.includes(d.slug)) ?? doctors[0];
  const specialty = result.specialtySlug ? getSpecialty(result.specialtySlug) : null;
  const teleconsultFirst = result.recommendedService === "teleconsulta";

  return (
    <section className="grid gap-5" aria-labelledby="orientacion-titulo">
      <div className={PANEL}>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <Stethoscope aria-hidden className="size-4" /> Orientación (no es un diagnóstico)
        </p>
        <h1 id="orientacion-titulo" tabIndex={-1} className="mt-2 text-h2 text-heading focus:outline-none">
          Esto es lo que te recomendamos
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-fg" aria-live="polite">
          {result.message}
        </p>
        {result.urgency === "prioritaria" ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-coral-tint px-3 py-1 text-sm font-semibold text-heading">
            <span aria-hidden className="size-2 rounded-full bg-coral" /> Conviene atenderte pronto
          </p>
        ) : null}
        {result.bringExams ? (
          <p className="mt-4 flex items-start gap-2 text-base text-muted">
            <FileText aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
            Ten a mano tus exámenes previos. Puedes enviarlos por WhatsApp (foto o PDF) al agendar, así el doctor los revisa antes.
          </p>
        ) : null}
        {specialty ? (
          <Link href={`/especialidades/${specialty.slug}`} className="mt-4 inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
            Conoce más sobre {specialty.shortName.toLowerCase()} <ArrowRight aria-hidden className="size-4" />
          </Link>
        ) : null}
      </div>

      {doctor ? <DoctorCard doctorId={doctor.slug} /> : null}

      <div className={cn(PANEL, "grid gap-3 sm:flex sm:flex-wrap")}>
        {result.recommendedService === "densitometria" ? (
          <LocationWhatsAppPicker message={DENSITOMETRY_MESSAGE} triggerClassName={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>
            <CalendarClock aria-hidden /> Agendar densitometría (presencial)
          </LocationWhatsAppPicker>
        ) : null}
        {result.recommendedService === "presencial" ? (
          <a href={clinicWhatsApp(IN_PERSON_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
            <WhatsAppIcon /> Coordinar evaluación presencial<span className="sr-only"> (se abre en otra pestaña)</span>
          </a>
        ) : null}
        {doctor && (teleconsultFirst || result.alsoTeleconsult) ? (
          <button
            type="button"
            onClick={() => onBook(doctor.slug)}
            className={buttonVariants({ variant: teleconsultFirst ? "primary" : "outline", size: "lg" })}
          >
            Reservar mi teleconsulta <ArrowRight aria-hidden />
          </button>
        ) : null}
        <button type="button" onClick={onRestart} className={buttonVariants({ variant: "ghost" })}>
          <RotateCcw aria-hidden /> Empezar de nuevo
        </button>
      </div>

    </section>
  );
}

function DoctorCard({ doctorId }: { doctorId: string }) {
  const doctor = doctors.find((d) => d.slug === doctorId);
  const slots = useSlots(doctorId, "meet");
  if (!doctor) return null;
  const next = slots.status === "ready" ? slots.days[0]?.slots[0]?.start : undefined;

  return (
    <article className={cn(PANEL, "grid gap-4 md:grid-cols-[1fr_auto] md:items-center")}>
      <div className="flex items-center gap-4">
        <DoctorPortrait doctor={doctor} size={88} className="size-22 shrink-0 rounded-3xl" alt={doctor.photoAlt} />
        <div className="min-w-0">
          <p className="text-sm text-muted">Tu especialista</p>
          <h2 className="font-display text-xl font-bold text-heading">{doctor.name}</h2>
          <p className="font-medium text-primary">{doctor.title}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
            <ShieldCheck aria-hidden className="size-4 shrink-0 text-primary" /> {credentialsLabel(doctor)}
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-bg-alt px-4 py-3 text-sm" aria-live="polite">
        <p className="font-semibold text-heading">Próximo horario disponible</p>
        <p className="mt-0.5 text-muted">
          {slots.status === "loading" ? "Buscando…" : next ? `${formatLimaDateTime(next)} (hora de Lima)` : "Escríbenos por WhatsApp"}
        </p>
        {slots.status === "ready" && slots.isDemo ? <DemoBadge className="mt-2" /> : null}
      </div>
    </article>
  );
}

function EmergencyScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <section className={cn(PANEL, "border-alert")} aria-labelledby="emergencia-titulo">
      <h1 id="emergencia-titulo" tabIndex={-1} className="text-h2 text-heading focus:outline-none">
        Acude a emergencias ahora
      </h1>
      <p className="mt-3 text-lg text-fg">
        Por las señales que marcaste, lo más seguro es que te evalúen en persona de inmediato. No es un caso para teleconsulta.
      </p>
      <EmergencyNotice className="mt-6" />
      <button type="button" onClick={onRestart} className={buttonVariants({ variant: "ghost", className: "mt-6" })}>
        <RotateCcw aria-hidden /> Me equivoqué al marcar: volver a empezar
      </button>
    </section>
  );
}
