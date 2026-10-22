import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { APPOINTMENT_HREF, LOCATIONS_PATH } from "@/data/navigation";
import { CENTER_TAGLINE, site } from "@/data/site";
import { primaryWhatsAppLine } from "@/lib/locations";
import { clinicWhatsApp } from "@/lib/whatsapp";

/** Franja superior. Componente de servidor: posicionamiento + «Agenda tu cita» + WhatsApp. */
export function TopBar() {
  return (
    <div className="h-10 bg-navy text-base text-slate-200">
      <div className="container-page flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <Link href={LOCATIONS_PATH} className="hidden items-center gap-1.5 hover:text-white 2xl:inline-flex">
            <MapPin aria-hidden strokeWidth={1.75} className="size-4 text-teal" />
            {site.locations.length} sedes: {site.locations.map((location) => location.name).join(" · ")}
          </Link>
          <Link href={APPOINTMENT_HREF} className="group inline-flex min-w-0 items-center gap-1.5 hover:text-white">
            <span className="truncate">
              <span className="font-semibold text-white">{CENTER_TAGLINE}</span>
              <span className="hidden md:inline"> y Densitometría</span>
              <span className="hidden sm:inline"> — Agenda tu cita o estudio hoy</span>
            </span>
            <ArrowRight
              aria-hidden
              strokeWidth={1.75}
              className="size-4 shrink-0 text-teal transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
        <a
          href={clinicWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="-mr-2 inline-flex min-h-10 shrink-0 items-center gap-1.5 px-2 font-semibold text-white hover:text-teal-200"
        >
          <WhatsAppIcon className="size-4" />
          <span className="hidden lg:inline">{primaryWhatsAppLine().display}</span>
          <span className="sr-only lg:hidden">WhatsApp</span>
          <span className="sr-only"> (abre WhatsApp en otra pestaña)</span>
        </a>
      </div>
    </div>
  );
}
