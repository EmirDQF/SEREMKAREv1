import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { ContactoDoctor } from "@/components/shared/ContactoDoctor";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { IconBadge } from "@/components/shared/Icon";
import { DENSITOMETRY_PATH } from "@/data/densitometry";
import { servicePillars } from "@/data/services";
import { site } from "@/data/site";
import { treatments } from "@/data/treatments";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const TITLE = `Servicios de reumatología en Lima Norte y Callao | ${site.name}`;
const DESCRIPTION =
  "Teleconsulta reumatológica por videollamada para todo el Perú y densitometría ósea con cita previa en 3 sedes de Lima Norte y Callao.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/servicios" }),
  title: { absolute: TITLE },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="servicios-title"
        crumbs={CRUMBS}
        eyebrow="Servicios"
        title="Teleconsulta y densitometría ósea"
        accent="densitometría ósea"
        lead="Reumatología por videollamada y densitometría con cita previa en 3 sedes."
      />

      <section aria-label="Pilares de servicio" className="pb-16">
        <div className="container-page">
          <Reveal>
            <Link
              href={DENSITOMETRY_PATH}
              className="group mb-6 flex flex-col gap-4 rounded-[1.75rem] bg-navy p-6 text-white shadow-lift transition-colors hover:bg-navy-2 sm:flex-row sm:items-center"
            >
              <IconBadge name="scan" size="lg" className="bg-white/10 text-teal-200" />
              <span className="flex-1">
                <span className="flex items-center gap-2 font-display text-xl font-bold">
                  Densitometría ósea
                  <span className="rounded-full bg-teal px-2 py-0.5 text-xs font-bold text-navy">Nuevo</span>
                </span>
                <span className="mt-1 block text-slate-300">
                  Mide la fuerza de tus huesos con un estudio breve. Resultados el mismo día o en 24 horas.
                </span>
              </span>
              <ArrowRight aria-hidden className="size-6 shrink-0 text-teal-200 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicePillars.map((pillar, index) => (
              <Reveal
                as="li"
                key={pillar.slug}
                delay={index * 0.06}
                className={cn(pillar.size === "lg" && "sm:col-span-2 lg:row-span-2")}
              >
                <SpotlightCard className="h-full">
                  <ServiceCard pillar={pillar} />
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
          {treatments.length > 0 ? (
            <Link
              href="/tratamientos"
              className="mt-10 inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
            >
              Ver todos los tratamientos <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
            </Link>
          ) : null}
        </div>
      </section>

      <ContactoDoctor />

      <CtaBand
        title="¿No sabes qué servicio necesitas?"
        text="Cuéntanos qué te pasa y te orientamos con el especialista y los estudios adecuados."
        message={`Hola ${site.name}, quisiera orientación sobre sus servicios.`}
      />
    </>
  );
}
