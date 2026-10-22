import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { REAL_DOCTOR_SHARE_PHOTO, REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { CENTER_TAGLINE, site } from "@/data/site";
import { locationNamesLabel } from "@/lib/locations";

const doctor = getDoctor(REAL_DOCTOR_SLUG);

export const alt = `${site.name}, ${CENTER_TAGLINE}: ${doctor.name}, médico reumatólogo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Foto 4:5 a todo el alto de la imagen. Se lee una vez (no depende de la petición). */
const PHOTO_WIDTH = Math.round((size.height * 4) / 5);
const photoData = await readFile(join(process.cwd(), "public", REAL_DOCTOR_SHARE_PHOTO), "base64");
const photoSrc = `data:image/jpeg;base64,${photoData}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(60% 70% at 15% 20%, rgba(13,172,157,0.32), transparent 70%), radial-gradient(50% 60% at 80% 90%, rgba(2,131,161,0.28), transparent 70%), linear-gradient(135deg, #081128 0%, #192C55 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 56px 56px 72px" }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -2 }}>
            SERME<span style={{ color: "#61E0D0" }}>KARE</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.06, letterSpacing: -2 }}>
              {CENTER_TAGLINE}
            </div>
            <div style={{ marginTop: 24, fontSize: 30, color: "#DDE5ED" }}>
              {`${doctor.name} · Densitometría, tratamiento y seguimiento`}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#98EEE1" }}>
            {`Sedes en ${locationNamesLabel()} · Teleconsulta`}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) solo admite <img> */}
        <img src={photoSrc} width={PHOTO_WIDTH} height={size.height} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    { ...size },
  );
}
