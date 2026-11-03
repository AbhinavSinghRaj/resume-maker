import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeBuilder — ATS-ready resumes, tailored to every job",
  description: "Write your story once. Tailor it to every job description with an ATS score, keyword match and clean PDF export.",
  // Set NEXT_PUBLIC_SITE_URL in production so share previews get absolute URLs.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "ResumeBuilder — ATS-ready resumes, tailored to every job",
    description: "Paste a job description and get an ATS-optimized resume built from your real experience.",
    type: "website",
    siteName: "ResumeBuilder",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
