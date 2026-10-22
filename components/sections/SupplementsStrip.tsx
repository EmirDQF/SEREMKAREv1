import Link from "next/link";
import { ArrowRight, Bone, HeartPulse, Info, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SUPPLEMENTS_DISCLAIMER, SUPPLEMENTS_PATH, supplementCategories, supplements } from "@/data/supplements";
import type { SupplementCategoryId } from "@/types/supplements";

const CATEGORY_ICONS: Readonly<Record<SupplementCategoryId, typeof Bone>> = {
  "salud-osea": Bone,
  articular: HeartPulse,
  bienestar: Sparkles,
};

/**
 * Franja de suplementos en la Home: categorías con diseño de catálogo (listo para cuando haya
 * productos reales) y el aviso legal a la vista. Sin productos hasta tener el catálogo confirmado.
 */
export function SupplementsStrip() {
  const hasCatalog = supplements.length > 0;
  return (
    <section aria-labelledby="suplementos-home-title" className="section-y relative isolate overflow-hidden bg-bg-alt">
      <div aria-hidden className="scan-grid -z-10 opacity-40" />
      <div className="container-page grid items-center gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <div>
          <p className="eyebrow">
            <span aria-hidden className="size-1.5 rounded-full bg-teal" />
            Suplementos
          </p>
          <h2 id="suplementos-home-title" className="text-h2 mt-4 text-heading">
            Pide tus suplementos en un mensaje
          </h2>
          <p className="mt-4 text-lg text-muted">
            Si tu médico te los indica, puedes pedirlos por WhatsApp.{" "}
            {hasCatalog ? "Revisa el catálogo con precios y registro sanitario." : "Catálogo en preparación."}
          </p>
          <Link href={SUPPLEMENTS_PATH} className={buttonVariants({ variant: "secondary", size: "lg", className: "mt-6" })}>
            Ver suplementos <ArrowRight aria-hidden strokeWidth={1.75} />
          </Link>
          <p className="mt-5 flex gap-2.5 rounded-2xl border border-line bg-card-solid p-4 text-base text-muted">
            <Info aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-heading" />
            <span>{SUPPLEMENTS_DISCLAIMER}</span>
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {supplementCategories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <li key={category.id}>
                <Link
                  href={SUPPLEMENTS_PATH}
                  className="gradient-border glass-panel flex h-full min-h-40 flex-col gap-3 rounded-[1.5rem] p-5 shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99]"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-teal-tint text-primary">
                      <Icon aria-hidden strokeWidth={1.75} className="size-6" />
                    </span>
                    <span aria-hidden className="data-mono text-base text-subtle">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="mt-auto font-display text-lg font-bold text-heading">{category.name}</span>
                  {hasCatalog ? null : <span className="tech-label text-subtle">En preparación</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
