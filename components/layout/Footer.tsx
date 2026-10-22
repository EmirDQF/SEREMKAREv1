import Link from "next/link";
import { Clock, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MotionToggle } from "@/components/layout/MotionToggle";
import { FooterWaves } from "@/components/layout/FooterWaves";
import { ComplaintsBookIcon, SocialIcon, WhatsAppIcon } from "@/components/shared/BrandIcons";
import { MedicalDisclaimer } from "@/components/shared/MedicalDisclaimer";
import { doctors } from "@/data/doctors";
import { LOCATIONS_PATH, footerOnlyLinks, legalLinks, mainNav } from "@/data/navigation";
import { CENTER_MISSION, CENTER_TAGLINE, OPENING_SCHEDULE, site } from "@/data/site";
import { specialties } from "@/data/specialties";
import { allWhatsAppLines, formatLocationAddress } from "@/lib/locations";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/*
 * Boletín: con correo real (visibility.email), volver a montar <NewsletterIsland />
 * (components/shared/OptionalIslands) bajo las redes. No se importa mientras esté oculto: el build con
 * webpack empaquetaba su JS (y todo data/site.ts) en todas las páginas aunque no se renderizara.
 */

const LINK = "inline-flex min-h-10 items-center text-slate-300 transition-colors hover:text-white";

interface FooterColumnProps {
  title: string;
  links: readonly { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="font-display text-base font-bold text-white">{title}</h2>
      <ul className="mt-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-navy pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-slate-300 md:pb-0 dark:bg-[#071222]">
      <FooterWaves />
      <div className="container-page grid gap-12 pt-16 lg:grid-cols-[1.2fr_2fr] lg:pt-20">
        <div>
          <Logo tone="inverted" showTagline />
          <p className="mt-5 max-w-sm font-display text-lg font-bold text-white">{CENTER_TAGLINE}</p>
          <p className="mt-2 max-w-sm">{CENTER_MISSION}</p>
          {site.socials.length > 0 ? (
            <ul className="mt-6 flex gap-2" aria-label="Redes sociales">
              {site.socials.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} en ${social.label}`}
                    className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-teal hover:text-teal"
                  >
                    <SocialIcon network={social.network} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          <FooterColumn
            title="Especialidades"
            links={specialties.map((s) => ({ label: s.shortName, href: `/especialidades/${s.slug}` }))}
          />
          <FooterColumn title="Navegación" links={[...mainNav, ...footerOnlyLinks]} />
          <FooterColumn
            title="Directorio médico"
            links={[
              ...doctors.map((d) => ({ label: d.name.split(" ").slice(0, 3).join(" "), href: `/staff/${d.slug}` })),
              { label: "Ver todo el staff", href: "/staff" },
            ]}
          />
          <div>
            <h2 className="font-display text-base font-bold text-white">Nuestras sedes</h2>
            <ul className="mt-3 space-y-4">
              {site.locations.map((location) => (
                <li key={location.id} className="flex gap-2.5">
                  <MapPin aria-hidden strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-teal" />
                  <span>
                    <Link href={`${LOCATIONS_PATH}/${location.id}`} className="font-semibold text-white hover:text-teal">
                      {location.name}
                    </Link>
                    <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-white">
                      {formatLocationAddress(location)}
                      {location.reference ? ` · ${location.reference}` : null}
                      <span className="sr-only"> (Google Maps, pestaña nueva)</span>
                    </a>
                  </span>
                </li>
              ))}
              <li className="flex gap-2.5">
                <Clock aria-hidden strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-teal" />
                <span>
                  <span className="block font-semibold text-white">Horario de atención</span>
                  {OPENING_SCHEDULE.map((row) => (
                    <span key={row.days} className="block">
                      {row.days}: {row.hours}
                    </span>
                  ))}
                  <span className="block text-sm text-slate-400">Con cita previa. Confirma el horario de tu sede por WhatsApp.</span>
                </span>
              </li>
            </ul>
            <h2 className="mt-8 font-display text-base font-bold text-white">WhatsApp</h2>
            <ul className="mt-3 space-y-1">
              {allWhatsAppLines().map((line) => (
                <li key={line.number}>
                  <a href={buildWhatsAppLink(line.number, site.defaultWhatsAppMessage)} target="_blank" rel="noopener noreferrer" className={LINK}>
                    <WhatsAppIcon className="mr-2.5 size-5 shrink-0 text-teal" />
                    {line.display}
                    <span className="sr-only"> (abre WhatsApp en otra pestaña)</span>
                  </a>
                </li>
              ))}
            </ul>
            {site.email ? (
              <ul className="mt-3">
                <li className="flex gap-2.5">
                  <Mail aria-hidden strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-teal" />
                  <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                    {site.email}
                  </a>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container-page mt-14 border-t border-white/10 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/libro-de-reclamaciones"
            className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/15 px-4 py-2.5 text-white transition-colors hover:border-teal"
          >
            <ComplaintsBookIcon className="h-7 w-9" />
            <span className="font-display font-semibold">Libro de Reclamaciones</span>
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
            <ul className="flex flex-wrap gap-x-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <MotionToggle />
          </div>
        </div>
        <MedicalDisclaimer tone="inverted" className="mt-6" />
        <p className="mt-6 text-sm text-slate-400">
          © {year} {site.name} — {CENTER_TAGLINE}. {site.legalTagline}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
