import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_STARS = 5;

interface AnimatedStarsProps {
  rating: number;
  className?: string;
}

/**
 * Calificación con estrellas. Componente de servidor: antes las encendía una a una con motion, lo que
 * metía motion en el JS de la Home aunque los testimonios estén ocultos (visibility.testimonials).
 */
export function AnimatedStars({ rating, className }: AnimatedStarsProps) {
  const filled = Math.round(rating);
  return (
    <span role="img" aria-label={`${rating} de ${MAX_STARS} estrellas`} className={cn("inline-flex gap-0.5", className)}>
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          strokeWidth={1.5}
          className={cn("size-4", index < filled ? "fill-rating text-rating" : "text-line-strong")}
        />
      ))}
    </span>
  );
}
