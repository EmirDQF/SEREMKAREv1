"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { CheckCircle2, MessageCircleQuestion, RotateCcw } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { densitometry } from "@/data/densitometry";
import { checklistOutcome } from "@/lib/densitometry";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: true, label: "Sí" },
  { value: false, label: "No" },
] as const;

const OUTCOME_COPY = {
  "talk-to-specialist": {
    title: "Vale la pena conversarlo con un especialista",
    body: "Tus respuestas incluyen situaciones en las que suele recomendarse evaluar la salud de tus huesos.",
  },
  guidance: {
    title: "Si tienes dudas, igual podemos orientarte",
    body: "Ninguna de estas situaciones aplica hoy, pero cada caso es distinto. Escríbenos y te orientamos.",
  },
} as const;

/** "¿Debería hacerme una densitometría?": orienta según la lista de "¿Para quién es?". Nunca diagnostica. */
export function DensitometryChecklist() {
  const [answers, setAnswers] = useState<Readonly<Record<string, boolean>>>({});
  const total = densitometry.checklist.length;
  const answered = Object.keys(answers).length;
  const outcome = checklistOutcome(answers, total);

  function answer(id: string, value: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
      <ol className="space-y-3">
        {densitometry.checklist.map((item, index) => {
          const value = answers[item.id];
          return (
            <li key={item.id}>
              <fieldset className="flex flex-col gap-3 rounded-2xl border border-line bg-card-solid p-4 sm:flex-row sm:items-center sm:justify-between">
                <legend className="sr-only">{item.question}</legend>
                <p aria-hidden className="flex gap-3 text-fg">
                  <span className="font-mono text-sm text-subtle">{String(index + 1).padStart(2, "0")}</span>
                  {item.question}
                </p>
                <div className="flex shrink-0 gap-2">
                  {OPTIONS.map((option) => {
                    const checked = value === option.value;
                    return (
                      <label
                        key={option.label}
                        className={cn(
                          "relative inline-flex min-h-12 min-w-16 cursor-pointer items-center justify-center rounded-full border px-4 font-display font-semibold transition-colors",
                          "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                          checked
                            ? "border-transparent bg-navy text-white dark:bg-teal dark:text-navy"
                            : "border-line-strong text-heading hover:border-primary hover:text-primary",
                        )}
                      >
                        <input
                          type="radio"
                          name={`densitometria-${item.id}`}
                          className="sr-only"
                          checked={checked}
                          onChange={() => answer(item.id, option.value)}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="lg:sticky lg:top-28">
        <AnimatePresence mode="wait">
          {outcome === "pending" ? (
            <m.div
              key="pending"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              aria-live="polite"
              className="rounded-[1.75rem] border border-dashed border-line-strong p-6 text-center"
            >
              <MessageCircleQuestion aria-hidden strokeWidth={1.5} className="mx-auto size-10 text-teal" />
              <p className="mt-3 font-display text-lg font-bold text-heading">Responde las preguntas</p>
              <p className="mt-1 text-muted">
                {answered} de {total} respondidas. Te diremos si vale la pena conversarlo con un especialista.
              </p>
            </m.div>
          ) : (
            <m.div
              key={outcome}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              aria-live="polite"
              className="gradient-border rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-lift"
            >
              <CheckCircle2 aria-hidden strokeWidth={1.75} className="size-10 text-primary" />
              <p className="mt-3 font-display text-xl font-bold text-heading">{OUTCOME_COPY[outcome].title}</p>
              <p className="mt-2 text-fg">{OUTCOME_COPY[outcome].body}</p>
              <a
                href={clinicWhatsApp(densitometry.cta.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: outcome === "talk-to-specialist" ? "whatsapp" : "outline", size: "lg" }),
                  "mt-5 w-full",
                )}
              >
                <WhatsAppIcon />
                {densitometry.cta.label}
              </a>
              <p className="mt-3 text-sm text-muted">{densitometry.disclaimer}</p>
            </m.div>
          )}
        </AnimatePresence>
        {answered > 0 ? (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="mt-3 inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            <RotateCcw aria-hidden className="size-4" /> Empezar de nuevo
          </button>
        ) : null}
      </div>
    </div>
  );
}
