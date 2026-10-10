import type { NextConfig } from "next";
const config: NextConfig = { distDir: process.env.QA_DISTDIR || ".next", poweredByHeader: false, serverExternalPackages: ["node:sqlite"] };
export default config;
