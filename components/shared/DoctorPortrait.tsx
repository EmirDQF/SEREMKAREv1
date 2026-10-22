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

/** Anchos pregenerados por scripts/optimize-doctor-photo.mjs (AVIF y WebP). */
const PHOTO_WIDTHS = [400, 552] as const;
const VARIANT = /^(.*)-552\.webp$/;

/** "/images/doctor/x-552.webp" → srcset de 400 y 552 px en un formato; null si no sigue la convención. */
function variantSrcSet(photo: string, format: "avif" | "webp"): string | null {
  const match = VARIANT.exec(photo);
  if (!match) return null;
  return PHOTO_WIDTHS.map((width) => `${match[1]}-${width}.${format} ${width}w`).join(", ");
}

/**
 * Retrato del médico con <picture> de servidor (AVIF/WebP pregenerados, tamaño reservado: sin saltos
 * de layout). Sin next/image: la Home no descarga su componente cliente (~5 KB gzip).
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
    const resolvedSizes = sizes ?? (fill ? "100vw" : `${size}px`);
    const avif = variantSrcSet(doctor.photo, "avif");
    const webp = variantSrcSet(doctor.photo, "webp");
    return (
      <picture className={fill ? "absolute inset-0" : "contents"}>
        {avif ? <source type="image/avif" srcSet={avif} sizes={resolvedSizes} /> : null}
        {webp ? <source type="image/webp" srcSet={webp} sizes={resolvedSizes} /> : null}
        <img
          src={doctor.photo}
          alt={label}
          width={fill ? 552 : size}
          height={fill ? 690 : size}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn(FACE_POSITION, fill && "absolute inset-0 size-full", className)}
        />
      </picture>
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
