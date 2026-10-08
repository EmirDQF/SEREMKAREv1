import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { MicroIcon } from "@/components/3d/MicroIcon";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { IconBadge } from "@/components/shared/Icon";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { TreatmentCard } from "@/components/shared/TreatmentCard";
import { buttonVariants } from "@/components/ui/button";
import { DENSITOMETRY_PATH } from "@/data/densitometry";
import { BOOKING_HREF } from "@/data/navigation";
import { getServiceDetail } from "@/data/service-details";
import { servicePillars } from "@/data/services";
import { site } from "@/data/site";
import { findPillar, findTreatment, servicePath } from "@/lib/catalog";
import { isMicroVariant } from "@/lib/micro-variants";
import { breadcrumbSchema, medicalServiceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { clinicWhatsApp, messageAbout } from "@/lib/whatsapp";
import type { Treatment } from "@/types/medical";

/** Subservicios con página propia. */
const SERVICE_LINKS: Readonly<Record<string, string>> = {
  "Densitometría ósea": DENSITOMETRY_PATH,
  Videocapilaroscopía: "/tratamientos/videocapilaroscopia",
  "Infiltraciones ecoguiadas por reumatólogo": "/tratamientos/infiltraciones-ecoguiadas",
  "Medicamentos biotecnológicos": "/tratamientos/terapias-biologicas",
  "Terapia física": "/tratamientos/terapia-fisica",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePillars.map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pillar = findPillar(slug);
  if (!pillar) return {};
  const title = `${pillar.name} en Lima Norte y Callao | ${site.name}`;
  return {
    ...buildMetadata({ title, description: `${pillar.tagline} ${getServiceDetail(slug).intro}`, path: servicePath(slug) }),
    title: { absolute: title },
  };
}

export default async function ServicePillarPage({ params }: PageProps<"/servicios/[slug]">) {
  const { slug } = await params;
  const pillar = findPillar(slug);
  if (!pillar) notFound();
  const detail = getServiceDetail(slug);
  const related = detail.relatedTreatments.map(findTreatment).filter((t): t is Treatment => t !== undefined);
  const others = servicePillars.filter((item) => item.slug !== slug);
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: pillar.name, href: servicePath(slug) },
  ];
  const icon = <IconBadge name={pillar.icon} size="lg" />;

  return (
    <>
      <JsonLd
        data={medicalServiceSchema({
          name: pillar.name,
          description: detail.intro,
          path: servicePath(slug),
          offers: pillar.services.map((service) => service.name),
        })}
      />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        id="servicio-title"
        crumbs={crumbs}
        eyebrow={pillar.tagline}
        title={pillar.name}
        lead={detail.intro}
        actions={
          <>
            <a
              href={clinicWhatsApp(messageAbout(pillar.name))}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <WhatsAppIcon /> Consultar por WhatsApp
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

      <section aria-labelledby="incluye-title" className="section-y bg-bg-alt">
        <div className="container-page">
          <SectionHeading id="incluye-title" align="left" eyebrow="Qué incluye" title={`${pillar.services.length} servicios en una sola sede`} />
          <ul className="mt-6 flex flex-wrap gap-3">
            {detail.highlights.map((highlight) => (
              <li key={highlight} className="inline-flex items-center gap-2 rounded-full bg-teal-tint px-4 py-2 font-semibold text-primary">
                <Check aria-hidden strokeWidth={2.25} className="size-4" /> {highlight}
              </li>
            ))}
          </ul>
          <RevealGroup as="ul" className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pillar.services.map((service) => {
              const href = SERVICE_LINKS[service.name];
              return (
                <RevealItem as="li" key={service.name}>
                  <SpotlightCard className="h-full">
                    <div className="flex h-full flex-col p-6">
                      <h3 className="text-h3">{service.name}</h3>
                      <p className="mt-2 text-muted">{detail.serviceNotes[service.name]}</p>
                      {href ? (
                        <Link
                          href={href}
                          className="mt-auto inline-flex min-h-12 items-center gap-1.5 pt-4 font-display font-semibold text-primary hover:underline"
                        >
                          Conocer más <span className="sr-only">sobre {service.name}</span>
                          <ArrowUpRight aria-hidden className="size-4" />
                        </Link>
                      ) : null}
                    </div>
                  </SpotlightCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="relacionados-title" className="section-y">
          <div className="container-page">
            <SectionHeading id="relacionados-title" align="left" eyebrow="Tratamientos" title="Tratamientos relacionados" />
            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((treatment) => (
                <li key={treatment.slug}>
                  <SpotlightCard className="h-full">
                    <TreatmentCard treatment={treatment} />
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <nav aria-labelledby="otros-title" className="pb-16">
        <div className="container-page">
          <h2 id="otros-title" className="text-h3">
            Otros servicios
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={servicePath(item.slug)}
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
        title={`Agenda tu atención en ${pillar.name.toLowerCase()}`}
        text="Te respondemos en horario de atención y coordinamos todo en una sola visita cuando es posible."
        message={messageAbout(pillar.name)}
      />
    </>
  );
}
