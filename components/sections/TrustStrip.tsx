import { BadgeCheck, CalendarClock, HeartHandshake, Lock, ShieldCheck, Stethoscope } from "lucide-react";

/**
 * Franja de confianza con datos reales: los 4 sellos de la tarjeta de KARE SAC y los marcos
 * legales (Ley 30421, Ley 29733). Sin cifras ni aseguradoras no confirmadas (D2).
 */
const SEALS = [
  { icon: ShieldCheck, label: "Ley Marco de Telesalud N.° 30421" },
  { icon: Lock, label: "Datos protegidos (Ley N.° 29733)" },
  { icon: Stethoscope, label: "Orienta, no diagnostica" },
  { icon: BadgeCheck, label: "Resultados claros y confiables" },
  { icon: CalendarClock, label: "Atención con cita previa" },
  { icon: HeartHandshake, label: "Orientado a médicos y pacientes" },
] as const;

export function TrustStrip() {
  return (
    <section aria-label="Por qué confiar en SERMEKARE" className="border-y border-line bg-card-solid/60">
      <ul className="container-page grid grid-cols-2 gap-x-6 gap-y-4 py-6 sm:grid-cols-3 lg:grid-cols-6">
        {SEALS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-sm font-semibold text-heading">
            <Icon aria-hidden strokeWidth={1.75} className="size-5 shrink-0 text-primary" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
