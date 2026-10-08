import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Lightbulb } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { BlogCard } from "@/components/shared/BlogCard";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { KineticText } from "@/components/shared/KineticText";
import { getBlogArticle } from "@/data/blog-articles";
import { blogPosts } from "@/data/home";
import { blogAuthor, findBlogPost } from "@/lib/catalog";
import { formatLongDate } from "@/lib/format";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { messageAbout } from "@/lib/whatsapp";

const RELATED_COUNT = 3;

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) return {};
  const metadata = buildMetadata({ title: post.title, description: post.excerpt, path: `/blog/${slug}` });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: post.publishedAt } };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) notFound();
  const article = getBlogArticle(slug);
  const author = blogAuthor(post);
  const path = `/blog/${slug}`;
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.category, href: path },
  ];
  const related = blogPosts.filter((item) => item.slug !== slug).slice(0, RELATED_COUNT);

  return (
    <>
      <JsonLd
        data={blogPostingSchema({
          title: post.title,
          description: post.excerpt,
          path,
          image: post.cover,
          datePublished: post.publishedAt,
          author: author.path ? { name: author.name, path: author.path } : null,
        })}
      />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <article aria-labelledby="articulo-title" className="pb-16 pt-36 sm:pt-40">
        <header className="container-page max-w-4xl">
          <Breadcrumbs items={crumbs} />
          <p className="mt-6 inline-flex rounded-full bg-teal-tint px-3.5 py-1.5 text-sm font-semibold text-primary">{post.category}</p>
          <h1 id="articulo-title" className="text-h2 mt-4 text-heading sm:text-[clamp(2.2rem,4vw,3.4rem)]">
            <KineticText text={post.title} priority />
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            <span>
              Por{" "}
              {author.path ? (
                <Link href={author.path} className="font-semibold text-heading hover:text-primary">
                  {author.name}
                </Link>
              ) : (
                <span className="font-semibold text-heading">{author.name}</span>
              )}
            </span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatLongDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden strokeWidth={1.75} className="size-4" /> {post.readingMinutes} min de lectura
            </span>
          </p>
        </header>

        <div className="container-page mt-10 max-w-5xl">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] shadow-lift">
            <Image src={post.cover} alt={post.coverAlt} fill preload sizes="(min-width: 1024px) 1024px, 92vw" className="object-cover" />
          </div>
        </div>

        <div className="container-page mt-12 max-w-3xl text-[1.1rem] leading-relaxed text-fg">
          <p className="text-xl text-heading">{article.intro}</p>
          {article.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-h3">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-teal" /> {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <aside className="mt-12 flex gap-4 rounded-[1.75rem] bg-teal-tint p-6">
            <Lightbulb aria-hidden strokeWidth={1.75} className="size-7 shrink-0 text-primary" />
            <p className="font-display font-semibold text-heading">{article.takeaway}</p>
          </aside>
        </div>
      </article>

      <section aria-labelledby="relacionados-blog" className="pb-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <h2 id="relacionados-blog" className="text-h3">
              Sigue leyendo
            </h2>
            <Link href="/blog" className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline">
              Ver todos <ArrowRight aria-hidden className="size-5" />
            </Link>
          </div>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <BlogCard post={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="¿Te identificas con lo que leíste?"
        text="Agenda una evaluación: tu especialista revisa tu caso y te propone un plan claro."
        message={messageAbout(post.category.toLowerCase())}
      />
    </>
  );
}
