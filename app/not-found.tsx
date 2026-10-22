import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { CalendarCheck } from "lucide-react";
import { Reticle } from "@/components/shared/Reticle";
import { JointMotif } from "@/components/shared/JointMotif";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { APPOINTMENT_HREF, DENSITOMETRY_BOOKING_HREF } from "@/data/navigation";
import { clinicWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

/** 404 con la misma estética (aurora, retícula) y los mismos CTA: «Agendar cita» primero. */
export default function NotFound() {
  return (
    <SiteChrome>
    <section className="relative isolate overflow-hidden pb-24 pt-40 sm:pt-48">
      <div aria-hidden className="aurora -z-10" />
      <div aria-hidden className="scan-grid -z-10" />
      <Reticle className="pointer-events-none absolute left-1/2 top-24 -z-10 size-80 -translate-x-1/2 text-teal/20" />
      <div className="container-page max-w-2xl text-center">
        <JointMotif mode="loop" className="mx-auto h-36 w-auto" />
        <p className="eyebrow mt-6">
          <span aria-hidden className="size-1.5 rounded-full bg-teal" />
          Error 404
        </p>
        <h1 className="text-h2 mt-3">Esta página se nos lesionó</h1>
        <p className="mt-4 text-lg text-muted">
          No encontramos lo que buscabas. Puede que el enlace haya cambiado o que la página esté en preparación.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={APPOINTMENT_HREF} className={buttonVariants({ variant: "primary", size: "lg" })}>
            <CalendarCheck aria-hidden strokeWidth={1.75} /> Agendar cita
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Volver al inicio
          </Link>
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6" aria-label="Accesos rápidos">
          <li>
            <Link href="/servicios" className="inline-flex min-h-12 items-center font-semibold text-primary hover:underline">Servicios</Link>
          </li>
          <li>
            <Link href={DENSITOMETRY_BOOKING_HREF} className="inline-flex min-h-12 items-center font-semibold text-primary hover:underline">Reservar densitometría</Link>
          </li>
          <li>
            <Link href="/sedes" className="inline-flex min-h-12 items-center font-semibold text-primary hover:underline">Sedes y horario</Link>
          </li>
        </ul>
        <a
          href={clinicWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-primary hover:underline"
        >
          <WhatsAppIcon className="size-5" /> O escríbenos por WhatsApp
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      </div>
    </section>
    </SiteChrome>
  );
}
