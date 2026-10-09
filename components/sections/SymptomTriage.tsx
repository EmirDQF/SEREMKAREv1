"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { AlertTriangle, ArrowUpRight, PersonStanding, Stethoscope, Tags } from "lucide-react";
import type { BodyZoneId, Doctor, SpecialtySlug } from "@/types/medical";
import { BodyMap } from "@/components/sections/BodyMap";
import { Scene3DSlot } from "@/components/3d/Scene3DSlot";
import { ConditionShowcase } from "@/components/sections/ConditionShowcase";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MedicalDisclaimer } from "@/components/shared/MedicalDisclaimer";
import { CONSULTA_PATH, prefillConsulta } from "@/components/consulta/handoff";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { bodyZones, getBodyZone } from "@/data/bodyZones";
import { getSpecialty, specialties } from "@/data/specialties";
import { getDoctor } from "@/data/doctors";
import { DENSITOMETRY_PATH } from "@/data/densitometry";
import { TRIAGE_EVENT, TRIAGE_SECTION_ID, type TriageTarget } from "@/lib/triage-events";
import { clinicWhatsApp, messageAbout } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type TriageMode = "zona" | "condicion";

/** D3: solo lo respaldado (teleconsulta reumatológica); sin procedimientos no confirmados. */
const CONSULT_APPROACH =
  "Te orientamos en una teleconsulta con nuestro especialista en reumatología: revisamos tus exámenes y armamos tu plan de tratamiento.";

/** Pestañas sobre el fondo navy: activa en teal (contraste AA con texto navy). */
const IMMERSIVE_TRIGGER =
  "text-slate-300 hover:text-white data-[state=active]:bg-teal data-[state=active]:text-navy dark:data-[state=active]:bg-teal";

interface TriageResult {
  key: string;
  title: string;
  description: string;
  alertSigns: readonly string[];
  approach: string;
  target: TriageTarget;
  specialtyName: string;
  specialtySlug: SpecialtySlug;
  doctor: Doctor;
  topic: string;
}

const triageSpecialties = specialties.filter((s) => s.inTriage);

function resultForTarget(target: TriageTarget): TriageResult {
  if (target.kind === "zone") {
    const zone = getBodyZone(target.zone);
    const specialty = getSpecialty(zone.specialtySlug);
    return {
      key: `zone-${zone.id}`,
      title: `Dolor en ${zone.label.toLowerCase()}`,
      description: `Puede deberse a: ${zone.possibleCauses}`,
      alertSigns: zone.alertSigns,
      approach: zone.approach,
      target,
      specialtyName: specialty.shortName,
      specialtySlug: specialty.slug,
      doctor: getDoctor(zone.doctorSlug),
      topic: `dolor en ${zone.label}`,
    };
  }
  const specialty = getSpecialty(target.slug);
  return {
    key: `condition-${specialty.slug}`,
    title: specialty.name,
    description: specialty.summary,
    alertSigns: specialty.alertSigns,
    approach: specialty.approach,
    target,
    specialtyName: specialty.shortName,
    specialtySlug: specialty.slug,
    doctor: getDoctor(specialty.doctorSlug),
    topic: specialty.shortName,
  };
}

function ResultCard({ result }: { result: TriageResult }) {
  return (
    <m.article
      key={result.key}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      className="gradient-border rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-lift sm:p-8"
    >
      <h3 className="text-h3">{result.title}</h3>
      <p className="mt-2 text-muted">{result.description}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-coral-tint p-4">
          <p className="flex items-center gap-2 font-display font-semibold text-heading">
            <AlertTriangle aria-hidden strokeWidth={1.75} className="size-5 text-coral" />
            Señales de alerta
          </p>
          <ul className="mt-2 space-y-1.5 text-[0.95rem] text-fg">
            {result.alertSigns.map((sign) => (
              <li key={sign} className="flex gap-2">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-coral" />
                {sign}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-teal-tint p-4">
          <p className="flex items-center gap-2 font-display font-semibold text-heading">
            <Stethoscope aria-hidden strokeWidth={1.75} className="size-5 text-primary" />
            Cómo te ayudamos
          </p>
          <p className="mt-2 text-[0.95rem] text-fg">{CONSULT_APPROACH}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line p-4 sm:flex-row sm:items-center">
        <DoctorPortrait doctor={result.doctor} size={64} className="size-16 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">Especialista recomendado · {result.specialtyName}</p>
          <Link
            href={`/staff/${result.doctor.slug}`}
            className="inline-flex items-center gap-1 font-display font-semibold text-heading hover:text-primary"
          >
            {result.doctor.name}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          <p className="text-sm text-muted">{result.doctor.specialty}</p>
        </div>
      </div>

      {result.specialtySlug === "osteoporosis" ? (
        <Link
          href={DENSITOMETRY_PATH}
          className="mt-4 inline-flex min-h-12 items-center gap-1.5 font-display font-semibold text-primary hover:underline"
        >
          Todo sobre la densitometría ósea <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      ) : null}

      <Link
        href={CONSULTA_PATH}
        onClick={() => prefillConsulta(result.target.kind === "zone" ? { kind: "zone", zone: result.target.zone } : { kind: "condition", slug: result.target.slug })}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6 w-full")}
      >
        Continuar en el consultorio virtual
      </Link>
      <a
        href={clinicWhatsApp(messageAbout(result.topic, result.doctor.name))}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }), "mt-3 w-full")}
      >
        <WhatsAppIcon />
        Prefiero escribir por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
    </m.article>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full min-h-72 place-items-center rounded-[1.75rem] border border-dashed border-white/20 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
      <div>
        <PersonStanding aria-hidden strokeWidth={1.5} className="mx-auto size-12 text-teal-300" />
        <p className="mt-4 font-display text-xl font-bold text-white">Elige una zona o una condición</p>
        <p className="mt-2 text-slate-300">Te mostraremos señales de alerta, cómo lo tratamos y qué especialista te puede ayudar.</p>
      </div>
    </div>
  );
}

interface ZoneChipsProps {
  selected: BodyZoneId | null;
  onSelect: (zone: BodyZoneId) => void;
  /** Sin 3D, el BodyMap ya trae sus botones: los chips solo reservan su espacio (sin CLS). */
  hidden: boolean;
}

/** Alternativa accesible al holograma: un botón de 48 px por zona (teclado y lectores de pantalla). */
function ZoneChips({ selected, onSelect, hidden }: ZoneChipsProps) {
  return (
    <ul
      aria-label="Zonas del cuerpo"
      className={cn(
        "no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0",
        hidden && "invisible",
      )}
    >
      {bodyZones.map((zone) => {
        const active = selected === zone.id;
        return (
          <li key={zone.id} className="shrink-0">
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(zone.id)}
              className={cn(
                "min-h-12 rounded-full border px-4 font-display text-[0.95rem] font-semibold transition-colors",
                active
                  ? "border-transparent bg-teal text-navy"
                  : "border-white/15 bg-white/5 text-white hover:border-teal-300 hover:text-teal-200",
              )}
            >
              {zone.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const HOLOGRAM_HINT = "Toca un punto del holograma o elige una zona";

/** "¿Dónde te duele?": triage orientativo por zona del cuerpo o por condición (fondo navy inmersivo + holograma 3D). */
export function SymptomTriage() {
  const [mode, setMode] = useState<TriageMode>("zona");
  const [target, setTarget] = useState<TriageTarget | null>(null);
  const [hologramOn, setHologramOn] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<BodyZoneId | null>(null);

  useEffect(() => {
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<TriageTarget>).detail;
      setMode(detail.kind === "zone" ? "zona" : "condicion");
      setTarget(detail);
    };
    window.addEventListener(TRIAGE_EVENT, handle);
    return () => window.removeEventListener(TRIAGE_EVENT, handle);
  }, []);

  const result = target ? resultForTarget(target) : null;
  const selectedZone: BodyZoneId | null = target?.kind === "zone" ? target.zone : null;
  const selectedCondition: SpecialtySlug | null = target?.kind === "condition" ? target.slug : null;

  const selectZone = useCallback((zone: BodyZoneId) => setTarget({ kind: "zone", zone }), []);
  const hologramProps = useMemo(
    () => ({ selected: selectedZone, onSelect: selectZone, onHover: setHoveredZone }),
    [selectedZone, selectZone],
  );
  const captionZone = hoveredZone ?? selectedZone;
  const caption = captionZone ? getBodyZone(captionZone).label : HOLOGRAM_HINT;

  return (
    <section
      id={TRIAGE_SECTION_ID}
      aria-labelledby="triage-title"
      className="section-y relative isolate overflow-hidden rounded-[2.5rem] bg-navy text-slate-200 lg:rounded-[4rem] dark:bg-[#071222]"
    >
      <div aria-hidden className="immersive-glow -z-10" />
      <div aria-hidden className="immersive-grid -z-10" />
      <div className="container-page">
        <SectionHeading
          tone="inverted"
          id="triage-title"
          eyebrow="Orientación en 1 minuto"
          title="¿Dónde te duele?"
          accent="duele?"
          description="Toca la zona de tu cuerpo o elige una condición. Te orientamos sobre qué puede ser y con quién atenderte."
        />

        <Tabs value={mode} onValueChange={(value) => setMode(value as TriageMode)} className="mt-10">
          <div className="flex justify-center">
            <TabsList aria-label="Modo de búsqueda" className="border-white/10 bg-white/5 shadow-none backdrop-blur-md">
              <TabsTrigger value="zona" className={IMMERSIVE_TRIGGER}>
                <PersonStanding aria-hidden strokeWidth={1.75} /> Por zona
              </TabsTrigger>
              <TabsTrigger value="condicion" className={IMMERSIVE_TRIGGER}>
                <Tags aria-hidden strokeWidth={1.75} /> Por condición
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <TabsContent value="zona">
                <Scene3DSlot
                  scene="hologram"
                  interactive
                  sceneProps={hologramProps}
                  onShowingChange={setHologramOn}
                  className="mx-auto aspect-[3/4] w-full max-w-[25rem]"
                  fallback={
                    <div className="grid size-full place-items-center">
                      <BodyMap zones={bodyZones} selected={selectedZone} onSelect={selectZone} />
                    </div>
                  }
                />
                <p
                  aria-hidden
                  className={cn(
                    "mt-3 text-center font-display text-sm font-semibold tracking-wide text-teal-200",
                    !hologramOn && "invisible",
                  )}
                >
                  {caption}
                </p>
                <ZoneChips selected={selectedZone} onSelect={selectZone} hidden={!hologramOn} />
              </TabsContent>
              <TabsContent value="condicion">
                <ConditionShowcase selected={selectedCondition} />
                <ul className="flex flex-wrap justify-center gap-3 lg:justify-start" aria-label="Condiciones">
                  {triageSpecialties.map((specialty) => {
                    const active = selectedCondition === specialty.slug;
                    return (
                      <li key={specialty.slug}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setTarget({ kind: "condition", slug: specialty.slug })}
                          className={cn(
                            "min-h-12 rounded-full border px-5 font-display font-semibold transition-colors",
                            active
                              ? "border-transparent bg-teal text-navy"
                              : "border-white/15 bg-white/5 text-white hover:border-teal-300 hover:text-teal-200",
                          )}
                        >
                          {specialty.shortName}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </TabsContent>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {result ? <ResultCard key={result.key} result={result} /> : <EmptyState key="empty" />}
              </AnimatePresence>
              <MedicalDisclaimer tone="inverted" />
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
