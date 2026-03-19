"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
  format,
  parseISO,
  getDay,
} from "date-fns";

export type DateRange = "week" | "month" | "quarter" | "year";

function getDateBounds(range: DateRange): { start: Date; end: Date } {
  const now = new Date();
  switch (range) {
    case "week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "quarter":
      return { start: subDays(now, 90), end: now };
    case "year":
      return { start: subMonths(now, 12), end: now };
  }
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type SessionRow = {
  id: string;
  scheduled_at: string;
  status: string;
  price: number | null;
  client_id: string | null;
  clients: { id: string; full_name: string; tier: string } | null;
};

export function useAnalyticsData(range: DateRange) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["analytics", range],
    queryFn: async () => {
      const { start, end } = getDateBounds(range);

      const { data: sessions, error } = await supabase
        .from("sessions")
        .select(
          `
          id,
          scheduled_at,
          status,
          price,
          client_id,
          clients (
            id,
            full_name,
            tier
          )
        `
        )
        .gte("scheduled_at", start.toISOString())
        .lte("scheduled_at", end.toISOString());

      if (error) throw error;

      const rows = (sessions ?? []) as unknown as SessionRow[];
      const completed = rows.filter((s) => s.status === "completed");

      // KPI metrics
      const totalRevenue = completed.reduce((sum, s) => sum + (s.price ?? 0), 0);
      const sessionsCompleted = completed.length;
      const completionRate =
        rows.length > 0
          ? Math.round((completed.length / rows.length) * 100)
          : 0;
      const avgSessionPrice =
        completed.length > 0
          ? Math.round(totalRevenue / completed.length)
          : 0;

      // Revenue over time
      const revenueMap: Record<string, number> = {};
      for (const s of completed) {
        let key: string;
        if (range === "year") {
          key = format(parseISO(s.scheduled_at), "MMM yyyy");
        } else if (range === "quarter") {
          // Group by week
          key = format(
            startOfWeek(parseISO(s.scheduled_at), { weekStartsOn: 1 }),
            "MMM d"
          );
        } else {
          key = format(parseISO(s.scheduled_at), "MMM d");
        }
        revenueMap[key] = (revenueMap[key] ?? 0) + (s.price ?? 0);
      }
      const revenueByTime = Object.entries(revenueMap)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Revenue by tier
      const tierMap: Record<string, { revenue: number; count: number }> = {
        diamond: { revenue: 0, count: 0 },
        gold: { revenue: 0, count: 0 },
        silver: { revenue: 0, count: 0 },
      };
      for (const s of completed) {
        const clientData = Array.isArray(s.clients) ? s.clients[0] : s.clients;
        const tier = clientData?.tier ?? "silver";
        if (tier in tierMap) {
          tierMap[tier].revenue += s.price ?? 0;
          tierMap[tier].count += 1;
        }
      }
      const revenueByTier = [
        { tier: "diamond", label: "Diamond", ...tierMap.diamond },
        { tier: "gold", label: "Gold", ...tierMap.gold },
        { tier: "silver", label: "Silver", ...tierMap.silver },
      ].filter((t) => t.revenue > 0 || t.count > 0);

      // Sessions by day of week (all sessions, not just completed)
      const dowMap: Record<number, number> = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };
      for (const s of rows) {
        const dow = getDay(parseISO(s.scheduled_at));
        dowMap[dow] = (dowMap[dow] ?? 0) + 1;
      }
      const sessionsByDay = DAY_NAMES.map((day, i) => ({
        day,
        count: dowMap[i] ?? 0,
      }));

      // Top 5 clients by revenue
      const clientMap: Record<
        string,
        { full_name: string; tier: string; sessions: number; revenue: number }
      > = {};
      for (const s of completed) {
        if (!s.client_id) continue;
        const clientData = Array.isArray(s.clients) ? s.clients[0] : s.clients;
        if (!clientMap[s.client_id]) {
          clientMap[s.client_id] = {
            full_name: clientData?.full_name ?? "Unknown",
            tier: clientData?.tier ?? "silver",
            sessions: 0,
            revenue: 0,
          };
        }
        clientMap[s.client_id].sessions += 1;
        clientMap[s.client_id].revenue += s.price ?? 0;
      }
      const topClients = Object.entries(clientMap)
        .map(([client_id, v]) => ({ client_id, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      return {
        totalRevenue,
        sessionsCompleted,
        completionRate,
        avgSessionPrice,
        revenueByTime,
        revenueByTier,
        sessionsByDay,
        topClients,
      };
    },
    staleTime: 60_000,
  });
}
