import dynamic from "next/dynamic";
import Link from "next/link";
import { Clock, MapPin, Video } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { LOCATIONS_PATH } from "@/data/navigation";
import { site } from "@/data/site";
import { TELECONSULT_HOURS_LABEL } from "@/data/teleconsult";
import { primaryLocation, primaryWhatsAppLine } from "@/lib/locations";
import { clinicWhatsApp } from "@/lib/whatsapp";

/** Estado «abierto ahora» en vivo: solo se descarga con horario confirmado. */
const OpenStatusIsland = dynamic(() => import("@/components/shared/OptionalIslands").then((mod) => mod.OpenStatusIsland));

/** Franja superior. Componente de servidor; el estado «abierto ahora» solo se monta con horario confirmado. */
export function TopBar() {
  const teleconsultLink = (
    <Link href="/teleconsulta" className="inline-flex min-w-0 items-center gap-1.5 truncate hover:text-white">
      <Video aria-hidden strokeWidth={1.75} className="size-4 shrink-0 text-teal" />
      <span className="truncate">Teleconsulta por videollamada · todo el Perú</span>
      <span className="hidden lg:inline">
        {" "}
        · <Clock aria-hidden strokeWidth={1.75} className="inline size-4 text-teal" /> {TELECONSULT_HOURS_LABEL}
      </span>
    </Link>
  );

  return (
    <div className="h-10 bg-navy text-[0.85rem] text-slate-200">
      <div className="container-page flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <Link href={LOCATIONS_PATH} className="hidden items-center gap-1.5 hover:text-white xl:inline-flex">
            <MapPin aria-hidden strokeWidth={1.75} className="size-4 text-teal" />
            {site.locations.length} sedes: {site.locations.map((location) => location.name).join(" · ")}
          </Link>
          {primaryLocation().hours.confirmed ? <OpenStatusIsland fallback={teleconsultLink} /> : teleconsultLink}
        </div>
        <a
          href={clinicWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-white hover:text-teal-200"
        >
          <WhatsAppIcon className="size-4" />
          <span className="hidden sm:inline">{primaryWhatsAppLine().display}</span>
          <span className="sm:hidden">WhatsApp</span>
          <span className="sr-only"> (abre WhatsApp en otra pestaña)</span>
        </a>
      </div>
    </div>
  );
}
