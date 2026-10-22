import Link from "next/link";
import { ArrowRight, ScanLine } from "lucide-react";
import { IconBadge } from "@/components/shared/Icon";
import { buttonVariants } from "@/components/ui/button";
import { DENSITOMETRY_BOOKING_HREF } from "@/data/navigation";
import { servicePath } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { ServicePillar } from "@/types/medical";

/** Servicios que se listan en las tarjetas medianas (la grande los muestra todos). */
const SHORT_LIST = 4;

/** 3×3 zonas del foco que sigue al puntero (CSS puro). */
const BENTO_ZONES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

interface PillarCardProps {
  pillar: ServicePillar;
  /** Número del pilar en el modelo de atención (1–4). */
  index: number;
}

/**
 * Pilar del modelo de atención integral (bento). Componente de servidor, sin 3D: icono, número en
 * monoespaciada, frase simple, lista corta con cada término explicado y «ver todos». El de diagnóstico
 * lleva «Agendar densitometría». Con mouse, un foco de luz sigue al puntero (CSS, sin JS).
 */
export function PillarCard({ pillar, index }: PillarCardProps) {
  const isLarge = pillar.size === "lg";
  const shown = isLarge ? pillar.services : pillar.services.slice(0, SHORT_LIST);
  const isDiagnostic = pillar.slug === "apoyo-diagnostico";
  return (
    <article
      aria-labelledby={`pilar-${pillar.slug}`}
      className={cn(
        "bento-card group/pillar flex h-full flex-col rounded-[1.75rem] border border-line bg-card-solid shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-lift",
        isLarge && "bg-[linear-gradient(160deg,var(--card-solid)_50%,var(--teal-tint))]",
      )}
    >
      {/* Zonas invisibles del foco que sigue al puntero (solo CSS, solo con mouse): globals.css → .bento-card */}
      <span aria-hidden className="bento-zones">
        {BENTO_ZONES.map((zone) => (
          <span key={zone} />
        ))}
      </span>
      <div className="bento-content flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <IconBadge name={pillar.icon} size={isLarge ? "lg" : "md"} />
          <span aria-hidden className="data-mono text-2xl font-bold text-teal/70 dark:text-teal/60">
            {String(index).padStart(2, "0")}
          </span>
        </div>
        <h3 id={`pilar-${pillar.slug}`} className={cn("text-h3 mt-5 text-heading", isLarge && "lg:text-[1.75rem]")}>
          {pillar.name}
        </h3>
        <p className="mt-2 text-[1.0625rem] text-muted">{pillar.summary}</p>

        <ul className={cn("mt-5 space-y-2.5", isLarge && "sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2.5 sm:space-y-0")}>
          {shown.map((service) => (
            <li key={service.name} className="flex gap-2.5 text-base text-fg">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" />
              <span>
                <span className="font-semibold text-heading">{service.name}</span>
                {service.description ? <span className="text-muted"> ({service.description})</span> : null}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
          {isDiagnostic ? (
            <Link href={DENSITOMETRY_BOOKING_HREF} className={buttonVariants({ variant: "primary" })}>
              <ScanLine aria-hidden strokeWidth={1.75} />
              Agendar densitometría
            </Link>
          ) : null}
          <Link
            href={servicePath(pillar.slug)}
            className="inline-flex min-h-12 items-center gap-1.5 font-display font-semibold text-primary hover:underline"
          >
            {pillar.services.length > shown.length ? `Ver los ${pillar.services.length} servicios` : "Ver detalle"}
            <span className="sr-only"> de {pillar.name}</span>
            <ArrowRight aria-hidden strokeWidth={1.75} className="size-5 transition-transform group-hover/pillar:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
