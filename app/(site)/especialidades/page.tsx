import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { MicroIcon } from "@/components/3d/MicroIcon";
import { IconBadge } from "@/components/shared/Icon";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { TRIAGE_HREF } from "@/data/navigation";
import { site } from "@/data/site";
import { specialties } from "@/data/specialties";
import { isMicroVariant } from "@/lib/micro-variants";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TITLE = `Especialidades: artrosis, artritis, gota, lupus y más | ${site.name}`;
const DESCRIPTION =
  "Conoce las enfermedades reumáticas que tratamos en Lima Norte y Callao: artrosis, artritis reumatoide, gota, lupus, fibromialgia, osteoporosis y espondiloartritis.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Especialidades", href: "/especialidades" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/especialidades" }),
  title: { absolute: TITLE },
};

export default function SpecialtiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="especialidades-title"
        crumbs={CRUMBS}
        eyebrow="Especialidades"
        title="Condiciones que tratamos"
        accent="tratamos"
        lead="Te explicamos cada enfermedad con palabras simples: qué es, cómo reconocerla y cómo la tratamos."
        actions={
          <Link href={TRIAGE_HREF} className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline">
            ¿No sabes qué tienes? Usa el orientador “¿Dónde te duele?” <ArrowRight aria-hidden className="size-5" />
          </Link>
        }
      />
      <section aria-label="Lista de especialidades" className="pb-16">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <RevealItem as="li" key={specialty.slug}>
                <SpotlightCard className="h-full">
                  <Link href={`/especialidades/${specialty.slug}`} className="flex h-full flex-col p-6">
                    {isMicroVariant(specialty.slug) ? (
                      <MicroIcon variant={specialty.slug} fallback={<IconBadge name="stethoscope" />} className="-m-3 size-20" />
                    ) : (
                      <IconBadge name="stethoscope" />
                    )}
                    <h2 className="text-h3 mt-4">{specialty.name}</h2>
                    <p className="mt-2 text-muted">{specialty.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 font-display font-semibold text-primary">
                      Conocer más <ArrowRight aria-hidden className="size-5" />
                    </span>
                  </Link>
                </SpotlightCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <CtaBand
        title="Un diagnóstico a tiempo cambia la evolución"
        text="Si tienes dolor, rigidez o hinchazón que no ceden, agenda una evaluación con un reumatólogo."
        message={`Hola ${site.name}, quisiera agendar una evaluación con un reumatólogo.`}
      />
    </>
  );
}
