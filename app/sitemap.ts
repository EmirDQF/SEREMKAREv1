import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { doctors } from "@/data/doctors";
import { blogPosts } from "@/data/home";
import { servicePillars } from "@/data/services";
import { specialties } from "@/data/specialties";
import { testimonials } from "@/data/testimonials";
import { treatments } from "@/data/treatments";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

interface Route {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}

const MONTHLY = "monthly" as const;
const YEARLY = "yearly" as const;

/** Todas las rutas publicadas (las dinámicas se generan desde data/*). */
const ROUTES: readonly Route[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/teleconsulta", priority: 0.95, changeFrequency: MONTHLY },
  { path: "/tarifas", priority: 0.8, changeFrequency: MONTHLY },
  { path: "/densitometria-osea", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios", priority: 0.8, changeFrequency: "monthly" },
  { path: "/suplementos", priority: 0.7, changeFrequency: MONTHLY },
  { path: "/seguimiento", priority: 0.6, changeFrequency: MONTHLY },
  ...servicePillars.map((pillar) => ({ path: `/servicios/${pillar.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  ...(treatments.length > 0 ? [{ path: "/tratamientos", priority: 0.8, changeFrequency: MONTHLY }] : []),
  ...treatments.map((treatment) => ({ path: `/tratamientos/${treatment.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  { path: "/especialidades", priority: 0.8, changeFrequency: MONTHLY },
  ...specialties.map((specialty) => ({ path: `/especialidades/${specialty.slug}`, priority: 0.8, changeFrequency: MONTHLY })),
  { path: "/staff", priority: 0.7, changeFrequency: MONTHLY },
  ...doctors.map((doctor) => ({ path: `/staff/${doctor.slug}`, priority: 0.6, changeFrequency: MONTHLY })),
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  ...blogPosts.map((post) => ({ path: `/blog/${post.slug}`, priority: 0.6, changeFrequency: MONTHLY })),
  ...(testimonials.length > 0 ? [{ path: "/testimonios", priority: 0.6, changeFrequency: MONTHLY }] : []),
  { path: "/preguntas-frecuentes", priority: 0.6, changeFrequency: MONTHLY },
  { path: "/sedes", priority: 0.8, changeFrequency: MONTHLY },
  ...site.locations.map((location) => ({ path: `/sedes/${location.id}`, priority: 0.8, changeFrequency: MONTHLY })),
  { path: "/contacto", priority: 0.7, changeFrequency: YEARLY },
  { path: "/libro-de-reclamaciones", priority: 0.3, changeFrequency: YEARLY },
  { path: "/politica-de-privacidad", priority: 0.2, changeFrequency: YEARLY },
  { path: "/terminos", priority: 0.2, changeFrequency: YEARLY },
  { path: "/links-de-interes", priority: 0.3, changeFrequency: YEARLY },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
