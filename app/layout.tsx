import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://978044309.github.io/aureonagent/"),
  title: "Aureon Agent - AI Startup OS",
  description: "Aureon Agent 通过 AI 帮助创业者从想法验证、商业模式和 MVP 规划走到第一笔收入。",
  alternates: {
    canonical: "https://978044309.github.io/aureonagent/"
  },
  openGraph: {
    title: "Aureon Agent - AI Startup OS",
    description: "从创业想法到第一笔收入的 AI 创业操作系统。",
    url: "https://978044309.github.io/aureonagent/",
    siteName: "Aureon Agent",
    locale: "zh_CN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
