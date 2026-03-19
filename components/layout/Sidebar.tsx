"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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

const NAV_ITEMS = [
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

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

export function Sidebar({ onExpandChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expand = () => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    setExpanded(true);
    onExpandChange?.(true);
  };

  const collapse = () => {
    collapseTimer.current = setTimeout(() => {
      setExpanded(false);
      onExpandChange?.(false);
    }, 100);
  };

  useEffect(
    () => () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    },
    []
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      onMouseEnter={expand}
      onMouseLeave={collapse}
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col",
        "bg-[#111111] border-r border-[#222]",
        "transition-[width] duration-200 ease-out overflow-hidden",
        expanded ? "w-[220px]" : "w-16"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-[#222] flex-shrink-0 transition-all duration-200",
          expanded ? "px-5 py-5" : "py-5 justify-center"
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center",
            expanded ? "gap-3" : "justify-center w-full"
          )}
        >
          <Image
            src="/logo.png"
            alt="FitPilot Pro"
            width={32}
            height={32}
            className="rounded-lg flex-shrink-0"
            priority
          />
          <div
            className={cn(
              "leading-none overflow-hidden whitespace-nowrap transition-all duration-200",
              expanded ? "opacity-100 w-auto ml-0" : "opacity-0 w-0"
            )}
          >
            <div className="font-bold text-white text-sm">FitPilot</div>
            <div className="text-[10px] text-[#CCFF00] font-bold tracking-[0.15em] mt-0.5">
              PRO
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <div key={href} className="relative group/item">
            <Link
              href={href}
              className={cn(
                "flex items-center rounded-lg transition-all duration-150 min-h-[44px] overflow-hidden",
                expanded ? "px-3 gap-3" : "justify-center px-2",
                isActive(href)
                  ? "bg-[#CCFF00] text-black"
                  : "text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]"
              )}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 transition-colors duration-150",
                  expanded ? "w-4 h-4" : "w-5 h-5",
                  isActive(href)
                    ? "text-black"
                    : "text-[#A0A0A0] group-hover/item:text-white"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap transition-all duration-200 overflow-hidden",
                  expanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                )}
              >
                {label}
              </span>
              {expanded && isActive(href) && (
                <span className="ml-auto text-black/40 text-sm">›</span>
              )}
            </Link>

            {!expanded && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                              pointer-events-none opacity-0 group-hover/item:opacity-100
                              transition-opacity duration-150"
              >
                <div className="bg-[#1E1E1E] border border-[#2A2A2A] text-white text-xs
                                font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                  {label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2
                                  border-4 border-transparent border-r-[#2A2A2A]" />
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="py-3 px-2 border-t border-[#222] space-y-0.5 flex-shrink-0">
        <div className="relative group/lang">
          <button
            className={cn(
              "w-full flex items-center rounded-lg text-[#A0A0A0] hover:text-white",
              "hover:bg-[#1E1E1E] transition-all min-h-[44px] overflow-hidden",
              expanded ? "px-3 gap-3" : "justify-center px-2"
            )}
          >
            <Globe
              className={cn("flex-shrink-0", expanded ? "w-4 h-4" : "w-5 h-5")}
            />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap transition-all duration-200 overflow-hidden",
                expanded ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}
            >
              English
            </span>
          </button>
          {!expanded && (
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                            pointer-events-none opacity-0 group-hover/lang:opacity-100
                            transition-opacity duration-150"
            >
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] text-white text-xs
                              font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                Language: English
                <div className="absolute right-full top-1/2 -translate-y-1/2
                                border-4 border-transparent border-r-[#2A2A2A]" />
              </div>
            </div>
          )}
        </div>

        <div className="relative group/out">
          <button
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center rounded-lg text-[#A0A0A0]",
              "hover:text-[#EF4444] hover:bg-[#EF4444]/10",
              "transition-all min-h-[44px] overflow-hidden",
              expanded ? "px-3 gap-3" : "justify-center px-2"
            )}
          >
            <LogOut
              className={cn("flex-shrink-0", expanded ? "w-4 h-4" : "w-5 h-5")}
            />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap transition-all duration-200 overflow-hidden",
                expanded ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}
            >
              Sign Out
            </span>
          </button>
          {!expanded && (
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                            pointer-events-none opacity-0 group-hover/out:opacity-100
                            transition-opacity duration-150"
            >
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] text-white text-xs
                              font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                Sign Out
                <div className="absolute right-full top-1/2 -translate-y-1/2
                                border-4 border-transparent border-r-[#2A2A2A]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
