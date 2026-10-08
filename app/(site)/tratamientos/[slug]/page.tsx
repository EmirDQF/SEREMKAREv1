import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, Clock, HeartPulse, UserRoundCheck } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { MicroIcon } from "@/components/3d/MicroIcon";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { IconBadge } from "@/components/shared/Icon";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { DENSITOMETRY_PATH } from "@/data/densitometry";
import { BOOKING_HREF } from "@/data/navigation";
import { getTreatmentDetail } from "@/data/treatment-details";
import { treatments } from "@/data/treatments";
import { site } from "@/data/site";
import { findPillar, findTreatment, servicePath, treatmentPath } from "@/lib/catalog";
import { isMicroVariant } from "@/lib/micro-variants";
import { breadcrumbSchema, procedureSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { clinicWhatsApp, messageAbout } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return treatments.map((treatment) => ({ slug: treatment.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tratamientos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const treatment = findTreatment(slug);
  if (!treatment) return {};
  const title = `${treatment.name} en Lima Norte y Callao | ${site.name}`;
  return {
    ...buildMetadata({ title, description: `${treatment.summary} Indicado para: ${treatment.indicatedFor}`, path: treatmentPath(slug) }),
    title: { absolute: title },
  };
}

export default async function TreatmentPage({ params }: PageProps<"/tratamientos/[slug]">) {
  const { slug } = await params;
  const treatment = findTreatment(slug);
  if (!treatment) notFound();
  const detail = getTreatmentDetail(slug);
  const pillar = findPillar(detail.pillarSlug);
  const others = treatments.filter((item) => item.slug !== slug);
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Tratamientos", href: "/tratamientos" },
    { label: treatment.name, href: treatmentPath(slug) },
  ];
  const icon = <IconBadge name={treatment.icon} size="lg" />;
  const message = messageAbout(treatment.name);

  return (
    <>
      <JsonLd
        data={procedureSchema(detail.kind === "diagnostic" ? "DiagnosticProcedure" : "TherapeuticProcedure", {
          name: treatment.name,
          alternateName: [],
          description: treatment.summary,
          path: treatmentPath(slug),
          bodyLocation: treatment.indicatedFor,
          howPerformed: detail.procedure.join(" "),
          preparation: detail.aftercare.join(" "),
          followup: "Control con tu especialista según tu evolución.",
        })}
      />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        id="tratamiento-title"
        crumbs={crumbs}
        eyebrow={detail.kind === "diagnostic" ? "Estudio diagnóstico" : "Tratamiento"}
        title={treatment.name}
        lead={treatment.summary}
        actions={
          <>
            <a
              href={clinicWhatsApp(message)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <WhatsAppIcon /> Agendar por WhatsApp
            </a>
            <a href={BOOKING_HREF} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Agendar cita
            </a>
          </>
        }
        visual={
          <div className="glass mx-auto aspect-square w-full max-w-sm rounded-[2.5rem] p-4 shadow-lift">
            {isMicroVariant(slug) ? <MicroIcon variant={slug} fallback={icon} className="size-full" /> : icon}
          </div>
        }
      />

      <section aria-label="Resumen" className="pb-16">
        <div className="container-page grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
            <p className="flex items-center gap-2 font-display font-semibold text-heading">
              <UserRoundCheck aria-hidden strokeWidth={1.75} className="size-5 text-primary" /> ¿Para quién está indicado?
            </p>
            <p className="mt-2 text-lg text-fg">{treatment.indicatedFor}</p>
          </div>
          <div className="rounded-[1.75rem] bg-teal-tint p-6">
            <p className="flex items-center gap-2 font-display font-semibold text-heading">
              <Clock aria-hidden strokeWidth={1.75} className="size-5 text-primary" /> Duración aproximada
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-heading">{treatment.duration}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="procedimiento-title" className="section-y bg-bg-alt">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading id="procedimiento-title" align="left" eyebrow="Paso a paso" title="Cómo es el procedimiento" />
            <RevealGroup as="ol" className="mt-8 space-y-4">
              {detail.procedure.map((step, index) => (
                <RevealItem as="li" key={step} className="flex gap-4 rounded-2xl border border-line bg-card-solid p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display font-bold text-on-primary">
                    {index + 1}
                  </span>
                  <p className="pt-1.5 text-fg">{step}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
              <h2 className="text-h3">Beneficios</h2>
              <ul className="mt-3 space-y-2">
                {treatment.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-fg">
                    <Check aria-hidden strokeWidth={2} className="mt-1 size-4 shrink-0 text-primary" /> {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
              <h2 className="flex items-center gap-2 text-h3">
                <HeartPulse aria-hidden strokeWidth={1.75} className="size-6 text-primary" />
                {detail.kind === "diagnostic" ? "Preparación y cuidados" : "Cuidados posteriores"}
              </h2>
              <ul className="mt-3 space-y-2">
                {detail.aftercare.map((item) => (
                  <li key={item} className="flex gap-2.5 text-fg">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Indicaciones generales: tu especialista te da las que corresponden a tu caso.</p>
            </div>
            {pillar ? (
              <Link
                href={servicePath(pillar.slug)}
                className="flex items-center justify-between gap-3 rounded-[1.75rem] bg-navy p-5 font-display font-semibold text-white transition-colors hover:bg-navy-2"
              >
                <span>
                  <span className="block text-sm font-medium text-teal-200">Forma parte de</span>
                  {pillar.name}
                </span>
                <ArrowUpRight aria-hidden className="size-5 shrink-0 text-teal-200" />
              </Link>
            ) : null}
            {slug === "laboratorio-y-densitometria" ? (
              <Link
                href={DENSITOMETRY_PATH}
                className="flex items-center justify-between gap-3 rounded-[1.75rem] border border-line bg-card-solid p-5 font-display font-semibold text-primary transition-colors hover:border-primary"
              >
                Todo sobre la densitometría ósea <ArrowRight aria-hidden className="size-5 shrink-0" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <nav aria-labelledby="otros-tratamientos" className="section-y">
        <div className="container-page">
          <h2 id="otros-tratamientos" className="text-h3">
            Otros tratamientos
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={treatmentPath(item.slug)}
                  className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-line bg-card-solid px-5 py-3 font-display font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
                >
                  {item.name} <ArrowRight aria-hidden className="size-5 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CtaBand
        title="¿Este tratamiento es para ti?"
        text="Tu especialista lo confirma en la consulta, con ecografía en el mismo consultorio si hace falta."
        message={message}
      />
    </>
  );
}
