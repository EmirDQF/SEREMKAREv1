import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { TreatmentCard } from "@/components/shared/TreatmentCard";
import { site } from "@/data/site";
import { treatments } from "@/data/treatments";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TITLE = `Tratamientos de reumatología en Lima Norte y Callao | ${site.name}`;
const DESCRIPTION =
  "Infiltraciones ecoguiadas, terapias biológicas, viscosuplementación, terapia física, laboratorio y densitometría, y videocapilaroscopía, explicados con claridad.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Tratamientos", href: "/tratamientos" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/tratamientos" }),
  title: { absolute: TITLE },
};

export default function TreatmentsPage() {
  // Oculta mientras no haya contenido real (data/visibility.ts).
  if (treatments.length === 0) notFound();
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="tratamientos-title"
        crumbs={CRUMBS}
        eyebrow="Tratamientos"
        title="Tratamientos modernos, explicados con claridad"
        accent="explicados con claridad"
        lead="Te contamos para quién está indicado cada uno, cómo es, qué beneficios tiene y cuánto dura, antes de decidir."
      />
      <section aria-label="Lista de tratamientos" className="pb-16">
        <div className="container-page">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {treatments.map((treatment, index) => (
              <Reveal as="li" key={treatment.slug} delay={(index % 3) * 0.08}>
                <SpotlightCard className="h-full">
                  <TreatmentCard treatment={treatment} />
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand
        title="Tu especialista define el tratamiento adecuado para ti"
        text="Agenda una evaluación y te explicamos tus opciones con calma, sin compromiso."
        message={`Hola ${site.name}, quisiera una evaluación para conocer mis opciones de tratamiento.`}
      />
    </>
  );
}
