import type { Metadata } from "next";
import { Mail, Navigation } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { JsonLd } from "@/components/shared/JsonLd";
import { LocationCard } from "@/components/shared/LocationCard";
import { LocationWhatsAppPicker } from "@/components/shared/LocationWhatsAppPicker";
import { MapFacade } from "@/components/shared/MapFacade";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { buttonVariants } from "@/components/ui/button";
import { BOOKING_HREF } from "@/data/navigation";
import { site } from "@/data/site";
import { allWhatsAppLines, locationNamesLabel, primaryLocation } from "@/lib/locations";
import { ORGANIZATION_ID, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const TITLE = `Contacto y sedes en ${locationNamesLabel()} | ${site.name}`;
const DESCRIPTION = `Escríbenos por WhatsApp o visítanos en nuestras sedes de ${locationNamesLabel()}. ${primaryLocation().hours.label}.`;
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/contacto" }),
  title: { absolute: TITLE },
};

const CARD = "flex h-full flex-col rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft transition-colors hover:border-primary";
const ICON_BADGE = "grid size-12 place-items-center rounded-2xl bg-teal-tint text-primary [&_svg]:size-6";

function ChannelCards() {
  return (
    <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {allWhatsAppLines().map((line) => (
        <RevealItem as="li" key={line.number}>
          <TiltCard className="h-full rounded-[1.75rem]">
            <a href={buildWhatsAppLink(line.number, site.defaultWhatsAppMessage)} target="_blank" rel="noopener noreferrer" className={CARD}>
              <span className={ICON_BADGE}>
                <WhatsAppIcon />
              </span>
              <span className="mt-4 font-display font-semibold text-heading">WhatsApp · {line.label}</span>
              <span className="mt-1 text-lg font-semibold text-primary">{line.display}</span>
              <span className="mt-1 text-sm text-muted">La forma más rápida de agendar.</span>
              <span className="sr-only"> (abre WhatsApp en otra pestaña)</span>
            </a>
          </TiltCard>
        </RevealItem>
      ))}
      {site.email ? (
        <RevealItem as="li">
          <TiltCard className="h-full rounded-[1.75rem]">
            <a href={`mailto:${site.email}`} className={CARD}>
              <span className={ICON_BADGE}>
                <Mail aria-hidden />
              </span>
              <span className="mt-4 font-display font-semibold text-heading">Correo</span>
              <span className="mt-1 break-words text-lg font-semibold text-primary">{site.email}</span>
              <span className="mt-1 text-sm text-muted">Te respondemos en horario de atención.</span>
            </a>
          </TiltCard>
        </RevealItem>
      ) : null}
    </RevealGroup>
  );
}

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${site.url}/contacto`,
          mainEntity: { "@id": ORGANIZATION_ID },
        }}
      />
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="contacto-title"
        crumbs={CRUMBS}
        eyebrow="Contacto"
        title="Estamos para ayudarte"
        accent="ayudarte"
        lead={`Escríbenos por WhatsApp o visítanos en ${locationNamesLabel()}. ${primaryLocation().hours.label}.`}
        actions={
          <>
            <LocationWhatsAppPicker triggerClassName={buttonVariants({ variant: "whatsapp", size: "lg" })}>
              <WhatsAppIcon /> Escribir por WhatsApp
            </LocationWhatsAppPicker>
            <a href={BOOKING_HREF} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Agendar con el formulario
            </a>
          </>
        }
      />

      <section aria-label="Canales de contacto" className="pb-12">
        <div className="container-page">
          <ChannelCards />
        </div>
      </section>

      <section aria-labelledby="sedes-title" className="pb-24">
        <div className="container-page space-y-10">
          <h2 id="sedes-title" className="text-h2">
            Nuestras sedes
          </h2>
          {site.locations.map((location) => (
            <div key={location.id} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <MapFacade location={location} />
              <div className="space-y-4">
                <LocationCard location={location} className="h-auto" />
                <ul className="space-y-2 px-2" aria-label={`Cómo llegar a la sede ${location.name}`}>
                  {location.howToArrive.map((tip) => (
                    <li key={tip} className="flex gap-3 text-fg">
                      <Navigation aria-hidden strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-primary" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
