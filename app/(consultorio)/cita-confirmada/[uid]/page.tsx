import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Confirmation } from "@/components/consulta/Confirmation";

export const metadata: Metadata = {
  title: "Cita confirmada",
  robots: { index: false, follow: false },
};

const UID = /^[A-Za-z0-9_-]{6,80}$/;

export default async function CitaConfirmadaPage({ params }: PageProps<"/cita-confirmada/[uid]">) {
  const { uid } = await params;
  if (!UID.test(uid)) notFound();
  return (
    <div className="container-page max-w-4xl py-8 sm:py-12">
      <Confirmation uid={uid} />
    </div>
  );
}
