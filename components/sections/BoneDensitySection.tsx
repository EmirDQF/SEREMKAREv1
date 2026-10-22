import Link from "next/link";
import { ArrowRight, Clock, FileCheck2, MapPin, ScanLine, Shirt, Wallet } from "lucide-react";
import { AudienceCards } from "@/components/densitometry/AudienceCards";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { DENSITOMETRY_PATH, densitometry } from "@/data/densitometry";
import { DENSITOMETRY_BOOKING_HREF } from "@/data/navigation";
import { formatPrice, getPricing } from "@/data/pricing";
import { locationNamesLabel } from "@/lib/locations";

const HOME_AUDIENCE_LIMIT = 4;

/**
 * Home: densitometría ósea, el servicio estrella. Responde en un pantallazo qué es, para quién,
 * cómo prepararse, cuánto dura, qué recibes, dónde y cuánto cuesta. Componente de servidor (el hueso
 * 3D y la escala interactiva viven en /densitometria-osea).
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
    <section aria-labelledby="densitometria-title" className="section-y relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_20%,rgb(0_168_150/0.1),transparent_70%),radial-gradient(50%_45%_at_10%_90%,rgb(2_132_199/0.08),transparent_70%)]"
      />
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="densitometria-title"
            align="left"
            eyebrow="Densitometría ósea · Diagnóstico"
            title="¿Qué tan fuertes están tus huesos?"
            accent="fuertes"
            description={`${densitometry.whatIs} Sirve para detectar la osteoporosis (huesos frágiles) antes de una fractura. ${densitometry.technicalName}`}
          />
          <Link href={DENSITOMETRY_BOOKING_HREF} className={buttonVariants({ variant: "primary", size: "lg", className: "shrink-0" })}>
            <ScanLine aria-hidden strokeWidth={1.75} />
            Agendar densitometría
          </Link>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <h3 className="text-h3 text-heading">¿Quién debería hacérsela?</h3>
            <AudienceCards limit={HOME_AUDIENCE_LIMIT} className="mt-4" />
          </div>
          <dl className="grid gap-3 rounded-[1.75rem] border border-line bg-card-solid p-5 shadow-soft sm:p-6">
            {facts.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0">
                <Icon aria-hidden strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-primary" />
                <div>
                  <dt className="font-display font-bold text-heading">{title}</dt>
                  <dd className="text-[0.975rem] text-muted">{text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={DENSITOMETRY_PATH}
            className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Todo sobre la densitometría y tu resultado (T-score) <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
          <p className="text-sm text-muted">{densitometry.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
