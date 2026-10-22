import Link from "next/link";
import { APPOINTMENT_HREF } from "@/data/navigation";
import { CalendarCheck, Phone } from "lucide-react";
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

/** Sedes (con «cómo llegar» en cada tarjeta) y banda final de llamada a la acción. Componente de servidor. */
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

        <div className="scan-panel relative isolate overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white sm:px-12 lg:py-20">
          <div aria-hidden className="aurora -z-10" />
          <div aria-hidden className="immersive-grid -z-10" />
          <JointMotif mode="loop" className="mx-auto h-28 w-auto" />
          <h2 className="text-h2 mx-auto mt-6 max-w-3xl text-white">No tienes que acostumbrarte al dolor</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-navy-muted">
            Da el primer paso hoy. Te orientamos y agendamos tu consulta con el especialista adecuado.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={APPOINTMENT_HREF} className={buttonVariants({ variant: "primary", size: "lg" })}>
              <CalendarCheck aria-hidden strokeWidth={1.75} /> Agendar cita
            </Link>
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
