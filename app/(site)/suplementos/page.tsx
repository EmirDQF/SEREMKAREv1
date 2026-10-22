import type { Metadata } from "next";
import { Bone, HeartPulse, PackageOpen, ShieldAlert, Sparkles } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { JsonLd } from "@/components/shared/JsonLd";
import { SupplementCard } from "@/components/shared/SupplementCard";
import { buttonVariants } from "@/components/ui/button";
import {
  SUPPLEMENTS_DELIVERY_NOTE,
  SUPPLEMENTS_DISCLAIMER,
  SUPPLEMENTS_PATH,
  supplementCategories,
  supplements,
} from "@/data/supplements";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { clinicWhatsApp, supplementOrderMessage } from "@/lib/whatsapp";
import type { SupplementCategoryId } from "@/types/supplements";

const TITLE = `Suplementos: salud ósea, articular y bienestar | ${site.name}`;
const DESCRIPTION =
  "Suplementos para el cuidado de huesos y articulaciones en nuestras sedes de Lima Norte y Callao. Pídelos por WhatsApp. No reemplazan el tratamiento indicado por tu médico.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Suplementos", href: SUPPLEMENTS_PATH },
] as const;

const CATEGORY_ICONS: Readonly<Record<SupplementCategoryId, typeof Bone>> = {
  "salud-osea": Bone,
  articular: HeartPulse,
  bienestar: Sparkles,
};

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: SUPPLEMENTS_PATH }),
  title: { absolute: TITLE },
};

/**
 * Suplementos. Sin productos confirmados muestra «Catálogo en preparación» (visibility.supplementsCatalog).
 * Sin pasarela de pago ni JSON-LD de producto: el pedido se coordina por WhatsApp.
 */
export default function SupplementsPage() {
  const hasCatalog = supplements.length > 0;
  const askHref = clinicWhatsApp(supplementOrderMessage());
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="suplementos-title"
        crumbs={CRUMBS}
        eyebrow="Suplementos"
        title="Suplementos para tus huesos y articulaciones"
        accent="huesos y articulaciones"
        lead="Si tu médico te indica un suplemento, puedes pedirlo con nosotros por WhatsApp, en un solo mensaje."
        actions={
          <a href={askHref} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
            <WhatsAppIcon /> Consultar por WhatsApp
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </a>
        }
      />

      <section aria-label="Aviso importante" className="pb-10">
        <div className="container-page">
          <p className="flex items-start gap-3 rounded-2xl border-2 border-line-strong bg-card-solid p-4 text-[1rem] font-semibold text-heading">
            <ShieldAlert aria-hidden strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-primary" />
            {SUPPLEMENTS_DISCLAIMER}
          </p>
        </div>
      </section>

      <section aria-labelledby="categorias-title" className="pb-16">
        <div className="container-page">
          <h2 id="categorias-title" className="text-h2 text-heading">
            Categorías
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {supplementCategories.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              return (
                <li key={category.id} className="flex gap-4 rounded-[1.75rem] border border-line bg-card-solid p-5 shadow-soft sm:block sm:p-6">
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-tint text-primary">
                    <Icon strokeWidth={1.75} className="size-6" />
                  </span>
                  <span className="block">
                    <h3 className="text-h3 text-heading sm:mt-4">{category.name}</h3>
                    <p className="mt-1 text-muted">{category.description}</p>
                  </span>
                </li>
              );
            })}
          </ul>

          {hasCatalog ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {supplements.map((product) => (
                <li key={product.id}>
                  <SupplementCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 flex flex-col items-start gap-4 rounded-[1.75rem] border-2 border-dashed border-line-strong bg-bg-alt p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex gap-4">
                <PackageOpen aria-hidden strokeWidth={1.5} className="size-10 shrink-0 text-primary" />
                <div>
                  <h2 className="text-h3 text-heading">Catálogo en preparación</h2>
                  <p className="mt-1 text-muted">Muy pronto verás aquí los productos, sus precios y su registro sanitario. Mientras tanto, pregúntanos por WhatsApp.</p>
                </div>
              </div>
              <a href={askHref} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", className: "shrink-0" })}>
                <WhatsAppIcon /> Consultar por WhatsApp
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            </div>
          )}
          <p className="mt-6 text-sm text-muted">
            {SUPPLEMENTS_DELIVERY_NOTE} Sin pagos en la web: no te pediremos datos de tarjeta.
          </p>
        </div>
      </section>
    </>
  );
}
