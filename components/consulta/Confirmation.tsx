"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarPlus, CheckCircle2, Download, FileText, Lightbulb, MessageCircle, RotateCcw, Video, Wifi, XCircle } from "lucide-react";
import { DemoBadge, PANEL } from "@/components/consulta/ui";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { doctors } from "@/data/doctors";
import type { BookingConfirmation, Result } from "@/lib/booking-provider/types";
import { buildIcs, googleCalendarUrl } from "@/lib/calendar-links";
import { CONSULTA_STORAGE_KEY, confirmationKey, parseConfirmation } from "@/lib/consulta/state";
import { formatLimaDateTime } from "@/lib/lima-format";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type LoadState = { status: "loading" } | { status: "missing" } | { status: "ready"; booking: BookingConfirmation };

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
/** El botón de Meet se destaca cuando faltan 10 minutos o menos. */
const JOIN_WINDOW_MS = 10 * MINUTE;

const PREPARE = [
  { icon: FileText, text: "Ten a mano tus exámenes previos y la lista de medicamentos que tomas." },
  { icon: Wifi, text: "Usa un celular, tablet o computadora con cámara, micrófono e internet estable." },
  { icon: Lightbulb, text: "Busca un lugar tranquilo y con buena luz." },
  { icon: Video, text: "Ten instalado WhatsApp, Zoom o Google Meet, el que prefieras." },
] as const;

function loadLocal(uid: string): BookingConfirmation | null {
  try {
    return parseConfirmation(window.sessionStorage.getItem(confirmationKey(uid)));
  } catch {
    return null;
  }
}

function countdown(ms: number): string {
  if (ms <= 0) return "Tu consulta ya empezó";
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);
  if (days > 0) return `Faltan ${days} ${days === 1 ? "día" : "días"} y ${hours} h`;
  if (hours > 0) return `Faltan ${hours} h ${minutes} min`;
  return `Faltan ${Math.max(1, minutes)} min`;
}

export function Confirmation({ uid }: { uid: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const local = loadLocal(uid);
    if (local) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de sessionStorage tras montar
      setState({ status: "ready", booking: local });
      try {
        window.sessionStorage.removeItem(CONSULTA_STORAGE_KEY); // el flujo terminó
      } catch {
        // sin almacenamiento
      }
      return;
    }
    if (uid.startsWith("demo-")) {
      setState({ status: "missing" });
      return;
    }
    const controller = new AbortController();
    fetch(`/api/booking/${encodeURIComponent(uid)}`, { signal: controller.signal, cache: "no-store" })
      .then((response) => response.json() as Promise<Result<BookingConfirmation>>)
      .then((result) => setState(result.ok ? { status: "ready", booking: result.data } : { status: "missing" }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "missing" });
      });
    return () => controller.abort();
  }, [uid]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reloj del cliente (evita desajustes de hidratación)
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30 * SECOND);
    return () => window.clearInterval(timer);
  }, []);

  if (state.status === "loading") return <div aria-hidden className="h-96 animate-pulse rounded-[1.75rem] bg-bg-alt" />;
  if (state.status === "missing") return <MissingBooking />;
  return <BookingDetails booking={state.booking} now={now} />;
}

function BookingDetails({ booking, now }: { booking: BookingConfirmation; now: number | null }) {
  const doctor = doctors.find((d) => d.slug === booking.doctorId) ?? doctors[0];
  const when = formatLimaDateTime(booking.start);
  const remaining = now === null ? null : Date.parse(booking.start) - now;
  const joinSoon = remaining !== null && remaining <= JOIN_WINDOW_MS && Date.parse(booking.end) > (now ?? 0);
  const event = useMemo(
    () => ({
      title: `Teleconsulta SERMEKARE${doctor ? ` con ${doctor.name}` : ""}`,
      start: booking.start,
      end: booking.end,
      details: `Ten a mano tus exámenes previos y la lista de medicamentos. Busca buena luz y una conexión estable.${booking.meetingUrl ? `\nEnlace: ${booking.meetingUrl}` : ""}`,
      location: booking.meetingUrl ?? "Videollamada (enlace por correo)",
    }),
    [booking, doctor],
  );
  const icsHref = useMemo(() => `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs({ ...event, uid: booking.uid }))}`, [event, booking.uid]);
  const whatsappMessage = `Hola SERMEKARE, reservé una teleconsulta para el ${when} (hora de Lima). Código de cita: ${booking.uid}.`;

  return (
    <section className="grid gap-5" aria-labelledby="confirmada-titulo">
      <div className={cn(PANEL, "text-center")}>
        <ReliefCheck />
        <h1 id="confirmada-titulo" tabIndex={-1} className="mt-4 text-h2 text-heading focus:outline-none">
          {booking.status === "pending" ? "Recibimos tu solicitud" : "¡Tu cita está reservada!"}
        </h1>
        {booking.isDemo ? (
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            <DemoBadge className="mb-2" />
            <br />
            Esta es una reserva de demostración: no se creó una cita real ni un enlace de videollamada.
          </p>
        ) : (
          <p className="mt-2 text-muted">Te enviamos la confirmación y el enlace por correo.</p>
        )}
        <p className="mt-4 font-display text-xl font-semibold text-heading first-letter:uppercase">{when}</p>
        <p className="text-sm text-muted">Hora de Lima</p>
        <p className="mt-3 inline-flex rounded-full bg-teal-tint px-4 py-1.5 text-sm font-semibold text-heading" aria-live="polite">
          {remaining === null ? " " : countdown(remaining)}
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          {booking.meetingUrl ? (
            <a
              href={booking.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg", className: cn("w-full sm:w-auto", joinSoon && "ring-4 ring-teal/40 motion-safe:animate-pulse") })}
            >
              <Video aria-hidden /> Entrar a mi consulta (Google Meet)<span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          ) : (
            <p className="text-sm text-muted">
              {booking.isDemo ? "En modo demo no se genera un enlace de Meet." : "El enlace de Google Meet te llegó por correo."}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className={PANEL}>
          <h2 className="font-display text-lg font-bold text-heading">Tu cita</h2>
          {doctor ? (
            <div className="mt-4 flex items-center gap-3">
              <DoctorPortrait doctor={doctor} size={56} alt="" className="size-14 rounded-2xl" />
              <p className="text-sm">
                <span className="block font-semibold text-heading">{doctor.name}</span>
                <span className="text-muted">{doctor.title}</span>
              </p>
            </div>
          ) : null}
          <p className="mt-4 text-sm text-muted">
            Modalidad: {booking.modality === "presencial" ? "presencial" : "videollamada"} · Código: {booking.uid}
          </p>
          {booking.modality === "presencial" ? (
            <p className="mt-2 text-sm">
              <Link href="/sedes" className="inline-flex min-h-12 items-center font-semibold text-primary hover:underline">
                Ver la dirección y cómo llegar a tu sede
              </Link>
            </p>
          ) : null}
          <div className="mt-5 grid gap-2">
            <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
              <CalendarPlus aria-hidden /> Añadir a Google Calendar<span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
            <a href={icsHref} download="cita-sermekare.ics" className={buttonVariants({ variant: "outline" })}>
              <Download aria-hidden /> Añadir a Apple / Outlook (.ics)
            </a>
            <a href={clinicWhatsApp(whatsappMessage)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp" })}>
              <WhatsAppIcon /> Recibir mi confirmación por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </div>
          {booking.rescheduleUrl || booking.cancelUrl ? (
            <p className="mt-4 flex flex-wrap gap-4 text-sm">
              {booking.rescheduleUrl ? (
                <a href={booking.rescheduleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
                  <RotateCcw aria-hidden className="size-4" /> Reprogramar
                </a>
              ) : null}
              {booking.cancelUrl ? (
                <a href={booking.cancelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-1 font-semibold text-muted hover:underline">
                  <XCircle aria-hidden className="size-4" /> Cancelar
                </a>
              ) : null}
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted">Para reprogramar o cancelar, escríbenos por WhatsApp.</p>
          )}
        </div>

        <div className={PANEL}>
          <h2 className="font-display text-lg font-bold text-heading">Prepárate para tu consulta</h2>
          <ul className="mt-4 grid gap-3">
            {PREPARE.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-base text-fg">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-tint text-primary">
                  <Icon aria-hidden className="size-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <MessageCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            Puedes enviar tus exámenes por WhatsApp (foto o PDF) antes de la videollamada.
          </p>
        </div>
      </div>

      <p className="flex flex-wrap justify-center gap-x-6 text-center">
        <Link href="/seguimiento" className="inline-flex min-h-12 items-center font-semibold text-primary hover:underline">
          Después de tu cita: cómo te acompañamos
        </Link>
        <Link href="/" className="inline-flex min-h-12 items-center font-semibold text-primary hover:underline">
          Volver al inicio
        </Link>
      </p>
    </section>
  );
}

/** Check animado «del dolor al alivio» (coral → teal). Respeta «reducir animaciones». */
function ReliefCheck() {
  return (
    <svg viewBox="0 0 96 96" className="relief-check mx-auto size-24" aria-hidden>
      <defs>
        <linearGradient id="relief-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--coral)" />
          <stop offset="100%" stopColor="var(--teal)" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="42" fill="none" stroke="url(#relief-gradient)" strokeWidth="6" className="relief-ring" />
      <path d="M30 50 l12 12 l24 -26" fill="none" stroke="url(#relief-gradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="relief-tick" />
    </svg>
  );
}

function MissingBooking() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <section className={cn(PANEL, "text-center")} aria-labelledby="sin-cita-titulo">
      <CheckCircle2 aria-hidden className="mx-auto size-12 text-muted" />
      <h1 id="sin-cita-titulo" ref={headingRef} tabIndex={-1} className="mt-3 text-h2 text-heading focus:outline-none">
        No encontramos esta cita en este navegador
      </h1>
      <p className="mx-auto mt-2 max-w-md text-muted">
        Si ya reservaste, revisa tu correo: ahí está la confirmación con el enlace. También puedes escribirnos.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={clinicWhatsApp("Hola SERMEKARE, quisiera confirmar mi teleconsulta.")} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp" })}>
          <WhatsAppIcon /> Escríbenos por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
        <Link href="/consulta-virtual" className={buttonVariants({ variant: "outline" })}>
          Reservar una consulta
        </Link>
      </div>
    </section>
  );
}
