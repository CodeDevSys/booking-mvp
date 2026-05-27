/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const isGitHubPages = process.env.GITHUB_PAGES === "1";

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  ...(isStaticExport ? { output: "export" } : {}),
  ...(isGitHubPages
    ? {
        basePath: "/booking-mvp",
        assetPrefix: "/booking-mvp/",
      }
    : {}),
};

export default nextConfig;
