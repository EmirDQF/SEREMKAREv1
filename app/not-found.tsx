import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JointMotif } from "@/components/shared/JointMotif";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { TRIAGE_HREF } from "@/data/navigation";
import { clinicWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="relative isolate overflow-hidden pb-24 pt-40 sm:pt-48">
      <div aria-hidden className="mesh-bg -z-10" />
      <div className="container-page max-w-2xl text-center">
        <JointMotif mode="loop" className="mx-auto h-36 w-auto" />
        <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">Error 404</p>
        <h1 className="text-h2 mt-3">Esta página se nos lesionó</h1>
        <p className="mt-4 text-lg text-muted">
          No encontramos lo que buscabas. Puede que el enlace haya cambiado o que la página esté en preparación.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Volver al inicio
          </Link>
          <Link href={TRIAGE_HREF} className={buttonVariants({ variant: "outline", size: "lg" })}>
            ¿Dónde te duele?
          </Link>
        </div>
        <a
          href={clinicWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-primary hover:underline"
        >
          <WhatsAppIcon className="size-5" /> O escríbenos por WhatsApp
        </a>
      </div>
    </section>
    </SiteChrome>
  );
}
