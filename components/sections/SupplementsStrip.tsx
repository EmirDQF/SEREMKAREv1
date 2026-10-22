import Link from "next/link";
import { ArrowRight, Bone, HeartPulse, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SUPPLEMENTS_DISCLAIMER, SUPPLEMENTS_PATH, supplementCategories, supplements } from "@/data/supplements";
import type { SupplementCategoryId } from "@/types/supplements";

const CATEGORY_ICONS: Readonly<Record<SupplementCategoryId, typeof Bone>> = {
  "salud-osea": Bone,
  articular: HeartPulse,
  bienestar: Sparkles,
};

/** Franja de suplementos en la Home: solo categorías (sin productos hasta tener el catálogo real). */
export function SupplementsStrip() {
  return (
    <section aria-labelledby="suplementos-home-title" className="section-y bg-bg-alt">
      <div className="container-page grid items-center gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <div>
          <p className="eyebrow">Suplementos</p>
          <h2 id="suplementos-home-title" className="text-h2 mt-4 text-heading">
            Pide tus suplementos en un mensaje
          </h2>
          <p className="mt-4 text-lg text-muted">
            Si tu médico te los indica, puedes pedirlos por WhatsApp.{" "}
            {supplements.length > 0 ? "Revisa el catálogo con precios y registro sanitario." : "Catálogo en preparación."}
          </p>
          <Link href={SUPPLEMENTS_PATH} className={buttonVariants({ variant: "secondary", size: "lg", className: "mt-6" })}>
            Ver suplementos <ArrowRight aria-hidden strokeWidth={1.75} />
          </Link>
          <p className="mt-4 text-sm text-muted">{SUPPLEMENTS_DISCLAIMER}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {supplementCategories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <li key={category.id}>
                <Link
                  href={SUPPLEMENTS_PATH}
                  className="flex h-full min-h-28 flex-col gap-3 rounded-[1.5rem] border border-line bg-card-solid p-5 shadow-soft transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary active:scale-[0.99]"
                >
                  <Icon aria-hidden strokeWidth={1.75} className="size-7 text-primary" />
                  <span className="font-display text-lg font-bold text-heading">{category.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
