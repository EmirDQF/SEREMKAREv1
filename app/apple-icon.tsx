import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícono de inicio de iOS (180 px): el isotipo de app/icon.svg en PNG, con la paleta 2026. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F1D3A" }}>
        <svg width="132" height="132" viewBox="0 0 40 40">
          <path
            d="M11 9v7.5c0 4 4 5.5 9 5.5s9-1.5 9-5.5V9M11 31v-3.5c0-2.6 4-3.8 9-3.8s9 1.2 9 3.8V31"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="23" r="2.6" fill="#0DAC9D" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
