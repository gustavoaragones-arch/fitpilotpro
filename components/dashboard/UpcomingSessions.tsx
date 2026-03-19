"use client";

import Link from "next/link";
import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
} from "date-fns";
import { ChevronRight, Clock } from "lucide-react";
import { useUpcomingSessions } from "@/hooks/useDashboard";

type ClientRef = { id: string; full_name: string };
type UpcomingRow = {
  id: string;
  scheduled_at: string;
  status: string;
  clients: ClientRef | ClientRef[] | null;
};

function getClient(row: UpcomingRow): ClientRef | null {
  const c = row.clients;
  if (!c) return null;
  return Array.isArray(c) ? c[0] ?? null : c;
}

function formatSessionDay(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isThisWeek(date)) return format(date, "EEEE");
  return format(date, "MMM d");
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-3 animate-pulse">
      <div className="w-8 h-8 bg-[#3A3A3A] rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="w-28 h-3.5 bg-[#3A3A3A] rounded" />
        <div className="w-20 h-3 bg-[#3A3A3A] rounded" />
      </div>
      <div className="w-14 h-3 bg-[#3A3A3A] rounded" />
    </div>
  );
}

export function UpcomingSessions() {
  const { data: sessions, isLoading } = useUpcomingSessions();

  return (
    <div className="bg-[#2A2A2A] rounded-2xl border border-[#3A3A3A] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#3A3A3A]">
        <h2 className="text-base font-semibold text-white">Upcoming</h2>
        <Link
          href="/schedule"
          className="flex items-center gap-1 text-xs text-[#A0A0A0] hover:text-white transition-colors min-h-[44px] px-1 items-center"
        >
          All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-[#3A3A3A]">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : sessions && sessions.length > 0 ? (
        <div className="divide-y divide-[#3A3A3A]">
          {(sessions as UpcomingRow[]).map((session) => {
            const client = getClient(session);
            const startTime = new Date(session.scheduled_at);
            const parts = (client?.full_name ?? "?").split(" ");
            const initials =
              parts.length >= 2
                ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                : (client?.full_name ?? "?").slice(0, 2).toUpperCase();

            return (
              <div
                key={session.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#313131] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#CCFF00]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#CCFF00]">
                    {initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {client?.full_name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-[#A0A0A0]">
                    {formatSessionDay(startTime)} ·{" "}
                    {format(startTime, "h:mm a")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Clock className="w-6 h-6 text-[#555] mb-2" />
          <p className="text-sm text-[#A0A0A0]">No upcoming sessions</p>
        </div>
      )}
    </div>
  );
}
