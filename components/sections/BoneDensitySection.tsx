import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { AudienceCards } from "@/components/densitometry/AudienceCards";
import { BoneDensityExplorerLazy, TScoreGaugeLazy } from "@/components/densitometry/DensitometryLazy";
import { BookDensitometryButton } from "@/components/densitometry/BookDensitometryButton";
import { DENSITOMETRY_PATH, densitometry } from "@/data/densitometry";

const HOME_AUDIENCE_LIMIT = 4;

/** Home: versión compacta de densitometría ósea (qué es, para quién, hueso 3D, escala y CTA). */
export function BoneDensitySection() {
  return (
    <section aria-labelledby="densitometria-title" className="section-y relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_20%,rgb(0_168_150/0.1),transparent_70%),radial-gradient(50%_45%_at_10%_90%,rgb(2_132_199/0.08),transparent_70%)]"
      />
      <div className="container-page">
        <SectionHeading
          id="densitometria-title"
          eyebrow="Nuevo · Densitometría ósea"
          title="¿Qué tan fuertes están tus huesos?"
          accent="fuertes"
          description={`${densitometry.whatIs} ${densitometry.technicalName}`}
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal>
            <BoneDensityExplorerLazy />
          </Reveal>
          <div className="space-y-6">
            <AudienceCards limit={HOME_AUDIENCE_LIMIT} className="md:grid-cols-1 xl:grid-cols-2" />
            <TScoreGaugeLazy compact />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <BookDensitometryButton />
          <Link
            href={DENSITOMETRY_PATH}
            className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Todo sobre la densitometría <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-muted">{densitometry.disclaimer}</p>
      </div>
    </section>
  );
}
