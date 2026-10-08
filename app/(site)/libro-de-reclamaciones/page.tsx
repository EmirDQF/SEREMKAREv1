import type { Metadata } from "next";
import { ComplaintForm } from "@/components/pages/ComplaintForm";
import { ComplaintsBookIcon } from "@/components/shared/BrandIcons";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { legal } from "@/data/legal";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Libro de Reclamaciones", href: "/libro-de-reclamaciones" },
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Libro de Reclamaciones",
  description: `Libro de Reclamaciones virtual de ${site.name}: registra un reclamo o una queja.`,
  path: "/libro-de-reclamaciones",
});

export default function ComplaintsBookPage() {
  return (
    <section aria-labelledby="reclamaciones-title" className="pb-24 pt-36 sm:pt-40">
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <div className="container-page max-w-4xl">
        <Breadcrumbs items={CRUMBS} />
        <div className="mt-6 flex items-center gap-4">
          <ComplaintsBookIcon className="h-12 w-16 text-heading" />
          <h1 id="reclamaciones-title" className="text-h2 text-heading">
            Libro de Reclamaciones
          </h1>
        </div>
        {legal.provisional ? (
          <p className="mt-4 rounded-2xl bg-coral-tint px-4 py-3 text-sm text-fg">
            Provisional: completar la razón social y el RUC definitivos, y conectar el formulario a un sistema que asigne
            el número correlativo y envíe la copia automáticamente.
          </p>
        ) : null}
        <dl className="mt-6 grid gap-3 rounded-[1.75rem] border border-line bg-card-solid p-6 text-fg sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Razón social</dt>
            <dd className="font-semibold text-heading">{legal.businessName}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">RUC</dt>
            <dd className="font-semibold text-heading">{legal.ruc}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted">Domicilio</dt>
            <dd className="font-semibold text-heading">{legal.fiscalAddress}</dd>
          </div>
        </dl>
        <p className="mt-6 text-fg">
          Conforme al Código de Protección y Defensa del Consumidor, puedes registrar aquí un <strong>reclamo</strong> o una{" "}
          <strong>queja</strong>. Te responderemos en un plazo máximo de {legal.responseDays} días hábiles. La formulación del
          reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para presentar una
          denuncia ante el INDECOPI.
        </p>
        <div className="mt-10">
          <ComplaintForm />
        </div>
      </div>
    </section>
  );
}
