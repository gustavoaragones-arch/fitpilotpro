"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { startOfMonth, endOfMonth, format } from "date-fns";
import type { SessionNeighbor } from "@/lib/travel";

export function useMonthSessions(year: number, month: number) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["sessions-month", year, month],
    queryFn: async () => {
      const start = startOfMonth(new Date(year, month)).toISOString();
      const end = endOfMonth(new Date(year, month)).toISOString();

      const { data, error } = await supabase
        .from("sessions")
        .select("id, scheduled_at, status, client_id")
        .gte("scheduled_at", start)
        .lte("scheduled_at", end)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useDaySessions(date: Date) {
  const supabase = createClient();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return useQuery({
    queryKey: ["sessions-day", format(date, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
          id,
          scheduled_at,
          duration_minutes,
          status,
          payment_status,
          location_type,
          location,
          price,
          notes,
          trainer_notes,
          client_id,
          clients (
            id,
            full_name,
            tier,
            preferred_location,
            address,
            session_price
          )
        `
        )
        .gte("scheduled_at", dayStart.toISOString())
        .lte("scheduled_at", dayEnd.toISOString())
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useDaySessionsAsNeighbors(date: Date): SessionNeighbor[] {
  const { data = [] } = useDaySessions(date);
  return (data as { id: string; scheduled_at: string; location: string | null; location_type: string | null; clients: { full_name: string; address?: string | null; preferred_location?: string | null } | { full_name: string; address?: string | null; preferred_location?: string | null }[] | null }[]).map(
    (s) => {
      const c = Array.isArray(s.clients) ? s.clients[0] : s.clients;
      return {
        id: s.id,
        clientName: c?.full_name ?? "Unknown",
        scheduledAt: s.scheduled_at,
        address: s.location ?? c?.address ?? null,
        locationType: s.location_type ?? c?.preferred_location ?? null,
      };
    }
  );
}

export function useClientsForSelect() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["clients-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, session_price, preferred_location, address")
        .eq("status", "active")
        .order("full_name", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });
}

export function useDeleteSession() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-day"] });
      queryClient.invalidateQueries({ queryKey: ["sessions-month"] });
      queryClient.invalidateQueries({ queryKey: ["todays-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
