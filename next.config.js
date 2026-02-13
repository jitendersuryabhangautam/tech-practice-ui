/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/tech-practice-ui",
  assetPrefix: "/tech-practice-ui/",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/tech-practice-ui",
  },
};

module.exports = nextConfig;
