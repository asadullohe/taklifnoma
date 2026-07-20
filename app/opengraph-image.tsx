import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { site } from "@/lib/seo";

export const alt = `${site.groom} & ${site.bride} — Nikoh to'yi taklifnomasi`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Ranglar (asosiy saytdagi palitra bilan bir xil)
const CREAM = "#efe9db";
const OLIVE = "#4a543d";
const OLIVE_D = "#3c452f";
const GOLD = "#c3a24e";
const GOLD_D = "#a2853f";
const MUTED = "#8a8470";

function asset(...p: string[]) {
  return readFileSync(join(process.cwd(), ...p));
}

// Takrorlanuvchi bezak (flourish) — oltin
function Flourish({ w = 300 }: { w?: number }) {
  return (
    <svg
      width={w}
      height={(w * 50) / 280}
      viewBox="0 0 280 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={GOLD} fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M140 25 C 116 25, 112 9, 92 14 C 74 18, 80 36, 62 33 C 50 31, 54 20, 44 23" />
        <path d="M140 25 C 164 25, 168 9, 188 14 C 206 18, 200 36, 218 33 C 230 31, 226 20, 236 23" />
        <path d="M96 14 c -4 -6 -12 -6 -14 2" />
        <path d="M184 14 c 4 -6 12 -6 14 2" />
      </g>
      <path d="M140 15 l7 10 -7 10 -7 -10 z" fill={GOLD} />
      <circle cx="40" cy="23" r="2.6" fill={GOLD} />
      <circle cx="240" cy="23" r="2.6" fill={GOLD} />
    </svg>
  );
}

export default function OpengraphImage() {
  const pinyon = asset("assets", "fonts", "PinyonScript-Regular.ttf");
  const cormorantMedium = asset("assets", "fonts", "CormorantGaramond-Medium.ttf");
  const cormorantSemiBold = asset("assets", "fonts", "CormorantGaramond-SemiBold.ttf");
  const flower = `data:image/png;base64,${asset("assets", "og", "flower-corner.png").toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
          fontFamily: "Cormorant",
          position: "relative",
        }}
      >
        {/* Markazdagi yumshoq yog'du */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(130% 90% at 50% 42%, rgba(255,253,247,0.9), rgba(239,233,219,0) 62%)",
          }}
        />

        {/* Gul burchaklar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={flower}
          alt=""
          width={400}
          height={238}
          style={{ position: "absolute", top: -34, right: -28 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={flower}
          alt=""
          width={340}
          height={202}
          style={{
            position: "absolute",
            bottom: -28,
            left: -22,
            transform: "rotate(180deg)",
          }}
        />

        {/* Ikki qavatli oltin ramka */}
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 34,
            right: 34,
            bottom: 34,
            border: `2px solid ${GOLD}`,
            borderRadius: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 46,
            left: 46,
            right: 46,
            bottom: 46,
            border: `1px solid rgba(195,162,78,0.45)`,
            borderRadius: 6,
          }}
        />

        {/* Kontent (satori qatlamlashni DOM tartibi bo'yicha qiladi) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 27,
              letterSpacing: 11,
              textTransform: "uppercase",
              color: GOLD_D,
              fontWeight: 600,
            }}
          >
            Nikoh to&apos;yi taklifnomasi
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Pinyon",
              fontSize: 118,
              color: OLIVE_D,
              lineHeight: 1.1,
              marginTop: 10,
              paddingBottom: 6,
            }}
          >
            <span>{site.groom}</span>
            <span style={{ color: GOLD, margin: "0 26px" }}>&amp;</span>
            <span>{site.bride}</span>
          </div>

          <div style={{ display: "flex", marginTop: 4, marginBottom: 4 }}>
            <Flourish w={300} />
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 44,
              color: OLIVE,
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            {site.dateText}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: MUTED,
              marginTop: 16,
              letterSpacing: 1,
            }}
          >
            {`${site.venue} · ${site.venueAddress}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pinyon", data: pinyon, weight: 400, style: "normal" },
        { name: "Cormorant", data: cormorantMedium, weight: 400, style: "normal" },
        { name: "Cormorant", data: cormorantMedium, weight: 500, style: "normal" },
        { name: "Cormorant", data: cormorantSemiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
