import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { Reveal } from "@/components/shared/Reveal";
import { servicePillars } from "@/data/services";
import { cn } from "@/lib/utils";

export function ServicesGrid() {
  return (
    <section aria-labelledby="servicios-title" className="section-y bg-bg-alt">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="servicios-title"
            align="left"
            eyebrow="Servicios"
            title="Teleconsulta y diagnóstico, sin vueltas"
            description="Reumatología por videollamada para todo el Perú y densitometría ósea con cita previa en nuestras sedes."
          />
          <Link
            href="/servicios"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Ver todos los servicios <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {servicePillars.map((pillar, index) => (
            <Reveal
              key={pillar.slug}
              delay={index * 0.06}
              className={cn(pillar.size === "lg" && "sm:col-span-2 lg:row-span-2")}
            >
              <SpotlightCard className="h-full">
                <ServiceCard pillar={pillar} />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
