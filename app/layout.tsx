import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Workforce - AI 劳动力网络 MVP",
  description: "企业按结果调用 AI 劳动力，系统自动拆解、报价、匹配人才并推荐交付步骤的 Web MVP。",
  keywords: ["AI Workforce", "AI 劳动力网络", "任务大厅", "人才匹配", "企业服务", "MVP"],
  openGraph: {
    title: "AI Workforce",
    description: "企业按结果调用 AI 劳动力，个人用技能接入网络获得收入。",
    type: "website",
    locale: "zh_CN"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={inter.className}>{children}</body></html>;
}
