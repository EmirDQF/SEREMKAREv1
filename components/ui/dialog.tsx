import type { ComponentProps, ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "@/lib/cx";

/**
 * Diálogo modal sobre <dialog> nativo (showModal): foco atrapado, Escape, capa superior y retorno del
 * foco los da el navegador. Componentes de servidor: SiteEffects abre (`data-dialog-open`) y cierra
 * (`data-dialog-close`, clic en el fondo, enlace elegido). El contenido ya está en el HTML.
 */

interface DialogTriggerProps extends Omit<ComponentProps<"button">, "type" | "onClick"> {
  /** id del <DialogPanel> que abre. */
  dialogId: string;
}

export function DialogTrigger({ dialogId, children, ...props }: DialogTriggerProps) {
  return (
    <button type="button" data-dialog-open={dialogId} aria-haspopup="dialog" aria-expanded="false" aria-controls={dialogId} {...props}>
      {children}
    </button>
  );
}

interface DialogPanelProps {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DialogPanel({ id, title, description, children, className }: DialogPanelProps) {
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;
  return (
    <dialog
      id={id}
      data-lenis-prevent
      data-close-on-link
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cx(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[1.75rem] border border-line bg-card-solid p-0 text-fg shadow-lift focus:outline-none",
        className,
      )}
    >
      <div className="relative p-6 sm:p-8">
        <h2 id={titleId} className="text-h3 pr-10 text-heading">
          {title}
        </h2>
        {description ? (
          <p id={descriptionId} className="mt-2 text-muted">
            {description}
          </p>
        ) : null}
        {children}
        <button
          type="button"
          data-dialog-close
          aria-label="Cerrar"
          className="absolute right-3 top-3 grid size-12 place-items-center rounded-full text-muted transition-colors hover:bg-teal-tint hover:text-heading"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>
    </dialog>
  );
}
