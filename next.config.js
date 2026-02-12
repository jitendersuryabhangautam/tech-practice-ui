/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/tech-revision-platform",
  assetPrefix: "/tech-revision-platform/",
};

module.exports = nextConfig;
