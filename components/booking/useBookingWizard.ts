"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import type { BookingDraft, BookingErrors, BookingField, BookingPrefill, BookingStep } from "@/types/medical";
import { doctors } from "@/data/doctors";
import {
  EMPTY_DRAFT,
  applyPrefill,
  buildTeleconsultMessage,
  firstInvalidStep,
  validateStep1,
  validateStep2,
  validateStep3,
} from "@/lib/booking";
import { BOOKING_EVENT } from "@/lib/triage-events";
import { clinicWhatsApp } from "@/lib/whatsapp";
import type { FieldIds } from "@/components/booking/ui";

const FIELD_ORDER: Readonly<Record<BookingStep, readonly BookingField[]>> = {
  1: ["age", "complaint", "redFlags"],
  2: ["doctor", "slot"],
  3: ["fullName", "phone", "consent"],
};

const VALIDATE: Readonly<Record<BookingStep, (draft: BookingDraft, now: Date) => BookingErrors>> = {
  1: (draft) => validateStep1(draft),
  2: (draft, now) => validateStep2(draft, now),
  3: (draft) => validateStep3(draft),
};

const hasErrors = (errors: BookingErrors) => Object.keys(errors).length > 0;

/** Estado y navegación del agendador de 3 pasos (los datos se conservan al volver atrás). */
export function useBookingWizard() {
  const baseId = useId();
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [step, setStep] = useState<BookingStep>(1);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  /** Id del elemento a enfocar tras el próximo render (título del paso o primer campo con error). */
  const pendingFocus = useRef<string | "heading" | null>(null);

  const ids = useMemo<FieldIds>(
    () => ({
      field: (name) => `${baseId}-${name}`,
      error: (name) => `${baseId}-${name}-error`,
      describedBy: (name) => (errors[name] ? `${baseId}-${name}-error` : undefined),
    }),
    [baseId, errors],
  );

  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === "heading") headingRef.current?.focus();
    else if (target) document.getElementById(target)?.focus();
  }, [step, errors]);

  useEffect(() => {
    const handle = (event: Event) => {
      const prefill = (event as CustomEvent<BookingPrefill>).detail;
      setDraft((current) => applyPrefill(current, prefill));
      setSentMessage(null);
      setErrors({});
      setStep(1);
    };
    window.addEventListener(BOOKING_EVENT, handle);
    return () => window.removeEventListener(BOOKING_EVENT, handle);
  }, []);

  const goTo = useCallback((next: BookingStep) => {
    pendingFocus.current = "heading";
    setErrors({});
    setStep(next);
  }, []);

  function showErrors(target: BookingStep, found: BookingErrors) {
    const first = FIELD_ORDER[target].find((field) => found[field]);
    pendingFocus.current = first ? ids.field(first) : "heading";
    setStep(target);
    setErrors(found);
  }

  function next() {
    const found = VALIDATE[step](draft, new Date());
    if (hasErrors(found)) return showErrors(step, found);
    if (step < 3) goTo((step + 1) as BookingStep);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) return next();
    const now = new Date();
    const invalid = firstInvalidStep(draft, now);
    if (invalid) return showErrors(invalid, VALIDATE[invalid](draft, now));
    const doctorName = doctors.find((d) => d.slug === draft.doctorSlug)?.name ?? "";
    const message = buildTeleconsultMessage(draft, doctorName);
    window.open(clinicWhatsApp(message), "_blank", "noopener,noreferrer");
    setSentMessage(message);
  }

  function reset() {
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setSentMessage(null);
    goTo(1);
  }

  return { draft, setDraft, step, errors, ids, sentMessage, headingRef, goTo, next, submit, reset };
}
