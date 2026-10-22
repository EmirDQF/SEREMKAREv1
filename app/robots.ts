import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Todo el sitio es indexable salvo las rutas técnicas: la API, la confirmación de una cita (datos de
 * un paciente concreto) y el consultorio virtual (herramienta con noindex propio).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/cita-confirmada/"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
