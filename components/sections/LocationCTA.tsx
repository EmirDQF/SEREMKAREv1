import { BOOKING_HREF } from "@/data/navigation";
import { Phone } from "lucide-react";
import { JointMotif } from "@/components/shared/JointMotif";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { LocationCard } from "@/components/shared/LocationCard";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltCard } from "@/components/shared/TiltCard";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { locationNamesLabel, primaryWhatsAppLine } from "@/lib/locations";
import { clinicWhatsApp } from "@/lib/whatsapp";

export function LocationCTA() {
  const mainLine = primaryWhatsAppLine();

  return (
    <section aria-labelledby="ubicacion-title" className="section-y">
      <div className="container-page space-y-10">
        <SectionHeading
          id="ubicacion-title"
          eyebrow="Nuestras sedes"
          title={`${site.locations.length} sedes cerca de ti`}
          description={`Estamos en ${locationNamesLabel()}. Elige la que te quede más cerca y escríbele directo por WhatsApp.`}
        />
        <RevealGroup as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {site.locations.map((location) => (
            <RevealItem as="li" key={location.id}>
              <TiltCard className="h-full rounded-[1.75rem]">
                <LocationCard location={location} />
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-center text-white sm:px-12 lg:py-20 dark:bg-navy-3">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_0%,rgb(0_168_150/0.3),transparent_70%)]" />
          <JointMotif mode="loop" className="mx-auto h-28 w-auto" />
          <h2 className="text-h2 mx-auto mt-6 max-w-3xl text-white">No tienes que acostumbrarte al dolor</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
            Da el primer paso hoy. Te orientamos y agendamos tu consulta con el especialista adecuado.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={BOOKING_HREF} className={buttonVariants({ variant: "light", size: "lg" })}>
              Agendar consulta
            </a>
            <a
              href={clinicWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "lg" })}
            >
              <WhatsAppIcon /> WhatsApp
              <span className="sr-only"> (abre WhatsApp en otra pestaña)</span>
            </a>
            <a
              href={`tel:+${mainLine.number}`}
              className={`${buttonVariants({ size: "lg" })} border border-white/25 bg-transparent text-white shadow-none hover:bg-white/10`}
            >
              <Phone aria-hidden strokeWidth={1.75} /> {mainLine.display}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
