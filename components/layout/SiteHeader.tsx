import { HeaderScrollState } from "@/components/layout/HeaderScrollState";
import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";

const HEADER_ID = "site-header";

/**
 * TopBar + Navbar. Componente de servidor: al hacer scroll, HeaderScrollState marca
 * data-scrolled y el CSS oculta la TopBar y compacta la barra (sin re-render de React).
 */
export function SiteHeader() {
  return (
    <>
      <div
        aria-hidden
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[65] h-[3px] bg-gradient-to-r from-teal via-teal to-video-glow"
      />
      <header
        id={HEADER_ID}
        data-scrolled="false"
        className="group/header fixed inset-x-0 top-0 z-[60] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[scrolled=true]:-translate-y-10"
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-14 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-on-primary"
        >
          Saltar al contenido
        </a>
        <TopBar />
        <Navbar />
      </header>
      <HeaderScrollState headerId={HEADER_ID} />
    </>
  );
}
