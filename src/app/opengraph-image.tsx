import { ImageResponse } from "next/og";

export const alt = "ResumeBuilder — ATS-ready resumes, tailored to every job";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0E0F1A 0%, #2A1F7A 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 700 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 14, background: "#5B4BFF" }}>R</div>
          ResumeBuilder
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 48, lineHeight: 1.05, letterSpacing: -2 }}>
          Your resume, rewritten for every job you want.
        </div>
        <div style={{ fontSize: 30, marginTop: 32, color: "#D6FF4D" }}>ATS score · JD keyword match · AI rewrites · PDF export</div>
      </div>
    ),
    size
  );
}
