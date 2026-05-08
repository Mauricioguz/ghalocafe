import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Requerido para exportación estática
  },
};

export default nextConfig;
