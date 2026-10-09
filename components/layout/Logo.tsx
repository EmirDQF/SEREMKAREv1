import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/** Isotipo: dos superficies articulares (arcos) con el espacio articular sano en teal. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-9", className)}>
      <rect width="40" height="40" rx="12" className="fill-navy dark:fill-white" />
      <path
        d="M11 9v7.5c0 4 4 5.5 9 5.5s9-1.5 9-5.5V9"
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
        className="stroke-white dark:stroke-navy"
      />
      <path
        d="M11 31v-3.5c0-2.6 4-3.8 9-3.8s9 1.2 9 3.8V31"
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
        className="stroke-white dark:stroke-navy"
      />
      <circle cx="20" cy="23" r="2.6" fill="#00A896" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** inverted: sobre fondo navy (texto blanco en ambos modos). */
  tone?: "default" | "inverted";
  showTagline?: boolean;
}

/** Logotipo SERMEKARE: isotipo + wordmark en Plus Jakarta Sans. Funciona en modo claro y oscuro. */
export function Logo({ className, tone = "default", showTagline = false }: LogoProps) {
  const inverted = tone === "inverted";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={inverted ? "[&_rect]:fill-white [&_path]:stroke-navy" : undefined} />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[1.3rem] font-extrabold tracking-[-0.04em]",
            inverted ? "text-white" : "text-heading",
          )}
        >
          SERME<span className={inverted ? "text-teal" : "text-primary"}>KARE</span>
        </span>
        {showTagline ? (
          <span className={cn("mt-1 block text-[0.7rem] font-medium", inverted ? "text-slate-300" : "text-muted")}>
            Reumatología y Salud Articular
          </span>
        ) : null}
      </span>
    </span>
  );
}
