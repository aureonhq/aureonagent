/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/aureonagent" : "",
  assetPrefix: isGitHubPages ? "/aureonagent/" : ""
};

export default nextConfig;
