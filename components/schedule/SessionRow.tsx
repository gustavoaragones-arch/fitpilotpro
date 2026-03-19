"use client";

import { format } from "date-fns";
import {
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    scheduled: "bg-[#60A5FA]/10 text-[#60A5FA]",
    completed: "bg-[#4ADE80]/10 text-[#4ADE80]",
    cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
    no_show: "bg-[#6B7280]/10 text-[#6B7280]",
  };
  const labels: Record<string, string> = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No Show",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${map[status] ?? "bg-[#3A3A3A] text-[#A0A0A0]"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function PaymentPill({ status }: { status: string }) {
  if (status === "paid")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#4ADE80]/10 text-[#4ADE80]">
        Paid
      </span>
    );
  if (status === "unpaid")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444]">
        Unpaid
      </span>
    );
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6B7280]/10 text-[#6B7280]">
      Waived
    </span>
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

export type SessionRowSession = {
  id: string;
  client_id?: string | null;
  scheduled_at: string;
  duration_minutes?: number;
  status: string;
  payment_status: string;
  location_type?: string | null;
  location?: string | null;
  price?: number | null;
  notes?: string | null;
  trainer_notes?: string | null;
  clients?: { full_name: string } | { full_name: string }[] | null;
};

interface SessionRowProps {
  session: SessionRowSession;
  onEdit: () => void;
}

function getClient(
  session: SessionRowProps["session"]
): { full_name: string } | null {
  const c = session.clients;
  if (!c) return null;
  return Array.isArray(c) ? c[0] ?? null : c;
}

export function SessionRow({ session, onEdit }: SessionRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["sessions-day"] });
    queryClient.invalidateQueries({ queryKey: ["sessions-month"] });
    queryClient.invalidateQueries({ queryKey: ["todays-sessions"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const markComplete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("sessions")
        .update({ status: "completed" })
        .eq("id", session.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const markPaid = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("sessions")
        .update({ payment_status: "paid" })
        .eq("id", session.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", session.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const client = getClient(session);
  const startTime = new Date(session.scheduled_at);
  const endTime = new Date(
    startTime.getTime() + (session.duration_minutes ?? 60) * 60000
  );

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 hover:bg-[#313131] transition-colors group relative",
        menuOpen && "z-10"
      )}
    >
      <div className="w-14 flex-shrink-0 text-center">
        <p className="text-sm font-semibold text-white">
          {format(startTime, "h:mm")}
        </p>
        <p className="text-[10px] text-[#555]">{format(startTime, "a")}</p>
      </div>
      <div className="w-px h-10 bg-[#3A3A3A] flex-shrink-0" />
      {client && <Avatar fullName={client.full_name} />}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {client?.full_name ?? "Unknown Client"}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {session.location_type && (
            <span className="flex items-center gap-1 text-xs text-[#A0A0A0]">
              <MapPin className="w-3 h-3" />
              <span className="capitalize">{session.location_type}</span>
            </span>
          )}
          <span className="text-xs text-[#555]">·</span>
          <span className="text-xs text-[#A0A0A0]">
            {format(startTime, "h:mm")} – {format(endTime, "h:mm a")}
          </span>
          <span className="text-xs text-[#555]">·</span>
          <span className="text-xs text-[#A0A0A0]">
            {session.duration_minutes ?? 60} min
          </span>
        </div>
      </div>
      <div className="hidden sm:block flex-shrink-0">
        <span className="text-sm font-semibold text-[#CCFF00]">
          ${session.price ?? 0}
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <StatusPill status={session.status} />
        <PaymentPill status={session.payment_status} />
      </div>
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-[#3A3A3A] transition-all opacity-0 group-hover:opacity-100 min-h-[44px]"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-xl z-50 overflow-hidden w-44">
            {session.status !== "completed" && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  markComplete.mutate();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#4ADE80] hover:bg-[#4ADE80]/10 transition-colors min-h-[44px]"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
              </button>
            )}
            {session.payment_status !== "paid" && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  markPaid.mutate();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#4ADE80] hover:bg-[#4ADE80]/10 transition-colors min-h-[44px]"
              >
                <DollarSign className="w-3.5 h-3.5" /> Mark Paid
              </button>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#313131] transition-colors min-h-[44px]"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Session
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                if (
                  typeof window !== "undefined" &&
                  window.confirm("Delete this session?")
                ) {
                  deleteMutation.mutate();
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors min-h-[44px]"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
