"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MapPin, ChevronRight, Plus, Calendar } from "lucide-react";
import { useTodaysSessions } from "@/hooks/useDashboard";

type ClientRef = { id: string; full_name: string; tier: string };
type SessionRow = {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  payment_status: string;
  location_type: string | null;
  location: string | null;
  price: number | null;
  clients: ClientRef | ClientRef[] | null;
};

function getClient(row: SessionRow): ClientRef | null {
  const c = row.clients;
  if (!c) return null;
  return Array.isArray(c) ? c[0] ?? null : c;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    scheduled: "bg-[#60A5FA]/10 text-[#60A5FA]",
    completed: "bg-[#4ADE80]/10 text-[#4ADE80]",
    cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
    no_show: "bg-[#6B7280]/10 text-[#6B7280]",
  };
  const label: Record<string, string> = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No Show",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? "bg-[#3A3A3A] text-[#A0A0A0]"}`}
    >
      {label[status] ?? status}
    </span>
  );
}

function PaymentPill({ status }: { status: string }) {
  if (status === "paid") {
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#4ADE80]/10 text-[#4ADE80]">
        Paid
      </span>
    );
  }
  if (status === "unpaid") {
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444]">
        Unpaid
      </span>
    );
  }
  return null;
}

function SessionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="w-10 h-10 bg-[#3A3A3A] rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-32 h-4 bg-[#3A3A3A] rounded" />
        <div className="w-48 h-3 bg-[#3A3A3A] rounded" />
      </div>
      <div className="w-16 h-5 bg-[#3A3A3A] rounded-full" />
    </div>
  );
}

function Avatar({ fullName }: { fullName: string }) {
  const parts = fullName.trim().split(" ");
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : fullName.slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-[#CCFF00]/15 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-[#CCFF00]">{initials}</span>
    </div>
  );
}

export function TodaysSchedule() {
  const { data: sessions, isLoading } = useTodaysSessions();

  return (
    <div className="bg-[#2A2A2A] rounded-2xl border border-[#3A3A3A] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#3A3A3A]">
        <div>
          <h2 className="text-base font-semibold text-white">
            Today&apos;s Schedule
          </h2>
          {!isLoading && (
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              {sessions?.length
                ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} scheduled`
                : "No sessions scheduled"}
            </p>
          )}
        </div>
        <Link
          href="/schedule"
          className="flex items-center gap-1 text-xs text-[#A0A0A0] hover:text-white transition-colors min-h-[44px] px-1 items-center"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="divide-y divide-[#3A3A3A]">
            <SessionRowSkeleton />
            <SessionRowSkeleton />
            <SessionRowSkeleton />
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="divide-y divide-[#3A3A3A]">
            {(sessions as SessionRow[]).map((session) => {
              const client = getClient(session);
              const startTime = new Date(session.scheduled_at);
              const endTime = new Date(
                startTime.getTime() + (session.duration_minutes ?? 60) * 60000
              );

              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[#313131] transition-colors"
                >
                  <div className="text-center w-12 flex-shrink-0">
                    <p className="text-sm font-semibold text-white leading-none">
                      {format(startTime, "h:mm")}
                    </p>
                    <p className="text-[10px] text-[#A0A0A0] mt-0.5">
                      {format(startTime, "a")}
                    </p>
                  </div>

                  <div className="w-px h-10 bg-[#3A3A3A] flex-shrink-0" />

                  {client && (
                    <Avatar fullName={client.full_name} />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {client?.full_name ?? "Unknown Client"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {session.location_type && (
                        <span className="flex items-center gap-1 text-xs text-[#A0A0A0]">
                          <MapPin className="w-3 h-3" />
                          {session.location_type.charAt(0).toUpperCase() +
                            session.location_type.slice(1)}
                        </span>
                      )}
                      <span className="text-xs text-[#555]">·</span>
                      <span className="text-xs text-[#A0A0A0]">
                        {format(startTime, "h:mm")} –{" "}
                        {format(endTime, "h:mm a")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusPill status={session.status} />
                    <PaymentPill status={session.payment_status} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
            <div className="w-12 h-12 bg-[#CCFF00]/10 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <p className="text-sm font-medium text-white mb-1">
              No sessions today
            </p>
            <p className="text-xs text-[#A0A0A0] mb-5">
              Your schedule is clear. Add a session to get started.
            </p>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#000000] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px] text-sm"
            >
              <Plus className="w-4 h-4" />
              Schedule Session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
