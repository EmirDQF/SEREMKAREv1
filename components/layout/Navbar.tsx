import Link from "next/link";
import { CalendarCheck, ChevronDown, Pill, ScanLine } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { APPOINTMENT_HREF, moreLinks, primaryLinks, type NavLink } from "@/data/navigation";
import { site } from "@/data/site";
import { locationNamesLabel, primaryLocation } from "@/lib/locations";
import { cn } from "@/lib/utils";
import { doctorContact } from "@/lib/whatsapp";

/** Clases del menú móvil, resueltas aquí para no enviar tailwind-merge al navegador. */
const MOBILE_MENU_BUTTONS = {
  booking: cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full"),
  whatsapp: buttonVariants({ variant: "whatsapp" }),
  call: buttonVariants({ variant: "outline" }),
};

/** Icono clínico sutil de Densitometría (servicio estrella), sin insignias de texto. */
function NavIcon({ link }: { link: NavLink }) {
  if (link.icon === "scan") return <ScanLine aria-hidden strokeWidth={1.75} className="size-4 text-primary" />;
  if (link.icon === "pill") return <Pill aria-hidden strokeWidth={1.75} className="size-4 text-primary" />;
  return null;
}

const NAV_ITEM =
  "inline-flex min-h-12 items-center gap-1 rounded-full px-3.5 font-display text-base font-semibold text-heading transition-colors hover:bg-teal-tint";

/**
 * Barra principal. Componente de servidor: el «Más» es un <details> nativo (sin Radix) y el estilo
 * compacto al hacer scroll sale de `data-scrolled` del <header> (group/header).
 */
export function Navbar() {
  return (
    <div className="container-page pt-3 transition-[padding] duration-300 group-data-[scrolled=true]/header:pt-2">
      <nav
        aria-label="Principal"
        className={cn(
          "flex min-h-[4.5rem] items-center justify-between gap-3 rounded-full border border-transparent bg-transparent px-3 transition-[background-color,box-shadow,border-color,min-height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4",
          "group-data-[scrolled=true]/header:glass group-data-[scrolled=true]/header:gradient-border group-data-[scrolled=true]/header:min-h-16 group-data-[scrolled=true]/header:shadow-soft",
        )}
      >
        <Link href="/" aria-label={`${site.name}, ir al inicio`} className="flex min-h-12 shrink-0 items-center gap-2 rounded-full">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={NAV_ITEM}>
                <NavIcon link={link} />
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <details data-dropdown className="group/more relative">
              <summary className={cn(NAV_ITEM, "cursor-pointer list-none group-open/more:bg-teal-tint [&::-webkit-details-marker]:hidden")}>
                Más
                <ChevronDown aria-hidden strokeWidth={1.75} className="size-4 transition-transform duration-200 group-open/more:rotate-180" />
              </summary>
              <ul className="glass absolute right-0 top-full mt-2 grid w-72 rounded-3xl p-2 shadow-lift">
                {moreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex min-h-12 items-center gap-2 rounded-2xl px-4 font-medium text-heading hover:bg-teal-tint",
                        link.highlight && "bg-teal-tint font-semibold",
                      )}
                    >
                      <NavIcon link={link} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href={APPOINTMENT_HREF}
            // En móvil (< 640 px) la acción vive en la barra fija inferior (siempre visible, al alcance del pulgar).
            className={cn(buttonVariants({ variant: "primary" }), "hidden sm:inline-flex")}
          >
            <CalendarCheck aria-hidden strokeWidth={1.75} />
            Agendar cita
          </Link>
          <MobileMenu
            logo={<Logo />}
            contact={doctorContact()}
            footnote={`${primaryLocation().hours.label} · ${locationNamesLabel()}`}
            buttonClasses={MOBILE_MENU_BUTTONS}
          />
        </div>
      </nav>
    </div>
  );
}
