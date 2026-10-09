import Image from "next/image";
import type { Doctor } from "@/types/medical";
import { cn } from "@/lib/utils";

type PortraitDoctor = Pick<Doctor, "name" | "photo" | "photoAlt" | "initials">;

/** Encuadre hacia el rostro: los retratos cuadrados y 4:5 recortan el pecho, no la cabeza. */
const FACE_POSITION = "object-cover object-[50%_22%]";

interface DoctorPortraitProps {
  doctor: PortraitDoctor;
  /** Clases del contenedor (tamaño, radio). Con `fill`, el padre debe ser `relative`. */
  className?: string;
  /** Llena el contenedor padre (como next/image `fill`). */
  fill?: boolean;
  /** Tamaño en px cuando no se usa `fill`. */
  size?: number;
  sizes?: string;
  /** Solo si el retrato está en el primer pantallazo (hero): se precarga. El resto es lazy. */
  priority?: boolean;
  /** "" si la imagen es decorativa (el nombre ya está al lado). */
  alt?: string;
}

/**
 * Retrato del médico con next/image (AVIF/WebP, tamaño reservado: sin saltos de layout).
 * Sin foto real (`photo: null`) muestra un retrato de marca con las iniciales, del mismo tamaño.
 */
export function DoctorPortrait({
  doctor,
  className,
  fill = false,
  size = 64,
  sizes,
  priority = false,
  alt,
}: DoctorPortraitProps) {
  const label = alt ?? doctor.photoAlt;

  if (doctor.photo) {
    const loading = priority ? { preload: true } : { loading: "lazy" as const };
    return fill ? (
      <Image
        src={doctor.photo}
        alt={label}
        fill
        sizes={sizes ?? "100vw"}
        decoding="async"
        {...loading}
        className={cn(FACE_POSITION, className)}
      />
    ) : (
      <Image
        src={doctor.photo}
        alt={label}
        width={size}
        height={size}
        decoding="async"
        {...loading}
        className={cn(FACE_POSITION, className)}
      />
    );
  }

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      style={fill ? undefined : { width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "portrait-placeholder grid shrink-0 place-items-center overflow-hidden font-display font-semibold tracking-wide text-white",
        fill && "absolute inset-0 text-[clamp(2.5rem,9vw,5.5rem)]",
        className,
      )}
    >
      <span aria-hidden>{doctor.initials}</span>
    </span>
  );
}
