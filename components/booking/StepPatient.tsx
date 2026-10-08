"use client";

import { Activity, Bone, Footprints, Hand, PersonStanding, Stethoscope, User, Users, type LucideIcon } from "lucide-react";
import type { ComplaintId, RedFlagId } from "@/types/medical";
import { complaints } from "@/data/bodyZones";
import { RED_FLAGS, SINCE_OPTIONS } from "@/data/teleconsult";
import { AGE_LIMITS, hasRedFlags, withComplaint } from "@/lib/booking";
import { cn } from "@/lib/utils";
import { EmergencyNotice } from "@/components/booking/EmergencyNotice";
import { Choice, FieldError, HINT, INPUT, LEGEND, type StepProps } from "@/components/booking/ui";

const COMPLAINT_ICON: Record<ComplaintId, LucideIcon> = {
  articulaciones: Hand,
  espalda: PersonStanding,
  rodilla: Footprints,
  huesos: Bone,
  generalizado: Activity,
  general: Stethoscope,
};

const INTENSITY_DEFAULT = 5;

function WhoAndAge({ draft, errors, ids, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className={LEGEND}>¿Es para ti o para otra persona?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Choice name="forWhom" value="mi" current={draft.forWhom} onChange={(forWhom) => onChange({ ...draft, forWhom })} icon={<User aria-hidden strokeWidth={1.75} />} title="Para mí" hint="Soy el paciente" />
          <Choice name="forWhom" value="familiar" current={draft.forWhom} onChange={(forWhom) => onChange({ ...draft, forWhom })} icon={<Users aria-hidden strokeWidth={1.75} />} title="Para otra persona" hint="Agendo por un familiar" />
        </div>
      </fieldset>
      <div className="sm:max-w-xs">
        <label htmlFor={ids.field("age")} className={LEGEND}>
          {draft.forWhom === "mi" ? "¿Cuántos años tienes?" : "¿Cuántos años tiene el paciente?"}
        </label>
        <p id={`${ids.field("age")}-hint`} className={HINT}>
          Nos ayuda a elegir al doctor adecuado.
        </p>
        <input
          id={ids.field("age")}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={3}
          placeholder="Ej.: 54"
          value={draft.age}
          onChange={(e) => onChange({ ...draft, age: e.target.value.replace(/\D/g, "") })}
          aria-invalid={Boolean(errors.age)}
          aria-describedby={[`${ids.field("age")}-hint`, ids.describedBy("age")].filter(Boolean).join(" ")}
          className={cn(INPUT, "mt-2")}
        />
        <span className="sr-only">Entre {AGE_LIMITS.min} y {AGE_LIMITS.max} años.</span>
        <FieldError id={ids.error("age")} message={errors.age} />
      </div>
    </div>
  );
}

function ComplaintChips({ draft, errors, ids, onChange }: StepProps) {
  return (
    <fieldset aria-describedby={ids.describedBy("complaint")}>
      <legend className={LEGEND}>¿Qué te molesta más?</legend>
      <p className={HINT}>Elige una opción. Así te mostramos solo a los doctores que la atienden.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {complaints.map((complaint, index) => {
          const Icon = COMPLAINT_ICON[complaint.id];
          return (
            <Choice
              key={complaint.id}
              id={index === 0 ? ids.field("complaint") : undefined}
              name="complaint"
              value={complaint.id}
              current={draft.complaint}
              onChange={(id) => onChange(withComplaint(draft, id))}
              icon={<Icon aria-hidden strokeWidth={1.75} />}
              title={complaint.label}
              hint={complaint.hint}
              tone="pain"
            />
          );
        })}
      </div>
      <FieldError id={ids.error("complaint")} message={errors.complaint} />
    </fieldset>
  );
}

function OptionalDetails({ draft, onChange, ids }: StepProps) {
  const sliderId = `${ids.field("complaint")}-intensity`;
  const intensity = draft.intensity ?? INTENSITY_DEFAULT;
  return (
    <details className="group rounded-2xl border border-line bg-bg-alt/60 p-4" open={draft.intensity !== null || draft.since !== null}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-display font-semibold text-heading">
        Cuéntanos más (opcional)
        <span aria-hidden className="text-primary transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4 space-y-5">
        <div>
          <label htmlFor={sliderId} className="flex items-baseline justify-between text-sm font-semibold text-heading">
            Intensidad del dolor
            <output htmlFor={sliderId} className="font-display text-base text-pain-text">
              {draft.intensity === null ? "Sin indicar" : `${draft.intensity}/10`}
            </output>
          </label>
          <input
            id={sliderId}
            type="range"
            min={1}
            max={10}
            step={1}
            value={intensity}
            onChange={(e) => onChange({ ...draft, intensity: Number(e.target.value) })}
            aria-valuetext={draft.intensity === null ? "Sin indicar" : `${intensity} de 10`}
            className="mt-3 h-11 w-full cursor-pointer accent-[var(--pain)]"
          />
          <p className="flex justify-between text-xs text-muted" aria-hidden>
            <span>1 · leve</span>
            <span>10 · insoportable</span>
          </p>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold text-heading">¿Desde cuándo?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SINCE_OPTIONS.map((option) => (
              <label key={option.id} className={cn("flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ring", draft.since === option.id ? "border-primary bg-teal-tint text-primary" : "border-line-strong bg-card-solid text-heading")}>
                <input type="radio" name="since" value={option.id} checked={draft.since === option.id} onChange={() => onChange({ ...draft, since: option.id })} className="sr-only" />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  );
}

function toggleFlag(flags: readonly RedFlagId[], id: RedFlagId, on: boolean): RedFlagId[] {
  return on ? [...flags.filter((f) => f !== id), id] : flags.filter((f) => f !== id);
}

function RedFlags({ draft, errors, ids, onChange }: StepProps) {
  return (
    <fieldset className="space-y-3">
      <legend className={LEGEND}>¿Tienes alguna de estas señales ahora?</legend>
      <p className={HINT}>Márcalas solo si aplican. Nos ayudan a cuidarte.</p>
      <div className="grid gap-2">
        {RED_FLAGS.map((flag) => (
          <label key={flag.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-1 text-[0.95rem] text-fg">
            <input
              type="checkbox"
              checked={draft.redFlags.includes(flag.id)}
              onChange={(e) => {
                const redFlags = toggleFlag(draft.redFlags, flag.id, e.target.checked);
                onChange({ ...draft, redFlags });
              }}
              className="size-5 shrink-0 accent-[var(--alert)]"
            />
            {flag.label}
          </label>
        ))}
      </div>
      {hasRedFlags(draft) ? (
        <EmergencyNotice id={ids.field("redFlags")} />
      ) : null}
    </fieldset>
  );
}

/** Paso 1: quién consulta, edad, molestia, detalles opcionales y señales de alarma. */
export function StepPatient(props: StepProps) {
  return (
    <div className="space-y-7">
      <WhoAndAge {...props} />
      <ComplaintChips {...props} />
      <OptionalDetails {...props} />
      <RedFlags {...props} />
    </div>
  );
}
