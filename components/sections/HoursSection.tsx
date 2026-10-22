import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { HoursBlock } from "@/components/shared/HoursBlock";
import { buttonVariants } from "@/components/ui/button";
import { APPOINTMENT_HREF, LOCATIONS_PATH } from "@/data/navigation";
import { locationNamesLabel } from "@/lib/locations";

/** Home: «Dónde y cuándo» a la vista (horario general + Agendar cita). Las sedes van en LocationCTA. */
export function HoursSection() {
  return (
    <section aria-labelledby="horario-title" className="pb-16 sm:pb-24">
      <div className="container-page grid gap-4 md:grid-cols-2">
        <HoursBlock />
        <div className="flex flex-col justify-between gap-6 rounded-[1.75rem] bg-navy p-6 text-white shadow-soft dark:bg-navy-3">
          <div>
            <p className="font-display text-xl font-bold">¿Listo para tu primera cita?</p>
            <p className="mt-2 text-slate-200">Te atendemos con cita previa en {locationNamesLabel()}, o por teleconsulta desde casa.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href={APPOINTMENT_HREF} className={buttonVariants({ variant: "light", size: "lg" })}>
              <CalendarCheck aria-hidden strokeWidth={1.75} /> Agendar cita
            </Link>
            <Link href={LOCATIONS_PATH} className="inline-flex min-h-12 items-center gap-1.5 font-semibold text-teal-200 hover:text-white">
              Ver sedes y cómo llegar <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
