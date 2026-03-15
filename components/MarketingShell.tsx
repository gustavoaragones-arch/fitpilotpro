"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const MARKETING_PATHS = ["/", "/pricing", "/terms", "/privacy", "/disclaimer", "/cookies"];

export function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMarketing = MARKETING_PATHS.includes(pathname);

  if (!isMarketing) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
