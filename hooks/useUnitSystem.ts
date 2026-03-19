"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { UnitSystem, Currency } from "@/lib/units";

export function useUnitSystem() {
  const supabase = createClient();

  const { data: prefs } = useQuery({
    queryKey: ["profile-prefs"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("unit_system, currency, language")
        .eq("id", user.id)
        .single();

      return data as {
        unit_system: string | null;
        currency: string | null;
        language: string | null;
      } | null;
    },
    staleTime: 5 * 60 * 1000, // 5 min — preferences rarely change
  });

  return {
    units: ((prefs?.unit_system ?? "imperial") as UnitSystem),
    currency: ((prefs?.currency ?? "USD") as Currency),
    language: prefs?.language ?? "en",
  };
}
