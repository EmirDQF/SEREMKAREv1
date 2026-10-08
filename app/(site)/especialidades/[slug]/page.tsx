import type { Metadata } from "next";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, ArrowUpRight, Stethoscope, Users } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { MicroIcon } from "@/components/3d/MicroIcon";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { IconBadge } from "@/components/shared/Icon";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { DENSITOMETRY_PATH } from "@/data/densitometry";
import { BOOKING_HREF } from "@/data/navigation";
import { site } from "@/data/site";
import { specialties } from "@/data/specialties";
import { getSpecialtyDetail } from "@/data/specialty-details";
import { findDoctor, findSpecialty, findTreatment, treatmentPath } from "@/lib/catalog";
import { isMicroVariant } from "@/lib/micro-variants";
import { breadcrumbSchema, faqSchema, medicalConditionSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { clinicWhatsApp, messageAbout } from "@/lib/whatsapp";
import type { Treatment } from "@/types/medical";

export const dynamicParams = false;

export function generateStaticParams() {
  return specialties.map((specialty) => ({ slug: specialty.slug }));
}

export async function generateMetadata({ params }: PageProps<"/especialidades/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const specialty = findSpecialty(slug);
  if (!specialty) return {};
  const title = `${specialty.name}: síntomas y tratamiento en Lima | ${site.name}`;
  return {
    ...buildMetadata({ title, description: specialty.summary, path: `/especialidades/${slug}` }),
    title: { absolute: title },
  };
}

export default async function SpecialtyPage({ params }: PageProps<"/especialidades/[slug]">) {
  const { slug } = await params;
  const specialty = findSpecialty(slug);
  if (!specialty) notFound();
  const detail = getSpecialtyDetail(slug);
  const doctor = findDoctor(specialty.doctorSlug);
  const treatments = detail.treatments.map(findTreatment).filter((t): t is Treatment => t !== undefined);
  const path = `/especialidades/${slug}`;
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Especialidades", href: "/especialidades" },
    { label: specialty.shortName, href: path },
  ];
  const message = messageAbout(specialty.shortName, doctor?.name);
  const icon = <IconBadge name="stethoscope" size="lg" />;

  return (
    <>
      <JsonLd data={medicalConditionSchema({ name: specialty.name, description: specialty.summary, path, symptoms: specialty.symptoms })} />
      <JsonLd data={faqSchema(detail.faq)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        id="especialidad-title"
        crumbs={crumbs}
        eyebrow="Especialidad"
        title={specialty.name}
        lead={specialty.summary}
        actions={
          <>
            <a href={clinicWhatsApp(message)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "primary", size: "lg" })}>
              <WhatsAppIcon /> Agendar evaluación
            </a>
            <a href={BOOKING_HREF} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Usar el formulario
            </a>
          </>
        }
        visual={
          <div className="glass mx-auto aspect-square w-full max-w-sm rounded-[2.5rem] p-4 shadow-lift">
            {isMicroVariant(slug) ? <MicroIcon variant={slug} fallback={icon} className="size-full" /> : icon}
          </div>
        }
      />

      <section aria-labelledby="sintomas-title" className="section-y bg-bg-alt">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
            <h2 id="sintomas-title" className="text-h3">
              Síntomas frecuentes
            </h2>
            <ul className="mt-3 space-y-2">
              {specialty.symptoms.map((symptom) => (
                <li key={symptom} className="flex gap-2.5 text-fg">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" /> {symptom}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] bg-coral-tint p-6">
            <h2 className="flex items-center gap-2 text-h3">
              <AlertTriangle aria-hidden strokeWidth={1.75} className="size-6 text-coral" /> Señales de alerta
            </h2>
            <ul className="mt-3 space-y-2">
              {specialty.alertSigns.map((sign) => (
                <li key={sign} className="flex gap-2.5 text-fg">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-coral" /> {sign}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-h3">
              <Users aria-hidden strokeWidth={1.75} className="size-6 text-primary" /> ¿A quién afecta?
            </h2>
            <p className="mt-3 text-fg">{detail.whoIsAffected}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="diagnostico-title" className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading id="diagnostico-title" align="left" eyebrow="Diagnóstico" title="Cómo la diagnosticamos" />
            <RevealGroup as="ol" className="mt-8 space-y-4">
              {detail.diagnosis.map((step, index) => (
                <RevealItem as="li" key={step} className="flex gap-4 rounded-2xl border border-line bg-card-solid p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display font-bold text-on-primary">
                    {index + 1}
                  </span>
                  <p className="pt-1.5 text-fg">{step}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <div className="mt-6 rounded-2xl bg-teal-tint p-5">
              <p className="flex items-center gap-2 font-display font-semibold text-heading">
                <Stethoscope aria-hidden strokeWidth={1.75} className="size-5 text-primary" /> Cómo te ayudamos
              </p>
              <p className="mt-2 text-fg">{specialty.approach}</p>
            </div>
          </div>
          <div className="space-y-4">
            {doctor ? (
              <Link
                href={`/staff/${doctor.slug}`}
                className="group flex items-center gap-4 rounded-[1.75rem] border border-line bg-card-solid p-5 shadow-soft transition-colors hover:border-primary"
              >
                <DoctorPortrait doctor={doctor} size={72} className="size-18 rounded-2xl" />
                <span className="min-w-0">
                  <span className="block text-sm text-muted">Especialista recomendado</span>
                  <span className="block font-display font-semibold text-heading group-hover:text-primary">{doctor.name}</span>
                  <span className="block text-sm text-muted">{doctor.specialty}</span>
                </span>
                <ArrowUpRight aria-hidden className="ml-auto size-5 shrink-0 text-primary" />
              </Link>
            ) : null}
            {treatments.length > 0 ? (
              <div className="rounded-[1.75rem] border border-line bg-card-solid p-5 shadow-soft">
                <h2 className="text-h3">Tratamientos relacionados</h2>
                <ul className="mt-3 space-y-1">
                  {treatments.map((treatment) => (
                    <li key={treatment.slug}>
                      <Link
                        href={treatmentPath(treatment.slug)}
                        className="flex min-h-12 items-center justify-between gap-3 font-display font-semibold text-primary hover:underline"
                      >
                        {treatment.name} <ArrowRight aria-hidden className="size-5 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {slug === "osteoporosis" ? (
              <Link
                href={DENSITOMETRY_PATH}
                className="flex items-center justify-between gap-3 rounded-[1.75rem] bg-navy p-5 font-display font-semibold text-white transition-colors hover:bg-navy-2"
              >
                Todo sobre la densitometría ósea <ArrowRight aria-hidden className="size-5 shrink-0 text-teal-200" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-especialidad" className="section-y bg-bg-alt">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-especialidad" align="left" eyebrow="Preguntas frecuentes" title={`Dudas sobre ${specialty.shortName.toLowerCase()}`} />
          <Accordion type="single" collapsible className="space-y-3">
            {detail.faq.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <div className="h-16" />
      <CtaBand
        title={`¿Crees que podrías tener ${specialty.shortName.toLowerCase()}?`}
        text="Una evaluación a tiempo permite empezar el tratamiento adecuado y evitar complicaciones."
        message={message}
      />
    </>
  );
}
