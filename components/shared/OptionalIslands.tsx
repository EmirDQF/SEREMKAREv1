import type { ReactNode } from "react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { OpenStatusLine } from "@/components/layout/OpenStatusLine";
import { InsuranceMarquee } from "@/components/sections/InsuranceMarquee";

/**
 * Envoltorios de SERVIDOR para islas cliente que solo se muestran con datos confirmados (correo real,
 * horario confirmado, convenios firmados). Sus padres los cargan con next/dynamic: así, mientras estén
 * ocultas, su JS no entra al bundle de la página (Next agrupa todo componente cliente importado
 * estáticamente, se renderice o no; ver node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md).
 */

export function NewsletterIsland() {
  return <NewsletterForm />;
}

export function OpenStatusIsland({ fallback }: { fallback: ReactNode }) {
  return <OpenStatusLine fallback={fallback} />;
}

export function InsurersIsland() {
  return <InsuranceMarquee />;
}
