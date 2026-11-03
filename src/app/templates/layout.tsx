import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS-Friendly Resume Templates | ResumeBuilder",
  description: "20 ATS-safe resume templates in different colors and layouts. Pick one, fill in your details and download a clean, text-selectable PDF.",
};

export default function TemplatesLayout({ children }: LayoutProps<"/templates">) {
  return children;
}
