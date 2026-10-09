"use client";

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { BookingCalendar } from "@/components/consulta/BookingCalendar";
import { StepBar } from "@/components/consulta/StepBar";
import { TriageResult } from "@/components/consulta/TriageResult";
import { TriageWizard } from "@/components/consulta/TriageWizard";
import { useConsultaState } from "@/components/consulta/useConsultaState";
import { getBodyZone } from "@/data/bodyZones";
import { doctors } from "@/data/doctors";
import { getSpecialty } from "@/data/specialties";
import { triageNotes, type ConsultaService, type ConsultaState } from "@/lib/consulta/state";
import { EMPTY_ANSWERS, isComplete, triage, type TriageAnswers, type TriageEntry, type TriageResult as Result } from "@/lib/triage/engine";

/** El formulario (con zod para validar) se descarga solo al llegar al paso de datos. */
const BookingForm = dynamic(() => import("@/components/consulta/BookingForm").then((mod) => mod.BookingForm), {
  loading: () => <div aria-hidden className="h-[36rem] animate-pulse rounded-[1.75rem] bg-bg-alt" />,
});

interface ConsultaAppProps {
  /** Servicio preseleccionado desde un CTA (?servicio=…). No es un dato personal. */
  initialService: ConsultaService | null;
}

function defaultReason(entry: TriageEntry | null): string {
  if (!entry || entry.kind === "unsure") return "";
  if (entry.kind === "bone") return "Evaluación de salud ósea";
  if (entry.kind === "zone") return `Molestia en ${getBodyZone(entry.zone).label.toLowerCase()}`;
  return getSpecialty(entry.slug).name;
}

function safeTriage(answers: TriageAnswers): Result | null {
  try {
    return isComplete(answers) ? triage(answers) : null;
  } catch {
    return null;
  }
}

function initialFor(service: ConsultaService | null): Partial<ConsultaState> {
  if (service !== "densitometria") return { service };
  return { service, answers: { ...EMPTY_ANSWERS, entry: { kind: "bone" } } };
}

export function ConsultaApp({ initialService }: ConsultaAppProps) {
  // Sin skeleton: el primer paso (filtro de alarmas) se pinta desde el servidor → CLS 0.
  const { state, hydrated, update, reset } = useConsultaState(initialFor(initialService));
  const result = useMemo(() => safeTriage(state.answers), [state.answers]);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);

  // Al cambiar de paso: arriba y foco en el título (lectores de pantalla y teclado).
  useEffect(() => {
    if (!hydrated) return;
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    rootRef.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
  }, [state.step, hydrated]);

  function handleAnswers(answers: TriageAnswers) {
    const done = answers.redFlags.length > 0 || isComplete(answers);
    update({ answers, ...(done ? { step: "orientacion" as const, reason: state.reason || defaultReason(answers.entry) } : {}) });
  }

  function skipToCalendar() {
    update({ skipped: true, doctorId: doctors[0]?.slug ?? null, step: "horario", slotStart: null });
  }

  function book(doctorId: string) {
    update({ doctorId, step: "horario", slotStart: null, reason: state.reason || defaultReason(state.answers.entry) });
  }

  return (
    <div ref={rootRef} className="grid min-w-0 scroll-mt-24 gap-6 [&>*]:min-w-0">
      <StepBar current={state.step} />

      {state.step === "evaluacion" ? (
        <TriageWizard answers={state.answers} onChange={handleAnswers} onSkip={skipToCalendar} />
      ) : null}

      {state.step === "orientacion" && result ? <TriageResult result={result} onBook={book} onRestart={reset} /> : null}
      {state.step === "orientacion" && !result ? (
        <TriageWizard answers={state.answers} onChange={handleAnswers} onSkip={skipToCalendar} />
      ) : null}

      {state.step === "horario" && state.doctorId ? (
        <BookingCalendar
          doctorId={state.doctorId}
          selected={state.slotStart}
          onSelect={(slotStart) => update({ slotStart })}
          onBack={() => update({ step: state.skipped ? "evaluacion" : "orientacion", skipped: false })}
          onContinue={() => update({ step: "datos" })}
        />
      ) : null}

      {state.step === "datos" && state.doctorId && state.slotStart ? (
        <BookingForm
          doctorId={state.doctorId}
          slotStart={state.slotStart}
          reason={state.reason}
          triageSummary={triageNotes(result)}
          onReasonChange={(reason) => update({ reason })}
          onBack={() => update({ step: "horario" })}
          onSlotTaken={() => update({ step: "horario", slotStart: null })}
        />
      ) : null}
    </div>
  );
}
