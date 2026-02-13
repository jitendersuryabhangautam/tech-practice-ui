const path = require("path");

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/tech-practice-ui" : "",
  assetPrefix: isProd ? "/tech-practice-ui/" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/tech-practice-ui" : "",
  },
};

module.exports = nextConfig;
