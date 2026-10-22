import Link from "next/link";
import { ArrowRight, Clock, FileCheck2, MapPin, ScanLine, Shirt, Wallet } from "lucide-react";
import { AudienceCards } from "@/components/densitometry/AudienceCards";
import { TScoreScale } from "@/components/densitometry/TScoreScale";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { DENSITOMETRY_PATH, densitometry } from "@/data/densitometry";
import { DENSITOMETRY_BOOKING_HREF } from "@/data/navigation";
import { formatPrice, getPricing } from "@/data/pricing";
import { locationNamesLabel } from "@/lib/locations";

const HOME_AUDIENCE_LIMIT = 4;

/**
 * Home: densitometría ósea, el servicio estrella. Un panel oscuro de «sala de imagen» con la escala
 * T-score en SVG, y al lado lo práctico: preparación, duración, qué recibes, dónde y precio (o «Por
 * confirmar»). Componente de servidor (el hueso 3D y la escala interactiva viven en /densitometria-osea).
 */
export function BoneDensitySection() {
  const price = formatPrice(getPricing("densitometria").price);
  const facts = [
    { icon: Shirt, title: "Preparación", text: "Ropa cómoda sin metales. Sin suplementos de calcio 24 horas antes." },
    { icon: Clock, title: "Duración", text: "De 10 a 20 minutos. No duele y no hay agujas." },
    { icon: FileCheck2, title: "Qué recibes", text: "Tu resultado el mismo día o en 24 horas. No necesitas orden médica." },
    { icon: MapPin, title: "Dónde", text: `Con cita previa en ${locationNamesLabel()}.` },
    { icon: Wallet, title: "Precio", text: price },
  ] as const;

  return (
    <section aria-labelledby="densitometria-title" className="section-y relative isolate overflow-hidden">
      <div aria-hidden className="scan-lines -z-10 opacity-60" />
      <div className="container-page">
        <SectionHeading
          id="densitometria-title"
          align="left"
          eyebrow="Densitometría ósea · Servicio estrella"
          title="¿Qué tan fuertes están tus huesos?"
          accent="fuertes"
          description={`${densitometry.whatIs} Sirve para detectar la osteoporosis (huesos frágiles) antes de una fractura. ${densitometry.technicalName}`}
        />

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Panel «sala de imagen»: escala T-score y CTA */}
          <div className="scan-panel relative flex flex-col overflow-hidden rounded-[2rem] p-6 sm:p-8">
            <div aria-hidden className="immersive-grid" />
            <div aria-hidden className="aurora opacity-50" />
            <div className="relative">
              <p className="tech-label flex items-center gap-2 text-teal-300">
                <ScanLine aria-hidden strokeWidth={1.75} className="size-5" />
                Lectura del resultado · T-score
              </p>
              <p className="mt-3 max-w-md text-lg text-on-navy-muted">
                El estudio compara la densidad de tus huesos con la de un adulto joven sano. Tu especialista te lo explica.
              </p>
              <TScoreScale className="mt-6 text-on-navy-muted" />
            </div>
            <div className="relative mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href={DENSITOMETRY_BOOKING_HREF} className={buttonVariants({ variant: "primary", size: "lg" })}>
                <ScanLine aria-hidden strokeWidth={1.75} />
                Agendar densitometría
              </Link>
              <Link
                href={DENSITOMETRY_PATH}
                className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-teal-200 hover:text-white"
              >
                Todo sobre el estudio <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
              </Link>
            </div>
          </div>

          {/* Lo práctico */}
          <dl className="glass-panel gradient-border grid content-start gap-3 rounded-[2rem] p-6 shadow-soft sm:p-7">
            {facts.map(({ icon: Icon, title, text }) => (
              <div key={title} className="grid grid-cols-[2.75rem_1fr] gap-x-3 border-b border-line pb-3 last:border-b-0 last:pb-0">
                <span aria-hidden className="row-span-2 grid size-11 place-items-center rounded-xl bg-teal-tint text-primary">
                  <Icon strokeWidth={1.75} className="size-6" />
                </span>
                <dt className="font-display font-bold text-heading">{title}</dt>
                <dd className="text-base text-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12">
          <h3 className="text-h3 text-heading">¿Quién debería hacérsela?</h3>
          <AudienceCards limit={HOME_AUDIENCE_LIMIT} className="mt-4" />
          <p className="mt-6 text-base text-muted">{densitometry.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
