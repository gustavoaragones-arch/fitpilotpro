import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

export function useDashboardStats() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();
      const monthStart = startOfMonth(now).toISOString();
      const monthEnd = endOfMonth(now).toISOString();
      const prevMonthStart = startOfMonth(
        new Date(now.getFullYear(), now.getMonth() - 1)
      ).toISOString();
      const prevMonthEnd = endOfMonth(
        new Date(now.getFullYear(), now.getMonth() - 1)
      ).toISOString();

      const [
        { data: weekSessions },
        { data: monthSessions },
        { data: prevMonthSessions },
        { count: activeClients },
        { data: thisWeekCompleted },
      ] = await Promise.all([
        supabase
          .from("sessions")
          .select("price, status, payment_status")
          .gte("scheduled_at", weekStart)
          .lte("scheduled_at", weekEnd),
        supabase
          .from("sessions")
          .select("price, status, payment_status")
          .gte("scheduled_at", monthStart)
          .lte("scheduled_at", monthEnd),
        supabase
          .from("sessions")
          .select("price, status")
          .gte("scheduled_at", prevMonthStart)
          .lte("scheduled_at", prevMonthEnd)
          .eq("status", "completed"),
        supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("sessions")
          .select("id, status")
          .gte("scheduled_at", weekStart)
          .lte("scheduled_at", weekEnd)
          .eq("status", "completed"),
      ]);

      type Row = { price?: number; status: string };
      const weekRevenue = (weekSessions ?? ([] as Row[]))
        .filter((s) => s.status === "completed")
        .reduce((sum, s) => sum + (s.price ?? 0), 0);

      const monthRevenue = (monthSessions ?? ([] as Row[]))
        .filter((s) => s.status === "completed")
        .reduce((sum, s) => sum + (s.price ?? 0), 0);

      const prevMonthRevenue = (prevMonthSessions ?? ([] as Row[])).reduce(
        (sum, s) => sum + (s.price ?? 0),
        0
      );

      const revenueChange =
        prevMonthRevenue > 0
          ? Math.round(
              ((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
            )
          : null;

      const totalWeekSessions = weekSessions?.length ?? 0;
      const completedWeekSessions = thisWeekCompleted?.length ?? 0;
      const completionRate =
        totalWeekSessions > 0
          ? Math.round((completedWeekSessions / totalWeekSessions) * 100)
          : null;

      return {
        weekRevenue,
        monthRevenue,
        revenueChange,
        activeClients: activeClients ?? 0,
        sessionsThisWeek: totalWeekSessions,
        completionRate,
      };
    },
    staleTime: 60_000,
  });
}

export function useTodaysSessions() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["todays-sessions"],
    queryFn: async () => {
      const now = new Date();
      const dayStart = startOfDay(now).toISOString();
      const dayEnd = endOfDay(now).toISOString();

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
          clients (
            id,
            full_name,
            tier
          )
        `
        )
        .gte("scheduled_at", dayStart)
        .lte("scheduled_at", dayEnd)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useUpcomingSessions() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["upcoming-sessions"],
    queryFn: async () => {
      const tomorrow = startOfDay(
        new Date(Date.now() + 86_400_000)
      ).toISOString();
      const in7Days = endOfDay(
        new Date(Date.now() + 7 * 86_400_000)
      ).toISOString();

      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
          id,
          scheduled_at,
          status,
          clients (
            id,
            full_name
          )
        `
        )
        .gte("scheduled_at", tomorrow)
        .lte("scheduled_at", in7Days)
        .eq("status", "scheduled")
        .order("scheduled_at", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });
}
