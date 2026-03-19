"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <QueryProvider>
      <div className="min-h-screen bg-[#1A1A1A]">
        <div className="hidden md:block">
          <Sidebar onExpandChange={setSidebarExpanded} />
        </div>

        <main
          className={cn(
            "min-h-screen transition-[margin] duration-200 ease-out",
            "hidden md:block",
            sidebarExpanded ? "ml-[220px]" : "ml-16"
          )}
        >
          <div className="px-8 py-8">{children}</div>
        </main>

        <main className="md:hidden min-h-screen">
          <div className="px-4 py-6 pb-24">{children}</div>
        </main>

        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </QueryProvider>
  );
}
