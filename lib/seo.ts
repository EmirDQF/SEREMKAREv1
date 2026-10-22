import type { Metadata } from "next";
import { LOCATIONS_PATH } from "@/data/navigation";
import { CENTER_TAGLINE, site } from "@/data/site";
import type { ClinicLocation } from "@/types/medical";

interface PageSeo {
  title: string;
  description: string;
  path?: string;
}

/**
 * Imagen para compartir (app/opengraph-image.tsx, con la foto del Dr. Ccolcca). Se declara en cada
 * página porque un `openGraph` propio reemplaza al heredado y la imagen se perdía.
 */
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name}, ${CENTER_TAGLINE}: Dr. Daniel Ccolcca, médico reumatólogo`,
} as const;

/** Metadata consistente por página (canonical, Open Graph y Twitter). */
export function buildMetadata({ title, description, path = "/" }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: "es_PE",
      type: "website",
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE.url] },
  };
}

/** «Densitometría ósea en el Callao»: como lo busca el paciente en Google. */
export function locationPageTitle(location: ClinicLocation): string {
  return `Densitometría ósea en ${location.placeName ?? location.name}`;
}

/** Metadata propia de cada sede: título, descripción, canonical y Open Graph únicos. */
export function locationMetadata(location: ClinicLocation): Metadata {
  const title = `${locationPageTitle(location)} | ${site.name}`;
  return {
    ...buildMetadata({ title, description: location.intro, path: `${LOCATIONS_PATH}/${location.id}` }),
    title: { absolute: title },
  };
}

export const DEFAULT_DESCRIPTION =
  "Centro especializado en reumatología en Lima Norte y Callao: densitometría ósea y diagnóstico, tratamiento, procedimientos guiados por ecografía y seguimiento continuo. Teleconsulta como servicio extra.";
