/**
 * Interruptor «Reducir animaciones» (se guarda en localStorage). Mismo efecto que
 * prefers-reduced-motion: sin smooth scroll, sin animaciones de entrada y 3D en pose estática.
 * Componente de servidor: SiteEffects (`data-motion-toggle`) sincroniza aria-checked y atiende el clic;
 * el aspecto sale de aria-checked y data-forced (sin JS de React).
 */
export function MotionToggle() {
  return (
    <button
      type="button"
      role="switch"
      aria-checked="false"
      data-motion-toggle
      className="group/motion inline-flex min-h-12 items-center gap-3 rounded-full text-left text-on-navy-muted transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-80"
    >
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full border border-white/25 bg-white/10 transition-colors duration-200 group-aria-checked/motion:border-teal group-aria-checked/motion:bg-teal"
      >
        <span className="absolute left-0.5 top-0.5 size-[1.125rem] rounded-full bg-white shadow-soft transition-transform duration-200 group-aria-checked/motion:translate-x-5" />
      </span>
      <span>
        Reducir animaciones
        <span className="hidden text-sm text-on-navy-subtle group-data-[forced=true]/motion:block">Activado por tu sistema</span>
      </span>
    </button>
  );
}
