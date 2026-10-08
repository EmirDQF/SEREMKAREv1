import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { usefulLinks } from "@/data/legal";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Links de interés", href: "/links-de-interes" },
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Links de interés",
  description: "Organismos y fuentes confiables: verifica a tu médico, conoce tus derechos en salud e infórmate sobre enfermedades reumáticas.",
  path: "/links-de-interes",
});

export default function UsefulLinksPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="links-title"
        crumbs={CRUMBS}
        eyebrow="Recursos"
        title="Links de interés"
        lead={`Fuentes confiables que recomendamos en ${site.name}. Se abren en una pestaña nueva.`}
      />
      <div className="container-page max-w-4xl space-y-10 pb-24">
        {usefulLinks.map((group) => (
          <section key={group.group} aria-labelledby={`grupo-${group.group}`}>
            <h2 id={`grupo-${group.group}`} className="text-h3">
              {group.group}
            </h2>
            <ul className="mt-4 grid gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-4 rounded-2xl border border-line bg-card-solid p-5 transition-colors hover:border-primary"
                  >
                    <span>
                      <span className="block font-display font-semibold text-heading group-hover:text-primary">{link.label}</span>
                      <span className="mt-1 block text-muted">{link.description}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-5 shrink-0 text-primary" />
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
