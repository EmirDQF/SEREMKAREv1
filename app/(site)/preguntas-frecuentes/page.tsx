import type { Metadata } from "next";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { allFaqGroups } from "@/data/faq-page";
import { site } from "@/data/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TITLE = `Preguntas frecuentes | ${site.name}`;
const DESCRIPTION = "Respuestas claras sobre citas, seguros, teleconsulta, densitometría ósea y las enfermedades que tratamos.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/preguntas-frecuentes" }),
  title: { absolute: TITLE },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(allFaqGroups.flatMap((group) => group.items))} />
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="faq-title"
        crumbs={CRUMBS}
        eyebrow="Preguntas frecuentes"
        title="Resolvemos tus dudas antes de tu cita"
        accent="tus dudas"
        lead="Si no encuentras tu respuesta, escríbenos: te contestamos en horario de atención."
      />
      <div className="container-page pb-16">
        <nav aria-label="Temas" className="flex flex-wrap gap-2">
          {allFaqGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="inline-flex min-h-12 items-center rounded-full border border-line-strong bg-card-solid px-5 font-display font-semibold text-heading hover:border-primary hover:text-primary"
            >
              {group.title}
            </a>
          ))}
        </nav>
        {allFaqGroups.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="mt-12 scroll-mt-28">
            <h2 id={`${group.id}-title`} className="text-h3">
              {group.title}
            </h2>
            <Accordion type="single" collapsible className="mt-5 space-y-3">
              {group.items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
      <CtaBand
        title="¿Tienes otra pregunta?"
        text="Escríbenos por WhatsApp y te respondemos en horario de atención."
        message={`Hola ${site.name}, tengo una consulta.`}
      />
    </>
  );
}
