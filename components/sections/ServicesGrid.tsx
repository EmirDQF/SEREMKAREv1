import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PillarCard } from "@/components/shared/PillarCard";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { corePillars } from "@/data/services";
import { cn } from "@/lib/utils";

/** «Modelo de atención integral»: los 4 pilares del centro en bento (el de diagnóstico, grande). */
export function ServicesGrid() {
  return (
    <section aria-labelledby="servicios-title" className="section-y bg-bg-alt">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="servicios-title"
            align="left"
            eyebrow="Modelo de atención integral"
            title="Todo lo que necesitas, en un solo centro"
            description="Diagnóstico, tratamiento, procedimientos y consulta con un equipo que trabaja con un mismo plan para ti."
          />
          <Link
            href="/servicios"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Ver todos los servicios <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {corePillars.map((pillar, index) => (
            <Reveal
              as="li"
              key={pillar.slug}
              delay={index * 0.06}
              className={cn(
                pillar.size === "lg" && "md:col-span-2 lg:row-span-2",
                // El último pilar cierra la grilla a lo ancho (sin huecos en 2 y 3 columnas).
                index === corePillars.length - 1 && "md:col-span-2 lg:col-span-3",
              )}
            >
              <PillarCard pillar={pillar} index={index + 1} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
