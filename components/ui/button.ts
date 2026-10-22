import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "light" | "whatsapp";
type ButtonSize = "md" | "lg" | "icon";

interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const BASE =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-display font-semibold tracking-[-0.01em] " +
  "transition-[transform,background-color,box-shadow,color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0";

const VARIANTS: Record<ButtonVariant, string> = {
  /* CTA principal: teal sólido con halo luminoso (--shadow-glow) y destello al hover. */
  primary: "shimmer glow-cta bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-navy text-white hover:bg-navy-2 dark:bg-white dark:text-navy-950 dark:hover:bg-mist-200",
  outline:
    "border border-line-strong bg-card-solid/80 text-heading shadow-soft hover:border-primary hover:text-primary dark:bg-white/5",
  ghost: "text-heading hover:bg-teal-tint",
  light: "bg-white text-navy shadow-soft hover:bg-slate-100",
  whatsapp: "bg-whatsapp-strong text-on-whatsapp hover:bg-whatsapp-strong-hover",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-7 text-base sm:px-8",
  icon: "size-12",
};

export function buttonVariants({ variant = "primary", size = "md", className }: ButtonVariantOptions = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}
