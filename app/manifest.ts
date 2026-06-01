import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXORA",
    short_name: "NEXORA",
    description: "AI-powered scheduling and automation for modern businesses",
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#3b82f6",
  };
}
