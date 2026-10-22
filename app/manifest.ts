import type { MetadataRoute } from "next";
import { CENTER_TAGLINE, site } from "@/data/site";

/** Manifiesto web (añadir a la pantalla de inicio): colores de la paleta 2026. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${CENTER_TAGLINE}`,
    short_name: site.name,
    description: "Reumatología, densitometría ósea y seguimiento en Lima Norte y Callao.",
    lang: "es-PE",
    start_url: "/",
    display: "browser",
    background_color: "#f7fafe",
    theme_color: "#0f1d3a",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
