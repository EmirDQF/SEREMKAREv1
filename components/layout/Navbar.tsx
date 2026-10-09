"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { NavigationMenu } from "radix-ui";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { BOOKING_HREF, moreLinks, primaryLinks } from "@/data/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const NAV_ITEM =
  "inline-flex min-h-12 items-center gap-1 rounded-full px-3.5 font-display text-[0.95rem] font-semibold text-heading transition-colors hover:bg-teal-tint data-[state=open]:bg-teal-tint";

interface NavbarProps {
  /** Al hacer scroll: cápsula flotante más compacta, con blur. */
  compact: boolean;
}

export function Navbar({ compact }: NavbarProps) {
  return (
    <div className={cn("container-page transition-[padding] duration-300", compact ? "pt-2" : "pt-3")}>
      <nav
        aria-label="Principal"
        className={cn(
          "flex items-center justify-between gap-3 rounded-full border px-3 transition-[background-color,box-shadow,border-color,min-height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4",
          compact
            ? "glass min-h-16 border-line shadow-soft"
            : "min-h-[4.5rem] border-transparent bg-transparent",
        )}
      >
        <Link href="/" aria-label={`${site.name}, ir al inicio`} className="flex shrink-0 items-center gap-2 rounded-full">
          <Logo />
          <span className="hidden rounded-full bg-teal-tint px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary xl:inline">
            Telemedicina
          </span>
        </Link>

        <NavigationMenu.Root className="hidden lg:block" delayDuration={120}>
          <NavigationMenu.List className="relative flex items-center gap-0.5">
            {primaryLinks.map((link) => (
              <NavigationMenu.Item key={link.href}>
                <NavigationMenu.Link asChild>
                  <Link href={link.href} className={NAV_ITEM}>
                    {link.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
            <NavigationMenu.Item className="relative">
              <NavigationMenu.Trigger className={cn(NAV_ITEM, "group")}>
                Más
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.75}
                  className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="glass absolute right-0 top-full mt-2 w-72 rounded-3xl p-2 shadow-lift">
                <ul className="grid">
                  {moreLinks.map((link) => (
                    <li key={link.href}>
                      <NavigationMenu.Link asChild>
                        <Link href={link.href} className="flex min-h-12 items-center rounded-2xl px-4 font-medium text-heading hover:bg-teal-tint">
                          {link.label}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href={BOOKING_HREF}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "hidden sm:inline-flex",
              "shadow-[0_0_0_0_rgb(0_168_150/0.4),0_10px_28px_-10px_rgb(0_118_106/0.7)] hover:shadow-[0_0_0_6px_rgb(0_168_150/0.15),0_14px_36px_-8px_rgb(0_168_150/0.65)]",
            )}
          >
            Agendar teleconsulta
          </Link>
          <MobileMenu />
        </div>
      </nav>
    </div>
  );
}
