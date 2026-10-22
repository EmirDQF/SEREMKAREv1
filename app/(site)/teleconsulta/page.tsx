import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, MonitorSmartphone, ShieldCheck, Stethoscope, Video } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { ContactoDoctor } from "@/components/shared/ContactoDoctor";
import { PageHero } from "@/components/pages/PageHero";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { BOOKING_HREF } from "@/data/navigation";
import { site } from "@/data/site";
import {
  PENDING,
  teleconsultFacts,
  teleconsultFaq,
  teleconsultGuide,
  teleconsultHero,
  teleconsultIncludes,
  teleconsultReasons,
  teleconsultRequirements,
} from "@/data/teleconsult-content";
import { credentialsLabel } from "@/lib/doctor";
import { breadcrumbSchema, faqSchema, physicianSchema, teleconsultServiceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PATH = "/teleconsulta";
const TITLE = `Teleconsulta reumatológica por videollamada · Perú | ${site.name}`;
const DESCRIPTION =
  "Consulta con un reumatólogo desde casa por WhatsApp, Zoom o Meet: revisión de exámenes, plan de tratamiento y, si el doctor lo indica, receta digital.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Teleconsulta", href: PATH },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
  title: { absolute: TITLE },
};

export default function TeleconsultaPage() {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <JsonLd data={teleconsultServiceSchema(PATH)} />
      <JsonLd data={physicianSchema({ name: doctor.name, path: `/staff/${doctor.slug}`, specialty: doctor.specialty, image: doctor.photo, knowsAbout: doctor.focus })} />
      <JsonLd data={faqSchema(teleconsultFaq)} />

      <PageHero
        id="teleconsulta-title"
        crumbs={CRUMBS}
        eyebrow={teleconsultHero.eyebrow}
        title={teleconsultHero.title}
        lead={teleconsultHero.lead}
        actions={
          <>
            <Link href={BOOKING_HREF} className={buttonVariants({ size: "lg" })}>
              Agendar videollamada <ArrowRight aria-hidden />
            </Link>
            <Link href="/consulta-virtual" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Evaluar mis síntomas
            </Link>
          </>
        }
        visual={
          <div className="glass mx-auto w-full max-w-sm rounded-[2rem] p-6 shadow-lift">
            <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[1.5rem]">
              <DoctorPortrait doctor={doctor} fill priority sizes="(min-width: 1024px) 380px, 80vw" />
            </div>
            <p className="mt-4 font-display text-lg font-bold text-heading">{doctor.name}</p>
            <p className="text-primary">{doctor.title}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
              <ShieldCheck aria-hidden className="size-4 text-primary" /> {credentialsLabel(doctor)}
            </p>
          </div>
        }
      />

      <section aria-labelledby="plataformas-title" className="section-y pt-0">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="plataformas-title" className="text-h2">
              Por videollamada, desde donde estés
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3" aria-label="Plataformas para la videollamada">
              {teleconsultHero.platforms.map((platform) => (
                <li key={platform} className="glass inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-semibold text-heading">
                  <Video aria-hidden className="size-5 text-primary" /> {platform}
                </li>
              ))}
            </ul>
            <p className="mt-6 inline-flex items-center gap-2 text-muted">
              <ShieldCheck aria-hidden className="size-5 text-primary" /> {teleconsultHero.law}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="glass rounded-[1.75rem] p-6">
              <h3 className="flex items-center gap-2 text-h3">
                <Stethoscope aria-hidden className="size-6 text-primary" /> Te atendemos por
              </h3>
              <ul className="mt-4 space-y-2">
                {teleconsultReasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-2 text-fg">
                    <CheckCircle2 aria-hidden className="size-5 shrink-0 text-primary" /> {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-[1.75rem] p-6">
              <h3 className="flex items-center gap-2 text-h3">
                <FileText aria-hidden className="size-6 text-primary" /> Incluye
              </h3>
              <ul className="mt-4 space-y-2">
                {teleconsultIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-fg">
                    <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="guia-title" className="section-y bg-bg-alt">
        <div className="container-page">
          <SectionHeading id="guia-title" eyebrow="Paso a paso" title="Cómo funciona tu teleconsulta" description="Del primer mensaje a tu plan de tratamiento." />
          <RevealGroup as="ol" className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {teleconsultGuide.map((step, index) => (
              <RevealItem as="li" key={step.title} className="glass relative rounded-[1.75rem] p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-coral to-teal font-display text-lg font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-heading">{step.title}</h3>
                <p className="mt-2 text-base text-muted">{step.body}</p>
                {step.pending.length > 0 ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                    {PENDING}: {step.pending.join(", ").toLowerCase()}
                  </p>
                ) : null}
              </RevealItem>
            ))}
          </RevealGroup>
          <dl className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
            <Fact label="Horario" value={teleconsultFacts.hoursLabel} />
            <Fact label="Precio" value={teleconsultFacts.price === null ? null : `S/ ${teleconsultFacts.price}`} />
            <Fact label="Medios de pago" value={teleconsultFacts.paymentMethods.length > 0 ? teleconsultFacts.paymentMethods.join(", ") : null} />
          </dl>
        </div>
      </section>

      <section aria-labelledby="requisitos-title" className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="requisitos-title" align="left" eyebrow="Antes de conectarte" title="Qué necesitas" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: MonitorSmartphone, text: teleconsultRequirements.devices },
              { icon: Video, text: teleconsultRequirements.apps },
              { icon: FileText, text: teleconsultRequirements.documents },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="glass rounded-[1.75rem] p-6">
                <Icon aria-hidden className="size-7 text-primary" />
                <p className="mt-3 text-fg">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-tele-title" className="section-y bg-bg-alt">
        <div className="container-page max-w-3xl">
          <SectionHeading id="faq-tele-title" eyebrow="Preguntas frecuentes" title="Preguntas frecuentes sobre la teleconsulta" />
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {teleconsultFaq.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-center">
            <Link href="/densitometria-osea" className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
              Conoce la densitometría ósea <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
        </div>
      </section>

      <ContactoDoctor />

      <CtaBand
        title="Agenda tu teleconsulta"
        text="Elige tu horario en línea o escríbenos por WhatsApp. Envía tus exámenes previos para que el doctor los revise antes."
        message="Hola, deseo agendar una teleconsulta virtual con el Dr. Ccolcca"
      />
    </>
  );
}

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-line bg-card-solid p-4">
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-heading">{value ?? PENDING}</dd>
    </div>
  );
}
