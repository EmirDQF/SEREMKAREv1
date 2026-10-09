import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Acordeón con <details>/<summary> nativos: sin JavaScript, accesible con teclado y lector de
 * pantalla, y el contenido sigue en el HTML (buscadores). Misma API que la versión con Radix.
 */

interface AccordionProps {
  children: ReactNode;
  className?: string;
  /** Se conservan por compatibilidad con la API anterior (Radix). */
  type?: "single" | "multiple";
  collapsible?: boolean;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={className}>{children}</div>;
}

interface AccordionItemProps {
  children: ReactNode;
  className?: string;
  /** Identificador del ítem (se conserva por compatibilidad). */
  value?: string;
}

export function AccordionItem({ children, className }: AccordionItemProps) {
  return (
    <details
      className={cn(
        "group rounded-3xl border border-line bg-card-solid transition-[box-shadow,border-color] duration-300",
        "open:border-teal/50 open:shadow-[0_0_0_1px_rgb(0_168_150/0.25),0_16px_40px_-16px_rgb(0_168_150/0.45)]",
        className,
      )}
    >
      {children}
    </details>
  );
}

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  return (
    <summary
      className={cn(
        "flex min-h-16 w-full cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-5 py-4 text-left font-display text-[1.05rem] font-semibold text-heading sm:px-6 [&::-webkit-details-marker]:hidden",
        className,
      )}
    >
      {children}
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-tint text-primary transition-transform duration-300 group-open:rotate-180">
        <ChevronDown aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
    </summary>
  );
}

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  return <div className={cn("px-5 pb-6 text-muted sm:px-6", className)}>{children}</div>;
}
