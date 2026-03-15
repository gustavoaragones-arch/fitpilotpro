"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  TrendingUp,
  BarChart3,
  Bot,
  Share2,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/routines", label: "Routines", icon: Dumbbell },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ai-scheduler", label: "AI Scheduler", icon: Bot },
  { href: "/social-export", label: "Social Export", icon: Share2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-[220px] min-h-screen bg-[#111111] border-r border-[#3A3A3A] flex flex-col fixed left-0 top-0 z-40">
      <div className="p-5 border-b border-[#3A3A3A]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="FitPilot Pro"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <div className="leading-none">
            <div className="font-bold text-white text-sm">FitPilot</div>
            <div className="text-[10px] text-[#CCFF00] font-bold tracking-[0.15em] mt-0.5">
              PRO
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 min-h-[44px] group",
                active
                  ? "bg-[#CCFF00] text-black"
                  : "text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <span className="text-black/60">›</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#3A3A3A] space-y-0.5">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A] transition-all min-h-[44px]"
        >
          <Globe className="w-4 h-4" />
          <span>English</span>
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A0A0A0] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
