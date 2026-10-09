"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "@/lib/cx";

/**
 * Diálogo modal sobre <dialog> nativo (showModal): foco atrapado, Escape, capa superior y retorno del
 * foco los da el navegador. Sustituye a Radix con la misma API y una fracción del JS.
 */

interface DialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogState | null>(null);

function useDialog(): DialogState {
  const state = useContext(DialogContext);
  if (!state) throw new Error("Los componentes Dialog* deben ir dentro de <Dialog>.");
  return state;
}

export function Dialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const state = useMemo(() => ({ open, setOpen, titleId: `${id}-title`, descriptionId: `${id}-description` }), [open, id]);
  return <DialogContext.Provider value={state}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children, ...props }: Omit<ComponentProps<"button">, "type" | "onClick">) {
  const { open, setOpen } = useDialog();
  return (
    <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
}

export function DialogClose({ children, ...props }: Omit<ComponentProps<"button">, "type" | "onClick">) {
  const { setOpen } = useDialog();
  return (
    <button type="button" onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  );
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
  /** Sin padding ni fondo (p. ej. reproductor de video). */
  bare?: boolean;
  /** Ancho máximo amplio (video) en lugar del de un diálogo de texto. */
  wide?: boolean;
}

export function DialogContent({ children, className, bare = false, wide = false }: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialog();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={() => setOpen(false)}
      // Clic en el fondo (fuera del contenido): el destino es el propio <dialog>.
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
      className={cx(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-[1.75rem] p-0 focus:outline-none",
        wide ? "max-w-5xl" : "max-w-lg",
        bare ? "border-0 bg-transparent" : "border border-line bg-card-solid text-fg shadow-lift",
        className,
      )}
    >
      {open ? (
        <div className={cx("relative", !bare && "p-6 sm:p-8")}>
          {children}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cx(
              "absolute right-3 top-3 grid size-12 place-items-center rounded-full transition-colors",
              bare ? "bg-black/50 text-white hover:bg-black/70" : "text-muted hover:bg-teal-tint hover:text-heading",
            )}
            aria-label="Cerrar"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
      ) : null}
    </dialog>
  );
}

export function DialogTitle({ className, ...props }: Omit<ComponentProps<"h2">, "id">) {
  const { titleId } = useDialog();
  return <h2 id={titleId} className={cx("text-h3 pr-10 text-heading", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: Omit<ComponentProps<"p">, "id">) {
  const { descriptionId } = useDialog();
  return <p id={descriptionId} className={cx("mt-2 text-muted", className)} {...props} />;
}
