import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://978044309.github.io/aureonagent/"),
  title: "Aureon Insurance & Wealth AI",
  description: "AI 驱动的保险与财富管理经纪平台，分析家庭风险、保险缺口、资产配置和现金流压力。",
  keywords: ["AI 保险", "财富管理", "保险经纪", "家庭风险分析", "资产配置", "Aureon"],
  alternates: {
    canonical: "https://978044309.github.io/aureonagent/"
  },
  openGraph: {
    title: "Aureon Insurance & Wealth AI",
    description: "分析家庭风险、保险缺口、资产配置和现金流压力。",
    url: "https://978044309.github.io/aureonagent/",
    siteName: "Aureon",
    locale: "zh_CN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={inter.className}>{children}</body></html>;
}
