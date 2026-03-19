"use client";

import { Gem, Star, Medal } from "lucide-react";

const TIER_CONFIG = {
  diamond: {
    icon: Gem,
    label: "Diamond",
    iconColor: "text-[#CCFF00]",
    textColor: "text-[#CCFF00]",
    badgeClass: "bg-[#CCFF00]/10 border border-[#CCFF00]/20",
  },
  gold: {
    icon: Star,
    label: "Gold",
    iconColor: "text-[#FACC15]",
    textColor: "text-[#FACC15]",
    badgeClass: "bg-[#FACC15]/10 border border-[#FACC15]/20",
  },
  silver: {
    icon: Medal,
    label: "Silver",
    iconColor: "text-[#9CA3AF]",
    textColor: "text-[#9CA3AF]",
    badgeClass: "bg-[#9CA3AF]/10 border border-[#9CA3AF]/20",
  },
};

export function TierGroupHeader({
  tier,
  count,
}: {
  tier: string;
  count: number;
}) {
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.badgeClass}`}
      >
        <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
        <span
          className={`text-sm font-semibold ${config.textColor}`}
        >
          {config.label}
        </span>
      </div>
      <span className="text-sm text-[#555]">
        {count} client{count !== 1 ? "s" : ""}
      </span>
      <div className="flex-1 h-px bg-[#2A2A2A]" />
    </div>
  );
}
