import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, MapPin, Video } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { buttonVariants } from "@/components/ui/button";
import { PAYMENT_METHODS, PAYMENT_PENDING, formatPrice, pricing } from "@/data/pricing";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PATH = "/tarifas";
const TITLE = `Tarifas de teleconsulta y densitometría | ${site.name}`;
const DESCRIPTION = "Tarifas de la teleconsulta reumatológica y de la densitometría ósea: qué incluye cada servicio y cómo pagar.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Tarifas", href: PATH },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
  title: { absolute: TITLE },
};

export default function TarifasPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="tarifas-title"
        crumbs={CRUMBS}
        eyebrow="Tarifas"
        title="Precios claros, sin sorpresas"
        accent="sin sorpresas"
        lead="Al agendar te confirmamos el monto, el momento del pago y los datos para pagar. Aquí ves qué incluye cada servicio."
      />

      <section aria-labelledby="tarifas-lista" className="section-y pt-0">
        <h2 id="tarifas-lista" className="sr-only">
          Servicios y precios
        </h2>
        <RevealGroup as="ul" className="container-page grid gap-6 md:grid-cols-3">
          {pricing.map((item) => (
            <RevealItem as="li" key={item.id}>
              <SpotlightCard className="flex h-full flex-col rounded-[1.75rem] p-7">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {item.service === "teleconsulta" ? <Video aria-hidden className="size-4" /> : <MapPin aria-hidden className="size-4" />}
                  {item.modality}
                </p>
                <h3 className="mt-3 text-h3">{item.name}</h3>
                <p className="mt-2 text-muted">{item.summary}</p>
                <p className="mt-6 font-display text-2xl font-extrabold text-heading">{formatPrice(item.price)}</p>
                <ul className="mt-6 space-y-2.5">
                  {item.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-[0.95rem] text-fg">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" /> {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <Link
                    href={`/consulta-virtual?servicio=${item.service}`}
                    className={buttonVariants({ variant: item.id === "teleconsulta" ? "primary" : "outline", className: "w-full" })}
                  >
                    {item.service === "teleconsulta" ? "Agendar teleconsulta" : "Agendar densitometría"} <ArrowRight aria-hidden />
                  </Link>
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="container-page mt-8">
          <p className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.95rem] text-heading">
            <CreditCard aria-hidden className="size-5 text-primary" />
            {PAYMENT_METHODS.length > 0 ? `Medios de pago: ${PAYMENT_METHODS.join(", ")}` : PAYMENT_PENDING}
          </p>
        </div>
      </section>

      <CtaBand
        title="¿Tienes dudas sobre el costo?"
        text="Escríbenos y te confirmamos el monto y los medios de pago antes de agendar."
        message={`Hola ${site.name}, quisiera saber el precio de la teleconsulta.`}
      />
    </>
  );
}
