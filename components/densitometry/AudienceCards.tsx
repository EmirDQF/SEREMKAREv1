import { HeartHandshake, UserRound } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { densitometry } from "@/data/densitometry";
import { cn } from "@/lib/utils";

const ICONS = { "para-ti": UserRound, "para-tus-padres": HeartHandshake } as const;

interface AudienceCardsProps {
  /** Máximo de puntos por tarjeta (Home); sin límite en la página completa. */
  limit?: number;
  className?: string;
}

/** "¿Para quién es?": dos tarjetas pensadas para adultos de 30 a 50 años y para sus padres. */
export function AudienceCards({ limit, className }: AudienceCardsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {densitometry.audiences.map((audience, index) => {
        const AudienceIcon = ICONS[audience.id];
        const items = limit ? audience.items.slice(0, limit) : audience.items;
        const hidden = audience.items.length - items.length;
        return (
          <Reveal key={audience.id} delay={index * 0.08} className="glass rounded-[1.75rem] p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-teal-tint text-primary">
                <AudienceIcon aria-hidden strokeWidth={1.75} className="size-6" />
              </span>
              <h3 className="text-h3">{audience.title}</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex gap-2.5 text-base text-fg">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" />
                  {item}
                </li>
              ))}
            </ul>
            {hidden > 0 ? (
              <p className="mt-3 text-sm font-semibold text-muted">
                {hidden === 1 ? "y 1 situación más" : `y ${hidden} situaciones más`}
              </p>
            ) : null}
          </Reveal>
        );
      })}
    </div>
  );
}
