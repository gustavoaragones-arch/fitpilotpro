"use client";

import { Gem, Star, Medal } from "lucide-react";
import type { ClientTier } from "@/types";
import { TIER_CONFIG } from "@/lib/tier-calculator";
import { cn } from "@/lib/utils";

const TIER_ICONS = {
  diamond: Gem,
  gold: Star,
  silver: Medal,
};

interface ClientTierBadgeProps {
  tier: ClientTier;
  size?: "sm" | "md";
}

export function ClientTierBadge({ tier, size = "sm" }: ClientTierBadgeProps) {
  const config = TIER_CONFIG[tier];
  const Icon = TIER_ICONS[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold rounded-full",
        config.bgClass,
        config.textClass,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {config.label}
    </span>
  );
}
