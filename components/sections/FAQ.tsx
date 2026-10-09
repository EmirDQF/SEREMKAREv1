import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { homeFaq } from "@/data/faq";
import { site } from "@/data/site";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { faqSchema } from "@/lib/schema";

export function FAQ() {
  return (
    <section aria-labelledby="faq-title" className="section-y bg-bg-alt">
      <JsonLd data={faqSchema(homeFaq)} />
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow="Preguntas frecuentes"
            title="Preguntas frecuentes sobre la teleconsulta"
            description="Si no encuentras tu respuesta, escríbenos por WhatsApp."
          />
          <div className="mt-8 flex flex-col items-start gap-2">
            <a
              href={clinicWhatsApp(`Hola ${site.name}, tengo una consulta antes de agendar.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
            >
              Preguntar por WhatsApp <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
            </a>
            <Link
              href="/preguntas-frecuentes"
              className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
            >
              Ver todas las preguntas <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
            </Link>
          </div>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {homeFaq.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
