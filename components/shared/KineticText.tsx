import { Fragment } from "react";
import { splitKineticWords } from "@/lib/kinetic";
import { cn } from "@/lib/utils";

interface KineticTextProps {
  text: string;
  /** Frase contenida en `text` que se pinta con el gradiente teal. */
  accent?: string;
  /** inverted: gradiente claro para fondos navy. */
  tone?: "default" | "inverted";
  className?: string;
  /** Se conserva por compatibilidad: el texto ya no se anima, así que nunca retrasa el LCP. */
  priority?: boolean;
}

/**
 * Título con la frase clave resaltada. Componente de servidor: el texto se pinta con el HTML (antes
 * entraba desenfocado palabra a palabra con motion, lo que retrasaba el LCP en móviles).
 */
export function KineticText({ text, accent, tone = "default", className }: KineticTextProps) {
  const words = splitKineticWords(text, accent);
  const accentClass = tone === "inverted" ? "text-gradient-teal-light" : "text-gradient-teal";

  return (
    <span className={className}>
      {words.map((item, index) => (
        <Fragment key={`${item.word}-${index}`}>
          {item.accent ? <span className={cn("inline-block", accentClass)}>{item.word}</span> : item.word}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
