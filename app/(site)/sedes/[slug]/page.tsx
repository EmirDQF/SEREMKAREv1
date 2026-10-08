import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, Navigation } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { JsonLd } from "@/components/shared/JsonLd";
import { LocationCard } from "@/components/shared/LocationCard";
import { MapFacade } from "@/components/shared/MapFacade";
import { buttonVariants } from "@/components/ui/button";
import { DENSITOMETRY_PATH, densitometry } from "@/data/densitometry";
import { LOCATIONS_PATH } from "@/data/navigation";
import { site } from "@/data/site";
import { findLocation } from "@/lib/locations";
import { breadcrumbSchema, locationClinicSchema } from "@/lib/schema";
import { locationMetadata, locationPageTitle } from "@/lib/seo";
import { locationWhatsApp, withLocation } from "@/lib/whatsapp";
import type { ClinicLocation } from "@/types/medical";

export const dynamicParams = false;

export function generateStaticParams() {
  return site.locations.map((location) => ({ slug: location.id }));
}

export async function generateMetadata({ params }: PageProps<"/sedes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const location = findLocation(slug);
  return location ? locationMetadata(location) : {};
}

function NearbyDistricts({ location }: { location: ClinicLocation }) {
  return (
    <div className="rounded-[2rem] border border-line bg-card-solid p-6 shadow-soft sm:p-8">
      <h2 className="text-h3">Te queda cerca si vives en</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {location.nearbyDistricts.map((district) => (
          <li key={district} className="rounded-full bg-teal-tint px-4 py-2 font-semibold text-heading">
            {district}
          </li>
        ))}
      </ul>
      <h2 className="text-h3 mt-8">Qué estudios hacemos aquí</h2>
      <ul className="mt-4 space-y-2">
        {location.services.map((service) => (
          <li key={service} className="flex gap-3 text-fg">
            <Check aria-hidden strokeWidth={2} className="mt-1 size-5 shrink-0 text-primary" /> {service}
          </li>
        ))}
      </ul>
      <Link href={DENSITOMETRY_PATH} className="mt-5 inline-flex min-h-12 items-center gap-1.5 font-display font-semibold text-primary hover:underline">
        Qué es y cómo prepararte para la densitometría <ArrowRight aria-hidden className="size-5" />
      </Link>
    </div>
  );
}

function OtherLocations({ current }: { current: ClinicLocation }) {
  const others = site.locations.filter((location) => location.id !== current.id);
  return (
    <section aria-labelledby="otras-sedes-title" className="pb-24">
      <div className="container-page">
        <h2 id="otras-sedes-title" className="text-h2">
          Otras sedes
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {others.map((location) => (
            <li key={location.id}>
              <LocationCard location={location} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function LocationPage({ params }: PageProps<"/sedes/[slug]">) {
  const { slug } = await params;
  const location = findLocation(slug);
  if (!location) notFound();
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Sedes", href: LOCATIONS_PATH },
    { label: location.name, href: `${LOCATIONS_PATH}/${location.id}` },
  ];

  return (
    <>
      <JsonLd data={locationClinicSchema(location)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero
        id="sede-title"
        crumbs={crumbs}
        eyebrow={`Sede ${location.name}`}
        title={locationPageTitle(location)}
        accent={location.placeName ?? location.name}
        lead={location.intro}
        actions={
          <>
            <a
              href={locationWhatsApp(location, withLocation(densitometry.cta.message, location))}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "lg" })}
            >
              <WhatsAppIcon /> Agendar en {location.name}
              <span className="sr-only"> (abre WhatsApp en otra pestaña)</span>
            </a>
            <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Cómo llegar <ArrowUpRight aria-hidden />
              <span className="sr-only"> (Google Maps, pestaña nueva)</span>
            </a>
          </>
        }
      />

      <section aria-label={`Ubicación de la sede ${location.name}`} className="pb-12">
        <div className="container-page grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <MapFacade location={location} />
          <div className="space-y-4">
            <LocationCard location={location} as="h2" showDetailLink={false} className="h-auto" />
            <ul className="space-y-2 px-2" aria-label="Cómo llegar">
              {location.howToArrive.map((tip) => (
                <li key={tip} className="flex gap-3 text-fg">
                  <Navigation aria-hidden strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-primary" /> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="Distritos y estudios" className="pb-16">
        <div className="container-page">
          <NearbyDistricts location={location} />
        </div>
      </section>

      <OtherLocations current={location} />
    </>
  );
}
