import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { legal } from "@/data/legal";
import { formatLongDate } from "@/lib/format";
import { breadcrumbSchema } from "@/lib/schema";

export interface LegalSection {
  heading: string;
  /** Ancla estable para enlazar la sección (p. ej. #consentimiento-teleconsulta). */
  anchor?: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
}

interface LegalDocumentProps {
  id: string;
  title: string;
  crumbs: readonly BreadcrumbItem[];
  intro: string;
  sections: readonly LegalSection[];
  children?: ReactNode;
}

/** Documento legal legible: índice, secciones numeradas y fecha de actualización. */
export function LegalDocument({ id, title, crumbs, intro, sections, children }: LegalDocumentProps) {
  return (
    <article aria-labelledby={id} className="pb-24 pt-36 sm:pt-40">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div className="container-page max-w-3xl">
        <Breadcrumbs items={crumbs} />
        <h1 id={id} className="text-h2 mt-6 text-heading">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted">Última actualización: {formatLongDate(legal.lastUpdated)}</p>
        {legal.provisional ? (
          <p className="mt-4 rounded-2xl bg-coral-tint px-4 py-3 text-sm text-fg">
            Documento provisional: pendiente de revisión legal y de los datos definitivos de la empresa.
          </p>
        ) : null}
        <p className="mt-6 text-lg text-fg">{intro}</p>
        <nav aria-label="Contenido" className="mt-8 rounded-2xl border border-line bg-card-solid p-5">
          <p className="font-display font-semibold text-heading">Contenido</p>
          <ol className="mt-2 grid gap-1 sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.heading}>
                <a href={`#${section.anchor ?? `${id}-${index + 1}`}`} className="inline-flex min-h-12 items-center text-primary hover:underline">
                  {index + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-10 space-y-10 leading-relaxed text-fg">
          {sections.map((section, index) => (
            <section key={section.heading} id={section.anchor ?? `${id}-${index + 1}`} className="scroll-mt-28">
              <h2 className="text-h3">
                {index + 1}. {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" /> {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
        {children}
      </div>
    </article>
  );
}
