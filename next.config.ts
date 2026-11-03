import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse loads pdfjs worker files at runtime; bundling breaks those paths.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
