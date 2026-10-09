import Link from "next/link";
import { Phone, Video } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { BOOKING_HREF } from "@/data/navigation";
import { doctorContact } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const ACTION =
  "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.85rem] font-semibold leading-tight transition-transform active:scale-95 [&_svg]:size-5";

/**
 * Única barra fija en móvil: Teleconsulta · WhatsApp · Llamar (al alcance del pulgar, respeta la
 * zona segura). Componente de servidor, sin JS. El pie reserva su alto para no tapar contenido.
 */
export function MobileActionBar() {
  const contact = doctorContact();
  return (
    <nav
      aria-label="Acciones rápidas"
      className="glass fixed inset-x-0 bottom-0 z-50 flex gap-2 border-x-0 border-b-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      <Link href={BOOKING_HREF} className={cn(ACTION, "bg-primary text-on-primary")}>
        <Video aria-hidden strokeWidth={1.75} />
        Teleconsulta
      </Link>
      {contact ? (
        <>
          <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className={cn(ACTION, "bg-whatsapp-strong text-on-whatsapp")}>
            <WhatsAppIcon />
            WhatsApp
            <span className="sr-only"> con el doctor (se abre en otra pestaña)</span>
          </a>
          <a href={contact.telHref} className={cn(ACTION, "border border-line bg-card-solid text-heading")}>
            <Phone aria-hidden strokeWidth={1.75} />
            Llamar
            <span className="sr-only"> al doctor ({contact.display})</span>
          </a>
        </>
      ) : null}
    </nav>
  );
}
