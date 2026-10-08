import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { formatStat } from "@/lib/format";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const TITLE = `Testimonios de pacientes | ${site.name}`;
const DESCRIPTION = "Historias de pacientes que volvieron a moverse con artrosis, artritis, gota, osteoporosis y más.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Testimonios", href: "/testimonios" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/testimonios" }),
  title: { absolute: TITLE },
};

export default function TestimonialsPage() {
  // Oculta mientras no haya contenido real (data/visibility.ts).
  if (testimonials.length === 0) notFound();
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="testimonios-title"
        crumbs={CRUMBS}
        eyebrow="Testimonios"
        title="Pacientes que volvieron a moverse"
        accent="volvieron a moverse"
        lead={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Star aria-hidden className="size-5 fill-rating text-rating" />
            <strong className="font-semibold text-heading">
              {formatStat(site.stats.rating, site.stats.rating.value)} de calificación promedio
            </strong>
            <span>· +{site.stats.reviewsCount} reseñas de pacientes</span>
          </span>
        }
      />
      <section aria-label="Testimonios" className="pb-16">
        <div className="container-page">
          <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <RevealItem depth key={testimonial.id} className={cn(testimonial.featured && "lg:col-span-2")}>
                <TestimonialCard testimonial={testimonial} />
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-8 text-center text-sm text-muted">
            Testimonios publicados con autorización de cada paciente. Los resultados varían según cada caso.
          </p>
        </div>
      </section>
      <CtaBand
        title="Tu historia también puede cambiar"
        text="Da el primer paso: agenda una evaluación con nuestros especialistas."
        message={site.defaultWhatsAppMessage}
      />
    </>
  );
}
