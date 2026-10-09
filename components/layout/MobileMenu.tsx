"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { BOOKING_HREF, moreLinks, primaryLinks } from "@/data/navigation";
import type { DoctorContact } from "@/lib/whatsapp";

const MENU_LINKS = [...primaryLinks, ...moreLinks] as const;

interface MobileMenuProps {
  /** Logo renderizado en el servidor. */
  logo: ReactNode;
  /** Contacto directo con el doctor (null: sin botones). */
  contact: DoctorContact | null;
  /** «Atención con cita previa · Los Olivos, Callao y Puente Piedra» */
  footnote: string;
  /** Clases de los botones, calculadas en el servidor (sin tailwind-merge en el navegador). */
  buttonClasses: { booking: string; whatsapp: string; call: string };
}

/**
 * Menú móvil a pantalla completa sobre <dialog> nativo (showModal: foco atrapado y Escape sin JS
 * extra). Sin Radix ni motion: solo abre, cierra y se cierra al elegir un enlace.
 */
export function MobileMenu({ logo, contact, footnote, buttonClasses }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  /** Al tocar cualquier enlace del menú, se cierra (la navegación es del lado del cliente). */
  const closeOnLink = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Abrir menú"
        className="grid size-12 place-items-center rounded-full text-heading hover:bg-teal-tint lg:hidden"
      >
        <Menu aria-hidden strokeWidth={1.75} className="size-6" />
      </button>
      <dialog
        ref={dialogRef}
        data-lenis-prevent
        aria-label="Menú de navegación"
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg p-0 text-fg backdrop:bg-transparent"
      >
        <div className="flex min-h-full flex-col" onClick={closeOnLink}>
          <div className="container-page flex min-h-[4.5rem] items-center justify-between pt-3">
            {logo}
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="grid size-12 place-items-center rounded-full text-heading hover:bg-teal-tint"
            >
              <X aria-hidden strokeWidth={1.75} className="size-6" />
            </button>
          </div>

          <nav aria-label="Menú móvil" className="container-page flex flex-1 flex-col pb-8 pt-6">
            <ul className="space-y-1">
              {MENU_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-14 items-center justify-between rounded-2xl px-3 font-display text-2xl font-bold text-heading hover:bg-teal-tint"
                  >
                    {link.label}
                    <ArrowRight aria-hidden strokeWidth={1.75} className="size-5 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 pt-8">
              <Link href={BOOKING_HREF} className={buttonClasses.booking}>
                Agendar teleconsulta
              </Link>
              {contact ? (
                <div className="grid grid-cols-2 gap-3">
                  <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses.whatsapp}>
                    <WhatsAppIcon /> WhatsApp
                    <span className="sr-only"> con el doctor (se abre en otra pestaña)</span>
                  </a>
                  <a href={contact.telHref} className={buttonClasses.call}>
                    <Phone aria-hidden strokeWidth={1.75} /> Llamar
                    <span className="sr-only"> al doctor ({contact.display})</span>
                  </a>
                </div>
              ) : null}
              <p className="pt-2 text-center text-sm text-muted">{footnote}</p>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
