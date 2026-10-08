import type { Metadata } from "next";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { BlogCard } from "@/components/shared/BlogCard";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { blogPosts } from "@/data/home";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TITLE = `Blog de salud articular | ${site.name}`;
const DESCRIPTION =
  "Artículos de nuestros reumatólogos, en lenguaje claro: dolor de espalda y cuello, artrosis, gota, osteoporosis, lesiones deportivas e infiltraciones.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/blog" }),
  title: { absolute: TITLE },
};

export default function BlogPage() {
  const posts = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="blog-title"
        crumbs={CRUMBS}
        eyebrow="Blog de salud articular"
        title="Aprende a cuidar tus articulaciones"
        accent="cuidar"
        lead="Artículos escritos por nuestros especialistas, en lenguaje claro y sin alarmismo."
      />
      <section aria-label="Artículos" className="pb-16">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <RevealItem as="li" key={post.slug}>
                <BlogCard post={post} headingLevel="h2" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <CtaBand
        title="¿Te identificas con algún artículo?"
        text="Leer ayuda, pero nada reemplaza una evaluación. Agenda con un especialista."
        message={`Hola ${site.name}, leí su blog y quisiera agendar una consulta.`}
      />
    </>
  );
}
