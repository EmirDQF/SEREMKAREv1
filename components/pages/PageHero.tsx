import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { KineticText } from "@/components/shared/KineticText";

interface PageHeroProps {
  id: string;
  crumbs: readonly BreadcrumbItem[];
  eyebrow: string;
  title: string;
  /** Frase del título resaltada con el gradiente teal. */
  accent?: string;
  lead: ReactNode;
  /** Botones o enlaces bajo el texto. */
  actions?: ReactNode;
  /** Visual a la derecha (3D, ilustración). */
  visual?: ReactNode;
}

/** Cabecera común de las páginas internas: fondo aurora + cuadrícula, migas, eyebrow, h1, entrada y visual opcional. */
export function PageHero({ id, crumbs, eyebrow, title, accent, lead, actions, visual }: PageHeroProps) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden pb-14 pt-36 sm:pt-40 lg:pb-20">
      <div aria-hidden className="aurora -z-10" />
      <div aria-hidden className="scan-grid -z-10" />
      <div className={visual ? "container-page grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]" : "container-page"}>
        <div className="min-w-0 max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow mt-6">
            <span aria-hidden className="size-1.5 rounded-full bg-teal" /> {eyebrow}
          </p>
          <h1 id={id} className="text-display mt-4 hyphens-auto text-heading [overflow-wrap:anywhere]">
            <KineticText text={title} accent={accent} priority />
          </h1>
          <div className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">{lead}</div>
          {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
        </div>
        {visual}
      </div>
    </section>
  );
}
