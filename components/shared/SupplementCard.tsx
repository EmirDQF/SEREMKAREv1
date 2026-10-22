import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/data/pricing";
import { SUPPLEMENT_STATUS_LABEL, supplementCategories } from "@/data/supplements";
import { clinicWhatsApp, supplementOrderMessage } from "@/lib/whatsapp";
import type { Supplement } from "@/types/supplements";

/** Tarjeta de producto: nombre, categoría, presentación, precio, registro sanitario, estado y pedido en 1 clic. */
export function SupplementCard({ product }: { product: Supplement }) {
  const category = supplementCategories.find((item) => item.id === product.category);
  const soldOut = product.status === "agotado";
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
      <p className="eyebrow">{category?.name}</p>
      <h3 className="text-h3 mt-2 text-heading">{product.name}</h3>
      <dl className="mt-4 grid gap-2 text-base">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Presentación</dt>
          <dd className="text-right font-semibold text-heading">{product.presentation}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Precio</dt>
          <dd className="text-right font-semibold text-heading">{formatPrice(product.price)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Registro sanitario</dt>
          <dd className="text-right font-semibold text-heading">{product.sanitaryRegistry}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Estado</dt>
          <dd className="text-right font-semibold text-heading">{SUPPLEMENT_STATUS_LABEL[product.status]}</dd>
        </div>
      </dl>
      <div className="mt-auto pt-6">
        {soldOut ? (
          <p className="text-sm font-semibold text-muted">Escríbenos para avisarte cuando vuelva.</p>
        ) : (
          <a
            href={clinicWhatsApp(supplementOrderMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "whatsapp", className: "w-full" })}
          >
            <WhatsAppIcon /> Pedir por WhatsApp
            <span className="sr-only"> {product.name} (se abre en otra pestaña)</span>
          </a>
        )}
      </div>
    </article>
  );
}
