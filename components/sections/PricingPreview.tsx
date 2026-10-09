import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PAYMENT_PENDING, formatPrice, pricing } from "@/data/pricing";

const PREVIEW_INCLUDES = 3;

/** Vista previa de tarifas (3 tarjetas → /tarifas). Sin precio confirmado: «Precio por confirmar». */
export function PricingPreview() {
  return (
    <section aria-labelledby="tarifas-preview-title" className="section-y bg-bg-alt">
      <div className="container-page">
        <SectionHeading id="tarifas-preview-title" eyebrow="Tarifas" title="Qué incluye cada servicio" description={`${PAYMENT_PENDING}. Te confirmamos el monto al agendar.`} />
        <RevealGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
          {pricing.map((item) => (
            <RevealItem as="li" key={item.id} className="glass flex flex-col rounded-[1.75rem] p-6">
              <p className="text-sm font-semibold text-primary">{item.modality}</p>
              <h3 className="mt-2 text-h3">{item.name}</h3>
              <p className="mt-3 font-display text-xl font-extrabold text-heading">{formatPrice(item.price)}</p>
              <ul className="mt-4 space-y-2">
                {item.includes.slice(0, PREVIEW_INCLUDES).map((line) => (
                  <li key={line} className="flex items-start gap-2 text-[0.95rem] text-fg">
                    <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" /> {line}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-8 text-center">
          <Link href="/tarifas" className="inline-flex min-h-12 items-center gap-1 font-display font-semibold text-primary hover:underline">
            Ver todas las tarifas <ArrowRight aria-hidden className="size-5" />
          </Link>
        </p>
      </div>
    </section>
  );
}
