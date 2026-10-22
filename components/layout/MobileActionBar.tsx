import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { APPOINTMENT_HREF } from "@/data/navigation";
import { clinicWhatsApp, doctorContact } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const ACTION =
  "flex min-h-14 items-center justify-center gap-2 rounded-2xl font-display text-base font-bold leading-tight transition-transform duration-150 active:scale-[0.97] [&_svg]:size-5 [&_svg]:shrink-0";

/**
 * Única barra fija en móvil: «Agendar cita» (acción principal) + WhatsApp (secundaria), al alcance
 * del pulgar y respetando la zona segura. Componente de servidor, sin JS. El pie reserva su alto.
 */
export function MobileActionBar() {
  const whatsappHref = doctorContact()?.whatsappHref ?? clinicWhatsApp();
  return (
    <nav
      aria-label="Acciones rápidas"
      className="glass fixed inset-x-0 bottom-0 z-50 flex gap-2 border-x-0 border-b-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      <Link href={APPOINTMENT_HREF} className={cn(ACTION, "flex-[2] bg-primary text-on-primary glow-cta")}>
        <CalendarCheck aria-hidden strokeWidth={1.75} />
        Agendar cita
      </Link>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(ACTION, "flex-1 border border-line bg-card-solid text-heading")}
      >
        <WhatsAppIcon className="text-whatsapp-strong" />
        WhatsApp
        <span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
    </nav>
  );
}
