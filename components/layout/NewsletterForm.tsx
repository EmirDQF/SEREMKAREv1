"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";
import { site } from "@/data/site";
import { buildMailtoLink } from "@/lib/whatsapp";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Suscripción a la "Guía de salud articular". Sin backend: abre el correo con la solicitud lista. */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Escribe un correo válido, por ejemplo nombre@correo.com.");
      return;
    }
    if (!consent) {
      setError("Necesitamos tu autorización para enviarte la guía.");
      return;
    }
    setError(null);
    window.location.href = buildMailtoLink(
      site.email ?? "",
      "Suscripción: Guía de salud articular",
      `Hola ${site.name}, quiero recibir la Guía de salud articular en este correo: ${email.trim()}`,
    );
    setSent(true);
  }

  if (sent) {
    return (
      <p role="status" className="flex items-start gap-2 rounded-2xl bg-white/5 p-4 text-slate-200">
        <CheckCircle2 aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-teal" />
        ¡Gracias! Envía el correo que se abrió y te haremos llegar la guía.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <label htmlFor={`${id}-email`} className="block text-sm font-semibold text-white">
        Tu correo electrónico
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error !== null}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="nombre@correo.com"
          className="min-h-12 w-full min-w-0 rounded-full border border-white/15 bg-white/5 px-5 text-white placeholder:text-slate-400 focus:border-teal focus:outline-none"
        />
        <button
          type="submit"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-teal text-navy transition-transform hover:bg-teal-300 active:scale-95"
          aria-label="Suscribirme a la guía"
        >
          <Send aria-hidden strokeWidth={1.75} className="size-5" />
        </button>
      </div>
      <label className="flex items-start gap-2.5 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-teal"
        />
        <span>
          Acepto recibir información de salud y la{" "}
          <Link href="/politica-de-privacidad" className="font-semibold text-teal-200 underline underline-offset-2">
            política de privacidad
          </Link>{" "}
          (Ley N.° 29733).
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-coral">
          {error}
        </p>
      ) : null}
    </form>
  );
}
