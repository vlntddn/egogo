import type { NextConfig } from "next";

const repoName = "egogo";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repoName}`,
};

export default nextConfig;
