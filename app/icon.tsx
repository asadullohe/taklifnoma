import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon — "A&S" monogrammasi (krem fon, oltin ramka).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#efe9db",
          color: "#4a543d",
          fontFamily: "Georgia, serif",
          fontSize: 30,
          fontWeight: 600,
          border: "3px solid #c3a24e",
          borderRadius: 12,
        }}
      >
        A
        <span style={{ color: "#c3a24e", fontSize: 20, margin: "0 1px" }}>
          &
        </span>
        S
      </div>
    ),
    { ...size },
  );
}
