import { Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { SuccessBurst } from "@/components/shared/SuccessBurst";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { TELECONSULT_HOURS_LABEL } from "@/data/teleconsult";
import { buildMailtoLink, clinicWhatsApp } from "@/lib/whatsapp";

interface BookingSuccessProps {
  message: string;
  onReset: () => void;
}

/** Estado de éxito: el mensaje ya se abrió en WhatsApp; alternativas para reenviarlo. */
export function BookingSuccess({ message, onReset }: BookingSuccessProps) {
  return (
    <div role="status" className="text-center">
      <SuccessBurst />
      <h3 className="text-h3 mt-4">¡Listo! Tu teleconsulta está en WhatsApp</h3>
      <p className="mt-2 text-muted">
        Envía el mensaje que se abrió y te confirmamos el turno con el enlace de la videollamada. Atendemos{" "}
        {TELECONSULT_HOURS_LABEL.toLowerCase()}.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href={clinicWhatsApp(message)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp" })}>
          <WhatsAppIcon /> Abrir WhatsApp de nuevo
        </a>
        {site.email ? (
          <a href={buildMailtoLink(site.email, "Solicitud de teleconsulta", message)} className={buttonVariants({ variant: "outline" })}>
            <Mail aria-hidden strokeWidth={1.75} /> Enviar por correo
          </a>
        ) : null}
      </div>
      <button type="button" onClick={onReset} className="mt-5 min-h-12 font-semibold text-primary hover:underline">
        Agendar otra teleconsulta
      </button>
    </div>
  );
}
