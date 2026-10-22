import { Info } from "lucide-react";
import { MEDICAL_DISCLAIMER } from "@/data/site";
import { cn } from "@/lib/utils";

interface MedicalDisclaimerProps {
  className?: string;
  tone?: "default" | "inverted";
}

export function MedicalDisclaimer({ className, tone = "default" }: MedicalDisclaimerProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-2.5 rounded-2xl px-4 py-3 text-base leading-relaxed",
        tone === "inverted" ? "bg-white/5 text-slate-300" : "bg-bg-alt text-muted",
        className,
      )}
    >
      <Info aria-hidden strokeWidth={1.75} className="mt-0.5 size-[1.125rem] shrink-0" />
      <span>{MEDICAL_DISCLAIMER}</span>
    </p>
  );
}
