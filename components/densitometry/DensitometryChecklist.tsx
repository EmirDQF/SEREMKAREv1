"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircleQuestion, RotateCcw } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { densitometry } from "@/data/densitometry";
import { checklistOutcome } from "@/lib/densitometry";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
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

const NAME_PREFIX = "densitometria-";

/** Respuestas del formulario (radios nativos, sin estado por pregunta). */
function readAnswers(form: HTMLFormElement): Record<string, boolean> {
  const answers: Record<string, boolean> = {};
  for (const [name, value] of new FormData(form)) {
    if (name.startsWith(NAME_PREFIX)) answers[name.slice(NAME_PREFIX.length)] = value === "si";
  }
  return answers;
}

/**
 * "¿Debería hacerme una densitometría?": orienta según la lista de "¿Para quién es?". Nunca diagnostica.
 * Radios nativos dentro de un <form> (la opción marcada se pinta con CSS `has-checked`); el único estado
 * es el resultado. Sin motion: el resultado entra con un fundido CSS.
 */
export function DensitometryChecklist() {
  const [answers, setAnswers] = useState<Readonly<Record<string, boolean>>>({});
  const total = densitometry.checklist.length;
  const answered = Object.keys(answers).length;
  const outcome = checklistOutcome(answers, total);

  const update = (event: FormEvent<HTMLFormElement>) => setAnswers(readAnswers(event.currentTarget));

  return (
    <form
      onChange={update}
      onReset={() => setAnswers({})}
      className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start"
    >
      <ol className="space-y-3">
        {densitometry.checklist.map((item, index) => (
          <li key={item.id}>
            <fieldset className="flex flex-col gap-3 rounded-2xl border border-line bg-card-solid p-4 sm:flex-row sm:items-center sm:justify-between">
              <legend className="sr-only">{item.question}</legend>
              <p aria-hidden className="flex gap-3 text-fg">
                <span className="font-mono text-sm text-subtle">{String(index + 1).padStart(2, "0")}</span>
                {item.question}
              </p>
              <div className="flex shrink-0 gap-2">
                {OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "relative inline-flex min-h-12 min-w-16 cursor-pointer items-center justify-center rounded-full border border-line-strong px-4 font-display font-semibold text-heading transition-colors hover:border-primary hover:text-primary",
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                      "has-checked:border-transparent has-checked:bg-navy has-checked:text-white dark:has-checked:bg-teal dark:has-checked:text-on-primary",
                    )}
                  >
                    <input type="radio" name={`${NAME_PREFIX}${item.id}`} value={option.value} className="sr-only" />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div className="lg:sticky lg:top-28">
        {outcome === "pending" ? (
          <div aria-live="polite" className="rounded-[1.75rem] border border-dashed border-line-strong p-6 text-center">
            <MessageCircleQuestion aria-hidden strokeWidth={1.5} className="mx-auto size-10 text-teal" />
            <p className="mt-3 font-display text-lg font-bold text-heading">Responde las preguntas</p>
            <p className="mt-1 text-muted">
              <span className="nums">
                {answered} de {total}
              </span>{" "}
              respondidas. Te diremos si vale la pena conversarlo con un especialista.
            </p>
          </div>
        ) : (
          <div
            key={outcome}
            aria-live="polite"
            className="animate-fade-in glow-card rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-lift"
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
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
            <p className="mt-3 text-sm text-muted">{densitometry.disclaimer}</p>
          </div>
        )}
        {answered > 0 ? (
          <button
            type="reset"
            className="mt-3 inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            <RotateCcw aria-hidden className="size-4" /> Empezar de nuevo
          </button>
        ) : null}
      </div>
    </form>
  );
}
