import { ImageResponse } from "next/og";

export const alt = "Ritesh Jena, Software Consultant: .NET, React and AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#e6e9e1",
          color: "#111a2c",
          backgroundImage:
            "linear-gradient(rgba(17,26,44,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17,26,44,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, color: "#4a5361" }}>
          SOFTWARE CONSULTANT · ITPLUSPOINT · BHUBANESWAR
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>Ritesh Jena</div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 600 }}>
            <span>Business software in .NET and React,&nbsp;</span>
            <span style={{ background: "#f2c230", padding: "0 8px" }}>with AI built in.</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24 }}>
          {["ASP.NET MVC", "React", "SQL Server", "Generative AI"].map((t) => (
            <span key={t} style={{ border: "2px solid #111a2c", borderRadius: 999, padding: "8px 18px" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
