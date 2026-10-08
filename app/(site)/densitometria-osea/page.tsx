import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Target } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { KineticText } from "@/components/shared/KineticText";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AudienceCards } from "@/components/densitometry/AudienceCards";
import { BoneDensityExplorer } from "@/components/densitometry/BoneDensityExplorer";
import { BookDensitometryButton } from "@/components/densitometry/BookDensitometryButton";
import { DensitometryChecklist } from "@/components/densitometry/DensitometryChecklist";
import { DensitometrySteps } from "@/components/densitometry/DensitometrySteps";
import { DxaScanFX } from "@/components/densitometry/DxaScanFX";
import { TScoreGauge } from "@/components/densitometry/TScoreGauge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DENSITOMETRY_PATH, densitometry } from "@/data/densitometry";
import { site } from "@/data/site";
import { breadcrumbSchema, diagnosticProcedureSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TITLE = `Densitometría ósea en Lima Norte y Callao | ${site.name}`;
const DESCRIPTION =
  "Densitometría ósea (DXA) en Los Olivos, Callao y Puente Piedra: prueba rápida e indolora para detectar osteopenia y osteoporosis antes de una fractura. Resultados el mismo día o en 24 horas. Agenda por WhatsApp.";

const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Apoyo diagnóstico", href: "/servicios/apoyo-diagnostico" },
  { label: "Densitometría ósea", href: DENSITOMETRY_PATH },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: DENSITOMETRY_PATH }),
  title: { absolute: TITLE },
};

const STUDY_BLOCKS = [
  { title: "Para qué sirve", icon: Target, items: densitometry.purpose },
  { title: "Cómo es", icon: Clock, items: densitometry.howItWorks },
  { title: "Es segura", icon: ShieldCheck, items: densitometry.safety },
] as const;

const procedureSchema = diagnosticProcedureSchema({
  name: "Densitometría ósea",
  alternateName: ["DXA", "DEXA", "Absorciometría dual de rayos X"],
  description: `${densitometry.whatIs} ${densitometry.measuredAt}`,
  path: DENSITOMETRY_PATH,
  bodyLocation: "Columna lumbar y cadera",
  howPerformed: densitometry.howItWorks.join(" "),
  preparation: densitometry.preparation.join(" "),
  followup: densitometry.followUp,
  availableAt: site.locations,
});

export default function DensitometryPage() {
  return (
    <>
      <JsonLd data={procedureSchema} />
      <JsonLd data={faqSchema(densitometry.faq)} />
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      {/* Hero */}
      <section aria-labelledby="dxa-title" className="relative overflow-hidden pb-16 pt-36 sm:pt-40 lg:pb-20">
        <div aria-hidden className="mesh-bg -z-10" />
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Breadcrumbs items={CRUMBS} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-tint px-3.5 py-1.5 text-sm font-semibold text-primary">
              <span aria-hidden className="size-1.5 rounded-full bg-teal" /> Nuevo en {site.name}
            </p>
            <h1 id="dxa-title" className="text-display mt-4 text-heading">
              <KineticText text="Densitometría ósea en Lima" accent="Densitometría ósea" priority />
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
              {densitometry.whatIs} {densitometry.technicalName} {densitometry.measuredAt}
            </p>
            <BookDensitometryButton className="mt-8" />
          </div>
          <Reveal>
            <DxaScanFX />
          </Reveal>
        </div>
      </section>

      {/* ¿Para quién es? */}
      <section aria-labelledby="dxa-quien" className="section-y bg-bg-alt">
        <div className="container-page">
          <SectionHeading id="dxa-quien" eyebrow="¿Es para mí?" title="¿Para quién es la densitometría?" accent="¿Para quién" />
          <AudienceCards className="mt-12" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-muted">{densitometry.followUp}</p>
        </div>
      </section>

      {/* Cómo leer el resultado */}
      <section aria-labelledby="dxa-resultado" className="section-y">
        <div className="container-page">
          <SectionHeading
            id="dxa-resultado"
            eyebrow="Tu resultado, explicado"
            title="Cómo leer tu densitometría"
            accent="leer"
            description="Elige un estado para ver cómo cambia el hueso por dentro y mueve el marcador de la escala."
          />
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
            <Reveal>
              <BoneDensityExplorer />
            </Reveal>
            <div className="space-y-4">
              <TScoreGauge />
              <div className="rounded-[1.75rem] border border-line bg-card-solid p-5">
                <p className="font-display font-semibold text-heading">Z-score</p>
                <p className="mt-1 text-fg">
                  <strong className="font-semibold">{densitometry.zScore.range}:</strong> {densitometry.zScore.explanation}
                </p>
                <p className="mt-1 text-sm text-muted">{densitometry.zScore.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El estudio */}
      <section aria-labelledby="dxa-estudio" className="section-y relative isolate overflow-hidden rounded-[2.5rem] bg-navy text-slate-200 lg:rounded-[4rem] dark:bg-[#071222]">
        <div aria-hidden className="immersive-glow -z-10" />
        <div aria-hidden className="immersive-grid -z-10" />
        <div className="container-page">
          <SectionHeading
            id="dxa-estudio"
            tone="inverted"
            eyebrow="Sin dolor, sin agujas"
            title="Así es el estudio"
            accent="estudio"
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {STUDY_BLOCKS.map((block, index) => (
              <Reveal as="li" key={block.title} delay={index * 0.08} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                <block.icon aria-hidden strokeWidth={1.75} className="size-8 text-teal-300" />
                <h3 className="text-h3 mt-4 text-white">{block.title}</h3>
                <ul className="mt-3 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Proceso y preparación */}
      <section aria-labelledby="dxa-pasos" className="section-y">
        <div className="container-page">
          <SectionHeading id="dxa-pasos" eyebrow="Paso a paso" title="De la agenda a tu resultado" accent="tu resultado" />
          <div className="mt-12">
            <DensitometrySteps />
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section aria-labelledby="dxa-checklist" className="section-y bg-bg-alt">
        <div className="container-page">
          <SectionHeading
            id="dxa-checklist"
            eyebrow="Orientación en 1 minuto"
            title="¿Debería hacerme una densitometría?"
            accent="densitometría?"
            description="Responde sí o no. No es un diagnóstico: solo te orienta para conversarlo con un especialista."
          />
          <div className="mt-12">
            <DensitometryChecklist />
          </div>
        </div>
      </section>

      {/* Servicios relacionados + FAQ */}
      <section aria-labelledby="dxa-faq" className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading id="dxa-faq" align="left" eyebrow="Preguntas frecuentes" title="Lo que más nos preguntan" />
            <div className="mt-8 rounded-[1.75rem] bg-teal-tint p-6">
              <p className="font-display font-semibold text-heading">Servicios relacionados</p>
              <ul className="mt-3 space-y-2">
                {densitometry.relatedServices.map((service) => (
                  <li key={service} className="flex gap-2.5 text-fg">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" />
                    {service}
                  </li>
                ))}
              </ul>
              <Link
                href="/servicios/apoyo-diagnostico"
                className="mt-4 inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
              >
                Ver apoyo diagnóstico <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
              </Link>
            </div>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {densitometry.faq.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA final */}
      <section aria-labelledby="dxa-cta" className="pb-24">
        <div className="container-page">
          <div className="gradient-border flex flex-col items-start gap-6 rounded-[2rem] border border-line bg-card-solid p-8 shadow-lift md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="dxa-cta" className="text-h3">
                Cuida tus huesos (y los de tus padres) a tiempo
              </h2>
              <p className="mt-2 text-muted">Resultados el mismo día o en 24 horas. No necesitas orden médica.</p>
            </div>
            <BookDensitometryButton />
          </div>
          <p className="mt-6 text-center text-sm text-muted">{densitometry.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
