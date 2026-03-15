"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";

export function useSubscription() {
  const supabase = createClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });
  const tier = (profile?.subscription_tier ?? "free") as SubscriptionTier;
  const limits = TIER_LIMITS[tier];

  return {
    tier,
    profile,
    isLoading,
    canAccess: (feature: string) => limits.features.includes(feature),
    isAtClientLimit: (count: number) => count >= limits.maxClients,
    maxClients: limits.maxClients,
    isPro: tier !== "free",
    isElite: tier === "elite" || tier === "studio",
    isStudio: tier === "studio",
  };
}
