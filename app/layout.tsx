import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MarketingShell } from "@/components/MarketingShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitPilot Pro — Train Smarter. Earn More.",
  description:
    "The professional business management platform built exclusively for personal trainers. Client management, route optimization, AI scheduling, and business analytics.",
  keywords:
    "personal trainer software, fitness business management, client tracking, route optimization",
  openGraph: {
    title: "FitPilot Pro",
    description: "Train Smarter. Earn More. Live Better.",
    url: "https://fitpilotpro.app",
    siteName: "FitPilot Pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased bg-black", inter.className)}>
        <MarketingShell>{children}</MarketingShell>
      </body>
    </html>
  );
}
