export interface TemplateConfig {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  layout: "single" | "sidebar";
  headerAlign: "center" | "left";
  density: "normal" | "compact";
  /** serif = Georgia/Times, sans = Inter/Helvetica */
  font: "serif" | "sans";
  /** How section headings look: underline, solid colored bar, or just colored text. */
  titleStyle: "line" | "filled" | "plain";
  /** "band" puts the name on a full-width colored block. */
  headerStyle: "plain" | "band";
}

export const templates: TemplateConfig[] = [
  { id: "classic-teal", name: "Classic Teal", tagline: "Safe default for any industry", accent: "#1F6F5C", layout: "single", headerAlign: "center", density: "normal", font: "serif", titleStyle: "line", headerStyle: "plain" },
  { id: "modern-teal", name: "Modern Sidebar", tagline: "Skills column stands out", accent: "#1F6F5C", layout: "sidebar", headerAlign: "left", density: "normal", font: "sans", titleStyle: "plain", headerStyle: "band" },
  { id: "compact-gold", name: "Compact Gold", tagline: "Fits a long career on one page", accent: "#B8862E", layout: "single", headerAlign: "left", density: "compact", font: "sans", titleStyle: "line", headerStyle: "plain" },
  { id: "crimson-bold", name: "Crimson Bold", tagline: "Confident, high-contrast look", accent: "#B23A34", layout: "single", headerAlign: "center", density: "normal", font: "sans", titleStyle: "filled", headerStyle: "band" },
  { id: "royal-purple", name: "Royal Purple", tagline: "Stands out in creative fields", accent: "#6A4C93", layout: "single", headerAlign: "center", density: "normal", font: "serif", titleStyle: "plain", headerStyle: "plain" },
  { id: "cobalt-blue", name: "Cobalt Blue", tagline: "Corporate, trustworthy feel", accent: "#1F4E8C", layout: "sidebar", headerAlign: "left", density: "normal", font: "sans", titleStyle: "line", headerStyle: "band" },
  { id: "slate-professional", name: "Slate Professional", tagline: "Neutral and understated", accent: "#3A4750", layout: "single", headerAlign: "center", density: "normal", font: "sans", titleStyle: "line", headerStyle: "plain" },
  { id: "forest-green", name: "Forest Green", tagline: "Calm, grounded sidebar layout", accent: "#2E5339", layout: "sidebar", headerAlign: "left", density: "normal", font: "serif", titleStyle: "line", headerStyle: "plain" },
  { id: "burgundy-executive", name: "Burgundy Executive", tagline: "Senior and leadership roles", accent: "#7A1F3D", layout: "single", headerAlign: "center", density: "normal", font: "serif", titleStyle: "filled", headerStyle: "plain" },
  { id: "ocean-blue", name: "Ocean Blue", tagline: "Fresh, approachable tone", accent: "#0E6E8C", layout: "single", headerAlign: "left", density: "normal", font: "sans", titleStyle: "plain", headerStyle: "band" },
  { id: "charcoal-minimal", name: "Charcoal Minimal", tagline: "Dense, no-frills, fits more", accent: "#2B2B2B", layout: "single", headerAlign: "center", density: "compact", font: "sans", titleStyle: "line", headerStyle: "plain" },
  { id: "amber-creative", name: "Amber Creative", tagline: "Warm accent with sidebar", accent: "#C9742B", layout: "sidebar", headerAlign: "left", density: "normal", font: "sans", titleStyle: "filled", headerStyle: "band" },
  { id: "indigo-sharp", name: "Indigo Sharp", tagline: "Sharp, modern tech feel", accent: "#3F3D9E", layout: "single", headerAlign: "center", density: "normal", font: "sans", titleStyle: "filled", headerStyle: "plain" },
  { id: "rose-quartz", name: "Rose Quartz", tagline: "Soft accent, left-aligned header", accent: "#B5657A", layout: "single", headerAlign: "left", density: "normal", font: "serif", titleStyle: "plain", headerStyle: "plain" },
  { id: "steel-blue", name: "Steel Blue", tagline: "Clean sidebar for skills-heavy resumes", accent: "#4C6A92", layout: "sidebar", headerAlign: "left", density: "normal", font: "sans", titleStyle: "line", headerStyle: "plain" },
  { id: "olive-classic", name: "Olive Classic", tagline: "Earthy, traditional structure", accent: "#5B6B3E", layout: "single", headerAlign: "center", density: "normal", font: "serif", titleStyle: "line", headerStyle: "plain" },
  { id: "plum-modern", name: "Plum Modern", tagline: "Distinct color with sidebar skills", accent: "#6F3356", layout: "sidebar", headerAlign: "left", density: "normal", font: "serif", titleStyle: "plain", headerStyle: "band" },
  { id: "graphite-bold", name: "Graphite Bold", tagline: "Maximum density, minimal color", accent: "#1E1E1E", layout: "single", headerAlign: "center", density: "compact", font: "sans", titleStyle: "filled", headerStyle: "plain" },
  { id: "teal-sidebar", name: "Teal Sidebar", tagline: "Darker teal, sidebar layout", accent: "#15746B", layout: "sidebar", headerAlign: "left", density: "normal", font: "sans", titleStyle: "filled", headerStyle: "plain" },
  { id: "copper-warm", name: "Copper Warm", tagline: "Warm tone, left-aligned header", accent: "#A0522D", layout: "single", headerAlign: "left", density: "normal", font: "serif", titleStyle: "line", headerStyle: "band" },
];

export function getTemplate(id: string): TemplateConfig {
  return templates.find((t) => t.id === id) ?? templates[0];
}
