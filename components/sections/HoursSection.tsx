import Link from "next/link";
import { CalendarCheck, MapPin } from "lucide-react";
import { HoursBlock } from "@/components/shared/HoursBlock";
import { buttonVariants } from "@/components/ui/button";
import { APPOINTMENT_HREF, LOCATIONS_PATH } from "@/data/navigation";
import { site } from "@/data/site";

/** Home: «Dónde y cuándo» a la vista (horario general + sedes + Agendar cita). Componente de servidor. */
export function HoursSection() {
  return (
    <section aria-labelledby="horario-title" className="pb-16 sm:pb-24">
      <div className="container-page grid gap-4 md:grid-cols-2">
        <HoursBlock />
        <div className="flex flex-col rounded-[1.75rem] bg-navy p-6 text-white shadow-soft dark:bg-navy-3">
          <p className="flex items-center gap-2.5 font-display text-xl font-bold">
            <MapPin aria-hidden strokeWidth={1.75} className="size-6 text-teal" /> {site.locations.length} sedes
          </p>
          <ul className="mb-6 mt-4 space-y-2 text-slate-200">
            {site.locations.map((location) => (
              <li key={location.id}>
                <Link href={`${LOCATIONS_PATH}/${location.id}`} className="inline-flex min-h-10 items-center font-semibold text-white hover:text-teal-200">
                  {location.name}
                </Link>
                {location.shortReference ? <span className="text-slate-300"> · {location.shortReference}</span> : null}
              </li>
            ))}
          </ul>
          <Link href={APPOINTMENT_HREF} className={buttonVariants({ variant: "light", size: "lg", className: "mt-auto w-full sm:w-auto sm:self-start" })}>
            <CalendarCheck aria-hidden strokeWidth={1.75} /> Agendar cita
          </Link>
        </div>
      </div>
    </section>
  );
}
