import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { ContactoDoctor } from "@/components/shared/ContactoDoctor";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { PillarCard } from "@/components/shared/PillarCard";
import { IconBadge } from "@/components/shared/Icon";
import { TelemedicineBand } from "@/components/sections/TelemedicineBand";
import { DENSITOMETRY_PATH } from "@/data/densitometry";
import { corePillars } from "@/data/services";
import { site } from "@/data/site";
import { treatments } from "@/data/treatments";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const TITLE = `Servicios de reumatología en Lima Norte y Callao | ${site.name}`;
const DESCRIPTION =
  "Densitometría ósea y diagnóstico, terapia biológica y seguimiento, consulta multidisciplinaria y procedimientos guiados por ecografía. Teleconsulta como servicio extra.";
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
        eyebrow="Modelo de atención integral"
        title="Todos nuestros servicios"
        accent="servicios"
        lead="Diagnóstico con densitometría, tratamiento, procedimientos y consulta con un equipo multidisciplinario. Y, como servicio extra, la teleconsulta."
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
                <span className="block font-display text-xl font-bold">Densitometría ósea</span>
                <span className="mt-1 block text-slate-300">
                  Mide la fuerza de tus huesos con un estudio breve. Resultados el mismo día o en 24 horas.
                </span>
              </span>
              <ArrowRight aria-hidden className="size-6 shrink-0 text-teal-200 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {corePillars.map((pillar, index) => (
              <Reveal
                as="li"
                key={pillar.slug}
                className={cn(
                  pillar.size === "lg" && "md:col-span-2 lg:row-span-2",
                  index === corePillars.length - 1 && "md:col-span-2 lg:col-span-3",
                )}
              >
                <PillarCard pillar={pillar} index={index + 1} />
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

      <TelemedicineBand id="extra-title" />

      <ContactoDoctor />

      <CtaBand
        title="¿No sabes qué servicio necesitas?"
        text="Cuéntanos qué te pasa y te orientamos con el especialista y los estudios adecuados."
        message={`Hola ${site.name}, quisiera orientación sobre sus servicios.`}
      />
    </>
  );
}
