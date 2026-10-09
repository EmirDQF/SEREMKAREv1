"use client";

import Link from "next/link";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { type Variants } from "motion/react";
import * as m from "motion/react-m";
import { Logo } from "@/components/layout/Logo";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { BOOKING_HREF, moreLinks, primaryLinks } from "@/data/navigation";
import { locationNamesLabel, primaryLocation, primaryWhatsAppLine } from "@/lib/locations";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const MENU_LINKS = [...primaryLinks, ...moreLinks] as const;

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/** Menú móvil a pantalla completa con entrada escalonada. */
export function MobileMenu() {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        className="grid size-12 place-items-center rounded-full text-heading hover:bg-teal-tint lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu aria-hidden strokeWidth={1.75} className="size-6" />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          data-lenis-prevent
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-bg data-[state=open]:animate-fade-in"
        >
          <div className="container-page flex min-h-[4.5rem] items-center justify-between pt-3">
            <Logo />
            <DialogPrimitive.Close
              className="grid size-12 place-items-center rounded-full text-heading hover:bg-teal-tint"
              aria-label="Cerrar menú"
            >
              <X aria-hidden strokeWidth={1.75} className="size-6" />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Title className="sr-only">Menú de navegación</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Secciones de la web y canales para agendar tu consulta.
          </DialogPrimitive.Description>

          <nav aria-label="Menú móvil" className="container-page flex flex-1 flex-col pb-8 pt-6">
            <m.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-1">
              {MENU_LINKS.map((link) => (
                <m.li key={link.href} variants={itemVariants}>
                  <DialogPrimitive.Close asChild>
                    <Link
                      href={link.href}
                      className="flex min-h-14 items-center justify-between rounded-2xl px-3 font-display text-2xl font-bold text-heading hover:bg-teal-tint"
                    >
                      {link.label}
                      <ArrowRight aria-hidden strokeWidth={1.75} className="size-5 text-primary" />
                    </Link>
                  </DialogPrimitive.Close>
                </m.li>
              ))}
            </m.ul>

            <div className="mt-auto space-y-3 pt-8">
              <DialogPrimitive.Close asChild>
                <Link href={BOOKING_HREF} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
                  Agendar consulta
                </Link>
              </DialogPrimitive.Close>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={clinicWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "whatsapp" })}
                >
                  <WhatsAppIcon /> WhatsApp
                </a>
                <a href={`tel:+${primaryWhatsAppLine().number}`} className={buttonVariants({ variant: "outline" })}>
                  <Phone aria-hidden strokeWidth={1.75} /> Llamar
                </a>
              </div>
              <p className="pt-2 text-center text-sm text-muted">{primaryLocation().hours.label} · {locationNamesLabel()}</p>
            </div>
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
