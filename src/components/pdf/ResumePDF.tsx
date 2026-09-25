import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/lib/schema";

function formatMonth(m: string) {
  if (!m || m === "present") return "Present";
  const [y, mo] = m.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[parseInt(mo, 10) - 1]} ${y}`;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111" },
  header: { textAlign: "center", marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "bold" },
  contactLine: { fontSize: 9, color: "#333", marginTop: 2 },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    marginBottom: 4,
    paddingBottom: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  itemTitle: { fontSize: 10, fontWeight: "bold" },
  itemSub: { fontSize: 9, color: "#444" },
  bullet: { fontSize: 9, marginLeft: 10, marginTop: 2 },
  entry: { marginBottom: 6 },
});

export default function ResumePDF({ resume }: { resume: Resume }) {
  const c = resume.contact;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{c.fullName || "Your Name"}</Text>
          <Text style={styles.contactLine}>
            {[c.email, c.phone, c.location].filter(Boolean).join(" | ")}
          </Text>
          <Text style={styles.contactLine}>
            {[c.linkedin, c.github, c.portfolio].filter(Boolean).join(" | ")}
          </Text>
        </View>

        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9 }}>{resume.summary}</Text>
          </View>
        )}

        {resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((e) => (
              <View key={e.id} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{e.title} — {e.company}</Text>
                  <Text style={styles.itemSub}>
                    {formatMonth(e.startDate)} - {formatMonth(e.endDate)}
                  </Text>
                </View>
                {e.location && <Text style={styles.itemSub}>{e.location}</Text>}
                {e.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={styles.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((p) => (
              <View key={p.id} style={styles.entry}>
                <Text style={styles.itemTitle}>
                  {p.name}{p.techStack.length > 0 && ` — ${p.techStack.join(", ")}`}
                </Text>
                {p.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={styles.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu) => (
              <View key={edu.id} style={[styles.row, { marginBottom: 4 }]}>
                <Text style={{ fontSize: 9 }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`} — {edu.institution}
                  {edu.score && ` (${edu.score})`}
                </Text>
                <Text style={styles.itemSub}>
                  {edu.startDate && formatMonth(edu.startDate)}{edu.endDate && ` - ${formatMonth(edu.endDate)}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {resume.skills.map((g, i) => (
              <Text key={i} style={{ fontSize: 9, marginBottom: 2 }}>
                <Text style={{ fontWeight: "bold" }}>{g.category}: </Text>
                {g.items.join(", ")}
              </Text>
            ))}
          </View>
        )}

        {resume.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications.map((cert) => (
              <Text key={cert.id} style={{ fontSize: 9, marginBottom: 2 }}>
                {cert.name}{cert.issuer && ` — ${cert.issuer}`}{cert.date && ` (${formatMonth(cert.date)})`}
              </Text>
            ))}
          </View>
        )}

        {resume.achievements.filter(Boolean).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {resume.achievements.filter(Boolean).map((a, i) => (
              <Text key={i} style={styles.bullet}>• {a}</Text>
            ))}
          </View>
        )}

        {resume.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={{ fontSize: 9 }}>{resume.languages.join(", ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}