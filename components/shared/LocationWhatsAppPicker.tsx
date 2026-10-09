import type { ReactNode } from "react";
import { HelpCircle, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { primaryWhatsAppLine } from "@/lib/locations";
import { clinicWhatsApp, locationWhatsApp, withLocation } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface LocationWhatsAppPickerProps {
  /** Mensaje base; se le agrega «en la sede de …» según la sede elegida. */
  message?: string;
  /** Contenido visible del botón que abre el selector. */
  children: ReactNode;
  /** Nombre accesible del botón cuando su contenido es solo un icono. */
  triggerLabel?: string;
  className?: string;
  triggerClassName?: string;
  /** Posición del panel (p. ej. "bottom-full right-0 mb-3"). */
  panelClassName?: string;
}

const NEW_TAB_NOTICE = " (abre WhatsApp en otra pestaña)";
const OPTION = "flex gap-3 rounded-2xl p-3 transition-colors hover:bg-teal-tint focus-visible:bg-teal-tint";

/**
 * Botón que despliega las sedes y abre el WhatsApp de la sede elegida. <details>/<summary> nativos:
 * sin JS propio. `data-dropdown` hace que se cierre con Escape, al hacer clic fuera o al elegir una
 * sede (components/layout/HeaderScrollState.tsx).
 */
export function LocationWhatsAppPicker({
  message = site.defaultWhatsAppMessage,
  children,
  triggerLabel,
  className,
  triggerClassName,
  panelClassName = "top-full left-0 mt-2",
}: LocationWhatsAppPickerProps) {
  return (
    <details data-dropdown className={cn("group/picker relative", className)}>
      <summary aria-label={triggerLabel} className={cn("cursor-pointer list-none [&::-webkit-details-marker]:hidden", triggerClassName)}>
        {children}
      </summary>
      <div
        className={cn(
          "absolute z-50 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-line bg-card-solid p-3 text-left shadow-lift",
          panelClassName,
        )}
      >
        <p className="px-2 pb-2 pt-1 font-display font-semibold text-heading">¿A qué sede quieres escribir?</p>
        <ul className="space-y-1">
          {site.locations.map((location) => (
            <li key={location.id}>
              <a href={locationWhatsApp(location, withLocation(message, location))} target="_blank" rel="noopener noreferrer" className={OPTION}>
                <MapPin aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <span className="block font-semibold text-heading">{location.name}</span>
                  <span className="block text-sm text-muted">{location.reference ?? location.street}</span>
                  <span className="block text-sm font-semibold text-primary">{location.whatsapp.display}</span>
                  <span className="sr-only">{NEW_TAB_NOTICE}</span>
                </span>
              </a>
            </li>
          ))}
          <li>
            <a href={clinicWhatsApp(message)} target="_blank" rel="noopener noreferrer" className={OPTION}>
              <HelpCircle aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <span className="block font-semibold text-heading">No sé cuál me queda cerca</span>
                <span className="block text-sm text-muted">Te orientamos por la línea principal</span>
                <span className="block text-sm font-semibold text-primary">{primaryWhatsAppLine().display}</span>
                <span className="sr-only">{NEW_TAB_NOTICE}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </details>
  );
}
