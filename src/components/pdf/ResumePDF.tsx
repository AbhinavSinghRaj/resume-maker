import { createContext, useContext } from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { Resume } from "@/lib/schema";
import { getTemplate, type TemplateConfig } from "@/lib/templates";

// Multiplier from the text size control, applied to every font size below.
const Scale = createContext(1);

function formatMonth(m: string) {
  if (!m || m === "present") return "Present";
  const [y, mo] = m.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[parseInt(mo, 10) - 1]} ${y}`;
}

function SectionTitle({ children, cfg }: { children: string; cfg: TemplateConfig }) {
  const k = useContext(Scale);
  const style = {
    line: { borderBottomWidth: 1.5, borderBottomColor: cfg.accent, paddingBottom: 2 },
    filled: { backgroundColor: cfg.accent, color: "#fff", paddingVertical: 2, paddingHorizontal: 5, borderRadius: 2 },
    plain: { color: cfg.accent, letterSpacing: 0.8 },
  }[cfg.titleStyle];
  return (
    <Text style={{ fontSize: 10 * k, fontWeight: "bold", textTransform: "uppercase", marginBottom: 4, ...style }}>
      {children}
    </Text>
  );
}

function MainBlock({ resume, cfg }: { resume: Resume; cfg: TemplateConfig }) {
  const k = useContext(Scale);
  return (
    <>
      {resume.summary && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Summary</SectionTitle>
          <Text style={{ fontSize: 9 * k }}>{resume.summary}</Text>
        </View>
      )}
      {resume.experience.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Experience</SectionTitle>
          {resume.experience.map((e) => (
            <View key={e.id} style={{ marginBottom: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 10 * k, fontWeight: "bold" }}>{e.title} — {e.company}</Text>
                <Text style={{ fontSize: 9 * k, color: "#444" }}>
                  {formatMonth(e.startDate)} - {formatMonth(e.endDate)}
                </Text>
              </View>
              {e.location && <Text style={{ fontSize: 9 * k, color: "#444" }}>{e.location}</Text>}
              {e.bullets.filter(Boolean).map((b, i) => (
                <Text key={i} style={{ fontSize: 9 * k, marginLeft: 10, marginTop: 2 }}>• {b}</Text>
              ))}
            </View>
          ))}
        </View>
      )}
      {resume.projects.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Projects</SectionTitle>
          {resume.projects.map((p) => (
            <View key={p.id} style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 10 * k, fontWeight: "bold" }}>
                {p.name}{p.techStack.length > 0 && ` — ${p.techStack.join(", ")}`}
              </Text>
              {p.url && <Text style={{ fontSize: 9 * k, color: "#444" }}>{p.url}</Text>}
              {p.bullets.filter(Boolean).map((b, i) => (
                <Text key={i} style={{ fontSize: 9 * k, marginLeft: 10, marginTop: 2 }}>• {b}</Text>
              ))}
            </View>
          ))}
        </View>
      )}
      {resume.education.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Education</SectionTitle>
          {resume.education.map((edu) => (
            <View key={edu.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: 9 * k }}>
                {edu.degree}{edu.field && ` in ${edu.field}`} — {edu.institution}
                {edu.score && ` (${edu.score})`}
              </Text>
              <Text style={{ fontSize: 9 * k, color: "#444" }}>
                {edu.startDate && formatMonth(edu.startDate)}{edu.endDate && ` - ${formatMonth(edu.endDate)}`}
              </Text>
            </View>
          ))}
        </View>
      )}
      {(resume.customSections ?? []).filter((s) => s.heading.trim()).map((s) => (
        <View key={s.id} style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>{s.heading}</SectionTitle>
          {s.bullets.filter(Boolean).map((b, i) => (
            <Text key={i} style={{ fontSize: 9 * k, marginLeft: 10, marginTop: 2 }}>• {b}</Text>
          ))}
        </View>
      ))}
    </>
  );
}

function SideBlock({ resume, cfg }: { resume: Resume; cfg: TemplateConfig }) {
  const k = useContext(Scale);
  return (
    <>
      {resume.skills.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Skills</SectionTitle>
          {resume.skills.map((g, i) => (
            <Text key={i} style={{ fontSize: 9 * k, marginBottom: 2 }}>
              <Text style={{ fontWeight: "bold" }}>{g.category}: </Text>
              {g.items.join(", ")}
            </Text>
          ))}
        </View>
      )}
      {resume.certifications.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Certifications</SectionTitle>
          {resume.certifications.map((c) => (
            <Text key={c.id} style={{ fontSize: 9 * k, marginBottom: 2 }}>
              {c.name}{c.issuer && ` — ${c.issuer}`}{c.date && ` (${formatMonth(c.date)})`}
            </Text>
          ))}
        </View>
      )}
      {resume.achievements.filter(Boolean).length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Achievements</SectionTitle>
          {resume.achievements.filter(Boolean).map((a, i) => (
            <Text key={i} style={{ fontSize: 9 * k, marginLeft: 10, marginTop: 2 }}>• {a}</Text>
          ))}
        </View>
      )}
      {resume.languages.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <SectionTitle cfg={cfg}>Languages</SectionTitle>
          <Text style={{ fontSize: 9 * k }}>{resume.languages.join(", ")}</Text>
        </View>
      )}
    </>
  );
}

export default function ResumePDF({ resume, templateId, scale = 1 }: { resume: Resume; templateId: string; scale?: number }) {
  const k = scale;
  const c = resume.contact;
  const cfg = getTemplate(templateId);
  const band = cfg.headerStyle === "band";
  const pad = cfg.density === "compact" ? 28 : 40;
  const baseFont = cfg.density === "compact" ? 9 : 10;

  const header = (
    <View
      style={{
        textAlign: cfg.headerAlign === "left" ? "left" : "center",
        marginBottom: 12,
        ...(band ? { backgroundColor: cfg.accent, color: "#fff", margin: -pad, marginBottom: 12, padding: pad, paddingBottom: pad * 0.6 } : {}),
      }}
    >
      <Text style={{ fontSize: 18 * k, fontWeight: "bold", color: band ? "#fff" : cfg.accent }}>{c.fullName || "Your Name"}</Text>
      <Text style={{ fontSize: 9 * k, color: band ? "#fff" : "#333", marginTop: 2 }}>
        {[c.email, c.phone, c.location].filter(Boolean).join(" | ")}
      </Text>
      <Text style={{ fontSize: 9 * k, color: band ? "#fff" : "#333" }}>
        {[c.linkedin, c.github, c.portfolio].filter(Boolean).join(" | ")}
      </Text>
    </View>
  );

  // Context providers aren't valid as the PDF root, so the scale is provided inside the page.
  const body =
    cfg.layout === "sidebar" ? (
      <View style={{ flexDirection: "row", gap: 14 }}>
        <View style={{ width: "32%", backgroundColor: `${cfg.accent}1A`, borderRadius: 3, padding: 8 }}>
          <SideBlock resume={resume} cfg={cfg} />
        </View>
        <View style={{ flex: 1 }}>
          <MainBlock resume={resume} cfg={cfg} />
        </View>
      </View>
    ) : (
      <>
        <MainBlock resume={resume} cfg={cfg} />
        <SideBlock resume={resume} cfg={cfg} />
      </>
    );

  return (
    <Document>
      <Page size="A4" style={{ padding: pad, fontSize: baseFont * k, fontFamily: cfg.font === "serif" ? "Times-Roman" : "Helvetica", color: "#111" }}>
        <Scale.Provider value={k}>
          {header}
          {body}
        </Scale.Provider>
      </Page>
    </Document>
  );
}
