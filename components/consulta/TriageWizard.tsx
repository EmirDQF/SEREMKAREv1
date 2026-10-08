"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bone, CircleHelp, Siren } from "lucide-react";
import { BodyMap } from "@/components/sections/BodyMap";
import { Scene3DSlot } from "@/components/3d/Scene3DSlot";
import { HINT, OptionButton, PANEL } from "@/components/consulta/ui";
import { buttonVariants } from "@/components/ui/button";
import { bodyZones, getBodyZone } from "@/data/bodyZones";
import { densitometry } from "@/data/densitometry";
import { specialties } from "@/data/specialties";
import { RED_FLAGS } from "@/data/teleconsult";
import {
  EMPTY_ANSWERS,
  nextQuestion,
  questionFlow,
  type QuestionId,
  type TriageAnswers,
  type TriageEntry,
} from "@/lib/triage/engine";
import type { BodyZoneId, RedFlagId } from "@/types/medical";
import { cn } from "@/lib/utils";

interface TriageWizardProps {
  answers: TriageAnswers;
  onChange: (answers: TriageAnswers) => void;
  /** «Ya sé lo que necesito»: salta la evaluación (el filtro de alarmas ya se respondió). */
  onSkip: () => void;
}

const TYPICAL_FLOW_LENGTH = 6;

const TITLES: Readonly<Record<QuestionId, { title: string; hint: string }>> = {
  redFlags: { title: "Antes de empezar: ¿tienes alguna de estas señales ahora?", hint: "Si marcas alguna, te indicaremos acudir a emergencias. Es por tu seguridad." },
  entry: { title: "¿Dónde sientes la molestia?", hint: "Toca una zona del cuerpo, o elige lo que te preocupa." },
  duration: { title: "¿Hace cuánto tienes la molestia?", hint: "Aproximadamente." },
  swelling: { title: "¿Notas hinchazón, calor o enrojecimiento en la articulación?", hint: "" },
  stiffness: { title: "¿Sientes rigidez al despertar?", hint: "Cuánto tardas en «soltarte» por la mañana." },
  backPattern: { title: "¿El dolor de espalda mejora con el movimiento y empeora en reposo?", hint: "" },
  boneRisks: { title: "Marca lo que aplica a tu caso", hint: "Nos ayuda a saber si una densitometría podría ser útil. Puedes no marcar ninguna." },
  priorExams: { title: "¿Tienes análisis, radiografías, ecografías o densitometrías previas?", hint: "" },
};

/** Borra la respuesta de una pregunta y de todas las siguientes (para «Atrás»). */
function clearFrom(question: QuestionId, answers: TriageAnswers): TriageAnswers {
  const flow = questionFlow(answers);
  const next = { ...answers };
  for (const id of flow.slice(flow.indexOf(question))) {
    if (id === "redFlags") Object.assign(next, { redFlagsChecked: false, redFlags: [] });
    else Object.assign(next, { [id]: EMPTY_ANSWERS[id] });
  }
  return next;
}

export function TriageWizard({ answers, onChange, onSkip }: TriageWizardProps) {
  const question = nextQuestion(answers) ?? "priorExams";
  const flow = questionFlow(answers);
  const index = flow.indexOf(question);
  // Hasta saber la zona, el total se estima con el camino más común (articulaciones: 6 preguntas).
  const total = answers.entry ? flow.length : TYPICAL_FLOW_LENGTH;
  const previous = index > 0 ? flow[index - 1] : null;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [question]);

  const set = (patch: Partial<TriageAnswers>) => onChange({ ...answers, ...patch });
  const { title, hint } = TITLES[question];

  return (
    <section className={PANEL} aria-labelledby="pregunta-titulo">
      <div aria-hidden className="mb-3 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-gradient-to-r from-coral to-teal transition-[width] duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <p className="text-sm font-semibold text-primary" aria-live="polite">
        Pregunta {index + 1} de {total}
      </p>
      <h1 id="pregunta-titulo" ref={headingRef} tabIndex={-1} className="mt-2 text-h2 text-heading focus:outline-none">
        {title}
      </h1>
      {hint ? <p className={HINT}>{hint}</p> : null}

      <div className="mt-6">
        <QuestionBody question={question} answers={answers} set={set} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {previous ? (
          <button type="button" onClick={() => onChange(clearFrom(previous, answers))} className={buttonVariants({ variant: "ghost" })}>
            <ArrowLeft aria-hidden /> Atrás
          </button>
        ) : (
          <span />
        )}
        {question === "entry" ? (
          <button type="button" onClick={onSkip} className="min-h-12 font-semibold text-primary underline-offset-4 hover:underline">
            Ya sé lo que necesito: ir a los horarios
          </button>
        ) : null}
      </div>
    </section>
  );
}

interface BodyProps {
  question: QuestionId;
  answers: TriageAnswers;
  set: (patch: Partial<TriageAnswers>) => void;
}

function QuestionBody({ question, answers, set }: BodyProps) {
  switch (question) {
    case "redFlags":
      return <RedFlagsQuestion onDone={(flags) => set({ redFlagsChecked: true, redFlags: flags })} />;
    case "entry":
      return <EntryQuestion onSelect={(entry) => set({ entry })} />;
    case "duration":
      return (
        <Choices
          options={[
            ["lt6w", "Menos de 6 semanas"],
            ["6w-3m", "De 6 semanas a 3 meses"],
            ["gt3m", "Más de 3 meses"],
          ]}
          onSelect={(duration) => set({ duration })}
        />
      );
    case "stiffness":
      return (
        <Choices
          options={[
            ["none", "No tengo rigidez"],
            ["lt30", "Sí, menos de 30 minutos"],
            ["gt30", "Sí, más de 30 minutos"],
          ]}
          onSelect={(stiffness) => set({ stiffness })}
        />
      );
    case "swelling":
      return <YesNo onSelect={(swelling) => set({ swelling })} />;
    case "backPattern":
      return <YesNo onSelect={(backPattern) => set({ backPattern })} />;
    case "priorExams":
      return <YesNo onSelect={(priorExams) => set({ priorExams })} yesHint="Tenlos a mano en tu consulta" />;
    case "boneRisks":
      return <BoneRisksQuestion onDone={(boneRisks) => set({ boneRisks })} initial={answers.boneRisks ?? {}} />;
  }
}

function Choices<T extends string>({ options, onSelect }: { options: readonly (readonly [T, string])[]; onSelect: (value: T) => void }) {
  return (
    <div role="radiogroup" className="grid gap-3">
      {options.map(([value, label]) => (
        <OptionButton key={value} selected={false} onSelect={() => onSelect(value)} title={label} />
      ))}
    </div>
  );
}

function YesNo({ onSelect, yesHint }: { onSelect: (value: boolean) => void; yesHint?: string }) {
  return (
    <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
      <OptionButton selected={false} onSelect={() => onSelect(true)} title="Sí" hint={yesHint} />
      <OptionButton selected={false} onSelect={() => onSelect(false)} title="No" />
    </div>
  );
}

function RedFlagsQuestion({ onDone }: { onDone: (flags: RedFlagId[]) => void }) {
  const [selected, setSelected] = useState<RedFlagId[]>([]);
  const toggle = (id: RedFlagId) => setSelected((current) => (current.includes(id) ? current.filter((f) => f !== id) : [...current, id]));
  return (
    <>
      <div className="grid gap-2.5">
        {RED_FLAGS.map((flag) => (
          <OptionButton
            key={flag.id}
            role="checkbox"
            tone="alert"
            selected={selected.includes(flag.id)}
            onSelect={() => toggle(flag.id)}
            title={flag.label}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onDone(selected)}
        className={buttonVariants({ variant: selected.length > 0 ? "secondary" : "primary", size: "lg", className: "mt-6 w-full sm:w-auto" })}
      >
        {selected.length > 0 ? (
          <>
            <Siren aria-hidden /> Continuar
          </>
        ) : (
          <>
            No tengo ninguna: continuar <ArrowRight aria-hidden />
          </>
        )}
      </button>
    </>
  );
}

function EntryQuestion({ onSelect }: { onSelect: (entry: TriageEntry) => void }) {
  const [zone, setZone] = useState<BodyZoneId | null>(null);
  const hologramProps = useMemo(
    () => ({ selected: zone, onSelect: (id: BodyZoneId) => setZone(id), onHover: () => undefined }),
    [zone],
  );
  const conditions = specialties.filter((s) => s.slug !== "osteoporosis");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr]">
      <div>
        <Scene3DSlot
          scene="hologram"
          interactive
          sceneProps={hologramProps}
          className="mx-auto aspect-[1/2] w-full max-w-[15rem]"
          fallback={<BodyMap zones={bodyZones} selected={zone} onSelect={setZone} />}
        />
        {/* Alternativa accesible siempre visible (el 3D no es operable con teclado ni lector). */}
        <div role="radiogroup" aria-label="Zona del cuerpo" className="mt-4 flex flex-wrap justify-center gap-2">
          {bodyZones.map((bodyZone) => (
            <button
              key={bodyZone.id}
              type="button"
              role="radio"
              aria-checked={zone === bodyZone.id}
              onClick={() => setZone(bodyZone.id)}
              className={cn(
                "min-h-11 rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-ring",
                zone === bodyZone.id ? "border-primary bg-primary text-on-primary" : "border-line bg-card-solid text-heading hover:border-primary",
              )}
            >
              {bodyZone.label}
            </button>
          ))}
        </div>
        {zone ? (
          <button
            type="button"
            onClick={() => onSelect({ kind: "zone", zone })}
            className={buttonVariants({ size: "lg", className: "mt-4 w-full" })}
          >
            Continuar con {getBodyZone(zone).label.toLowerCase()} <ArrowRight aria-hidden />
          </button>
        ) : null}
      </div>
      <div role="radiogroup" aria-labelledby="preocupa-titulo" className="grid content-start gap-3">
        <p id="preocupa-titulo" className="font-semibold text-heading">O elige lo que te preocupa:</p>
        {conditions.map((specialty) => (
          <OptionButton
            key={specialty.slug}
            selected={false}
            onSelect={() => onSelect({ kind: "condition", slug: specialty.slug })}
            title={specialty.name}
          />
        ))}
        <OptionButton selected={false} onSelect={() => onSelect({ kind: "bone" })} icon={<Bone />} title="Salud ósea / densitometría" hint="Osteoporosis, riesgo de fracturas" />
        <OptionButton selected={false} onSelect={() => onSelect({ kind: "unsure" })} icon={<CircleHelp />} title="No estoy seguro" />
      </div>
    </div>
  );
}

function BoneRisksQuestion({ onDone, initial }: { onDone: (risks: Record<string, boolean>) => void; initial: Readonly<Record<string, boolean>> }) {
  const [risks, setRisks] = useState<Record<string, boolean>>({ ...initial });
  return (
    <>
      <div className="grid gap-2.5">
        {densitometry.checklist.map((item) => (
          <OptionButton
            key={item.id}
            role="checkbox"
            selected={Boolean(risks[item.id])}
            onSelect={() => setRisks((current) => ({ ...current, [item.id]: !current[item.id] }))}
            title={item.question}
          />
        ))}
      </div>
      <button type="button" onClick={() => onDone(risks)} className={buttonVariants({ size: "lg", className: "mt-6 w-full sm:w-auto" })}>
        Continuar <ArrowRight aria-hidden />
      </button>
    </>
  );
}
