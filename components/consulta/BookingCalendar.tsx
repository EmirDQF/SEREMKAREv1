"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, RefreshCw } from "lucide-react";
import { DemoBadge, HINT, PANEL } from "@/components/consulta/ui";
import { useSlots } from "@/components/consulta/slots-client";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { doctors } from "@/data/doctors";
import type { SlotDay, SlotTime } from "@/lib/booking-provider/types";
import { formatLimaDay, formatLimaTime, limaHour } from "@/lib/lima-format";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  doctorId: string;
  selected: string | null;
  onSelect: (start: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const NOON = 12;
const EVENING = 18;
const GROUPS = [
  { id: "manana", label: "Mañana", test: (hour: number) => hour < NOON },
  { id: "tarde", label: "Tarde", test: (hour: number) => hour >= NOON && hour < EVENING },
  { id: "noche", label: "Noche", test: (hour: number) => hour >= EVENING },
] as const;

const EMPTY_MESSAGE = "Hola SERMEKARE, no encontré horarios en la web y quisiera agendar una teleconsulta.";

export function BookingCalendar({ doctorId, selected, onSelect, onBack, onContinue }: BookingCalendarProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const slots = useSlots(doctorId, "meet", reloadKey);
  const doctor = doctors.find((d) => d.slug === doctorId);
  const days = slots.status === "ready" ? slots.days : [];
  const selectedDay = selected ? days.find((day) => day.slots.some((slot) => slot.start === selected))?.date : undefined;
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const currentDate = activeDate ?? selectedDay ?? days[0]?.date ?? null;
  const currentDay = days.find((day) => day.date === currentDate);

  return (
    <section className={cn(PANEL, "min-w-0")} aria-labelledby="horario-titulo">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 id="horario-titulo" tabIndex={-1} className="text-h2 text-heading focus:outline-none">
            Elige el día y la hora
          </h1>
          <p className={cn(HINT, "inline-flex items-center gap-1.5")}>
            <Clock aria-hidden className="size-4" /> Todos los horarios están en <strong className="font-semibold text-heading">hora de Lima</strong>.
          </p>
        </div>
        {slots.status === "ready" && slots.isDemo ? <DemoBadge /> : null}
      </div>

      {doctor ? (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-bg-alt p-3">
          <DoctorPortrait doctor={doctor} size={48} alt="" className="size-12 rounded-xl" />
          <p className="text-sm">
            <span className="block font-semibold text-heading">{doctor.name}</span>
            <span className="text-muted">Teleconsulta por videollamada</span>
          </p>
        </div>
      ) : null}

      <div className="mt-6 min-w-0" aria-live="polite" aria-busy={slots.status === "loading"}>
        {slots.status === "loading" ? <CalendarSkeleton /> : null}
        {slots.status === "error" ? (
          <div className="rounded-2xl border border-line p-5">
            <p className="text-fg">{slots.message}</p>
            <button type="button" onClick={() => setReloadKey((k) => k + 1)} className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              <RefreshCw aria-hidden /> Reintentar
            </button>
            <p className="mt-3 text-sm text-muted">
              ¿Sigue sin cargar?{" "}
              <a href={clinicWhatsApp(EMPTY_MESSAGE)} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">
                Escríbenos por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
              </a>{" "}
              y te damos un horario.
            </p>
          </div>
        ) : null}
        {slots.status === "ready" && days.length === 0 ? <EmptyState /> : null}
        {slots.status === "ready" && days.length > 0 ? (
          <>
            <DayStrip days={days} current={currentDate} onPick={setActiveDate} />
            {currentDay ? <SlotGroups day={currentDay} selected={selected} onSelect={onSelect} /> : null}
          </>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className={buttonVariants({ variant: "ghost" })}>
          <ArrowLeft aria-hidden /> Atrás
        </button>
        <button type="button" disabled={!selected} onClick={onContinue} className={buttonVariants({ size: "lg" })}>
          Continuar {selected ? `· ${formatLimaTime(selected)}` : null} <ArrowRight aria-hidden />
        </button>
      </div>
    </section>
  );
}

function DayStrip({ days, current, onPick }: { days: readonly SlotDay[]; current: string | null; onPick: (date: string) => void }) {
  return (
    <div role="group" aria-label="Días con horarios" className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
      {days.map((day) => {
        const [weekday, ...rest] = formatLimaDay(day.date).split(", ");
        const active = day.date === current;
        return (
          <button
            key={day.date}
            type="button"
            aria-pressed={active}
            onClick={() => onPick(day.date)}
            className={cn(
              "min-h-16 min-w-24 shrink-0 snap-start rounded-2xl border px-3 py-2 text-left transition-colors",
              "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active ? "border-primary bg-primary text-on-primary" : "border-line bg-card-solid hover:border-primary/60",
            )}
          >
            <span className="block text-sm font-semibold capitalize">{weekday}</span>
            <span className={cn("block text-xs", active ? "opacity-90" : "text-muted")}>{rest.join(", ")}</span>
            <span className={cn("mt-0.5 block text-xs", active ? "opacity-90" : "text-muted")}>{day.slots.length} horarios</span>
          </button>
        );
      })}
    </div>
  );
}

function SlotGroups({ day, selected, onSelect }: { day: SlotDay; selected: string | null; onSelect: (start: string) => void }) {
  const groups = useMemo(
    () =>
      GROUPS.map((group) => ({ ...group, slots: day.slots.filter((slot: SlotTime) => group.test(limaHour(slot.start))) })).filter(
        (group) => group.slots.length > 0,
      ),
    [day],
  );
  return (
    <div className="mt-5 grid gap-5">
      {groups.map((group) => (
        <fieldset key={group.id}>
          <legend className="text-sm font-semibold uppercase tracking-wide text-muted">{group.label}</legend>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {group.slots.map((slot) => {
              const active = slot.start === selected;
              return (
                <button
                  key={slot.start}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(slot.start)}
                  className={cn(
                    "min-h-12 rounded-xl border text-sm font-semibold tabular-nums transition-colors",
                    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    active ? "border-primary bg-primary text-on-primary" : "border-line bg-card-solid text-heading hover:border-primary",
                  )}
                >
                  {formatLimaTime(slot.start)}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-16 w-24 shrink-0 rounded-2xl bg-bg-alt" />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="h-12 rounded-xl bg-bg-alt" />
        ))}
      </div>
      <span className="sr-only">Cargando horarios…</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong p-6 text-center">
      <p className="font-semibold text-heading">Sin horarios en los próximos días</p>
      <p className="mt-1 text-muted">Escríbenos por WhatsApp y te ayudamos a encontrar uno.</p>
      <a href={clinicWhatsApp(EMPTY_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", className: "mt-4" })}>
        <WhatsAppIcon /> Escríbenos por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
    </div>
  );
}
