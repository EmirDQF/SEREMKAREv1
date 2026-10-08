import type { Metadata } from "next";
import { ConsultaApp } from "@/components/consulta/ConsultaApp";
import type { ConsultaService } from "@/lib/consulta/state";

export const metadata: Metadata = {
  title: "Consulta virtual",
  description: "Evaluación rápida, orientación y reserva de tu teleconsulta reumatológica por videollamada.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/consulta-virtual" },
};

const SERVICES: readonly ConsultaService[] = ["teleconsulta", "densitometria"];

function parseService(value: string | string[] | undefined): ConsultaService | null {
  return typeof value === "string" && (SERVICES as readonly string[]).includes(value) ? (value as ConsultaService) : null;
}

export default async function ConsultaVirtualPage({ searchParams }: PageProps<"/consulta-virtual">) {
  const { servicio } = await searchParams;
  return (
    <div className="container-page min-w-0 max-w-4xl py-8 sm:py-12">
      <noscript>
        <p className="mb-6 rounded-2xl border border-line p-4">
          Para reservar en línea necesitas JavaScript. También puedes agendar por WhatsApp desde la página de inicio.
        </p>
      </noscript>
      <ConsultaApp initialService={parseService(servicio)} />
    </div>
  );
}
