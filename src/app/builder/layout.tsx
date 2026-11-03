import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder | ResumeBuilder",
  description: "Build an ATS-ready resume, tailor it to any job description and download it as a PDF.",
};

export default function BuilderLayout({ children }: LayoutProps<"/builder">) {
  return children;
}
