import type { ClientTier } from "@/types";

interface TierInput {
  session_price: number;
  sessions_per_week: number;
  payment_model: "per_session" | "monthly" | "upfront";
  attendance_rate: number;
}

export function calculateTier(
  client: TierInput
): { tier: ClientTier; score: number } {
  const priceScore =
    client.session_price >= 100
      ? 40
      : client.session_price >= 60
        ? 24
        : 12;

  const freqScore =
    client.sessions_per_week > 3
      ? 30
      : client.sessions_per_week >= 2
        ? 18
        : 9;

  const paymentScore =
    client.payment_model === "upfront"
      ? 20
      : client.payment_model === "monthly"
        ? 12
        : 6;

  const consistencyBonus =
    client.attendance_rate >= 90 ? 10 : client.attendance_rate >= 70 ? 5 : 0;

  const score = priceScore + freqScore + paymentScore + consistencyBonus;
  const tier: ClientTier =
    score >= 70 ? "diamond" : score >= 40 ? "gold" : "silver";

  return { tier, score };
}

export const TIER_CONFIG = {
  diamond: {
    label: "Diamond",
    icon: "Gem",
    bgClass: "bg-gradient-to-r from-[#CCFF00] to-[#FACC15]",
    textClass: "text-black",
    sortOrder: 0,
  },
  gold: {
    label: "Gold",
    icon: "Star",
    bgClass: "bg-[#FACC15]",
    textClass: "text-black",
    sortOrder: 1,
  },
  silver: {
    label: "Silver",
    icon: "Medal",
    bgClass: "bg-[#9CA3AF]",
    textClass: "text-black",
    sortOrder: 2,
  },
} as const;
