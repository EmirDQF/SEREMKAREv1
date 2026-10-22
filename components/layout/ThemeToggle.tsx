import { Moon, Sun } from "lucide-react";
import { cx } from "@/lib/cx";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Claro / oscuro. Componente de servidor: el clic lo atiende SiteEffects (`data-theme-toggle`) y el
 * icono cambia solo con CSS según `data-theme` en <html> (sin re-render ni hidratación propia).
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Cambiar a modo oscuro"
      className={cx(
        "grid size-12 place-items-center rounded-full text-heading transition-colors hover:bg-teal-tint",
        className,
      )}
    >
      <Moon aria-hidden strokeWidth={1.75} className="size-5 dark:hidden" />
      <Sun aria-hidden strokeWidth={1.75} className="hidden size-5 dark:block" />
    </button>
  );
}
