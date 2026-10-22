import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { LocationWhatsAppPicker } from "@/components/shared/LocationWhatsAppPicker";
import { buttonVariants, type ButtonVariant } from "@/components/ui/button";
import { densitometry } from "@/data/densitometry";
import { cn } from "@/lib/utils";

interface BookDensitometryButtonProps {
  className?: string;
  /** Muestra debajo "Densitometría y consulta en una sola visita". */
  withSupport?: boolean;
  /** Variante del botón (outline cuando acompaña a «Agendar densitometría» en línea). */
  variant?: ButtonVariant;
  label?: string;
}

/** CTA "Agendar densitometría": elige la sede y abre su WhatsApp con el mensaje prellenado. */
export function BookDensitometryButton({
  className,
  withSupport = true,
  variant = "primary",
  label = densitometry.cta.label,
}: BookDensitometryButtonProps) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <LocationWhatsAppPicker
        message={densitometry.cta.message}
        triggerClassName={buttonVariants({ variant, size: "lg" })}
      >
        <WhatsAppIcon className={variant === "outline" ? "text-whatsapp-strong" : undefined} />
        {label}
      </LocationWhatsAppPicker>
      {withSupport ? <p className="text-sm font-semibold text-muted">{densitometry.cta.support}</p> : null}
    </div>
  );
}
