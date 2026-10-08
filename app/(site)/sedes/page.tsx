import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { JsonLd } from "@/components/shared/JsonLd";
import { LocationCard } from "@/components/shared/LocationCard";
import { LocationWhatsAppPicker } from "@/components/shared/LocationWhatsAppPicker";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { buttonVariants } from "@/components/ui/button";
import { LOCATIONS_PATH } from "@/data/navigation";
import { site } from "@/data/site";
import { locationNamesLabel } from "@/lib/locations";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TITLE = `Sedes de densitometría ósea en ${locationNamesLabel()} | ${site.name}`;
const DESCRIPTION = `Densitometría ósea con cita previa en ${site.locations.length} sedes: ${site.locations
  .map((location) => (location.reference ? `${location.name} (${location.reference.toLowerCase()})` : location.name))
  .join(", ")}.`;
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Sedes", href: LOCATIONS_PATH },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: LOCATIONS_PATH }),
  title: { absolute: TITLE },
};

export default function LocationsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="sedes-title"
        crumbs={CRUMBS}
        eyebrow="Sedes"
        title={`${site.locations.length} sedes cerca de ti`}
        accent="cerca de ti"
        lead={`Estamos en ${locationNamesLabel()}. Elige la sede que te quede más cerca y agenda por WhatsApp.`}
        actions={
          <LocationWhatsAppPicker triggerClassName={buttonVariants({ variant: "whatsapp", size: "lg" })}>
            <WhatsAppIcon /> Escribir por WhatsApp
          </LocationWhatsAppPicker>
        }
      />
      <section aria-label="Lista de sedes" className="pb-24">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {site.locations.map((location) => (
              <RevealItem as="li" key={location.id}>
                <TiltCard className="h-full rounded-[1.75rem]">
                  <LocationCard location={location} as="h2" />
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
