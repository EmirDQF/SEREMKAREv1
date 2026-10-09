"use client";

import Link from "next/link";
import { Clock, MapPin, Video } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { LOCATIONS_PATH } from "@/data/navigation";
import { site } from "@/data/site";
import { TELECONSULT_HOURS_LABEL } from "@/data/teleconsult";
import { primaryWhatsAppLine } from "@/lib/locations";
import { useOpenStatus } from "@/lib/use-open-status";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const TOPBAR_HEIGHT_CLASS = "h-10";

export function TopBar() {
  const status = useOpenStatus();

  return (
    <div className={cn("bg-navy text-[0.85rem] text-slate-200", TOPBAR_HEIGHT_CLASS)}>
      <div className="container-page flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <Link href={LOCATIONS_PATH} className="hidden items-center gap-1.5 hover:text-white xl:inline-flex">
            <MapPin aria-hidden strokeWidth={1.75} className="size-4 text-teal" />
            {site.locations.length} sedes: {site.locations.map((location) => location.name).join(" · ")}
          </Link>
          <span className="inline-flex min-w-0 items-center gap-2" aria-live="polite">
            {status ? (
              <>
                <span aria-hidden className={status.isOpen ? "online-dot" : "offline-dot"} />
                <span className="truncate">
                  <strong className="font-semibold text-white">{status.headline}</strong>
                  <span className="hidden sm:inline"> · {status.detail}</span>
                </span>
              </>
            ) : (
              <Link href="/teleconsulta" className="inline-flex items-center gap-1.5 truncate hover:text-white">
                <Video aria-hidden strokeWidth={1.75} className="size-4 text-teal" />
                Teleconsulta por videollamada · todo el Perú
                <span className="hidden lg:inline">
                  {" "}
                  · <Clock aria-hidden strokeWidth={1.75} className="inline size-4 text-teal" /> {TELECONSULT_HOURS_LABEL}
                </span>
              </Link>
            )}
          </span>
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
