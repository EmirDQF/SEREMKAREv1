"use client";

import { Moon, Sun } from "lucide-react";
import { applyTheme, useTheme } from "@/lib/theme";
import { cx } from "@/lib/cx";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={theme === null ? undefined : isDark}
      className={cx(
        "grid size-12 place-items-center rounded-full text-heading transition-colors hover:bg-teal-tint",
        className,
      )}
    >
      {isDark ? (
        <Sun aria-hidden strokeWidth={1.75} className="size-5" />
      ) : (
        <Moon aria-hidden strokeWidth={1.75} className="size-5" />
      )}
    </button>
  );
}
