"use client";

import {
  MapPin,
  Mail,
  Phone,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Client } from "@/types";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-[#4ADE80]/10 text-[#4ADE80]",
    inactive: "bg-[#6B7280]/10 text-[#6B7280]",
    prospect: "bg-[#FACC15]/10 text-[#FACC15]",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? "bg-[#3A3A3A] text-[#A0A0A0]"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
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
    <div className="w-11 h-11 rounded-full bg-[#CCFF00]/15 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-[#CCFF00]">{initials}</span>
    </div>
  );
}

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4 hover:border-[#CCFF00]/20 transition-all duration-150 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar fullName={client.full_name} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {client.full_name}
            </p>
            <p className="text-xs text-[#A0A0A0] truncate mt-0.5 capitalize">
              {client.goal?.replace(/_/g, " ") ?? "General fitness"}
            </p>
          </div>
        </div>

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-[#3A3A3A] transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-xl z-20 overflow-hidden w-36">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#313131] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {client.email && (
          <p className="flex items-center gap-2 text-xs text-[#A0A0A0] truncate">
            <Mail className="w-3 h-3 flex-shrink-0" /> {client.email}
          </p>
        )}
        {client.phone && (
          <p className="flex items-center gap-2 text-xs text-[#A0A0A0]">
            <Phone className="w-3 h-3 flex-shrink-0" /> {client.phone}
          </p>
        )}
        {client.preferred_location && (
          <p className="flex items-center gap-2 text-xs text-[#A0A0A0] capitalize">
            <MapPin className="w-3 h-3 flex-shrink-0" />{" "}
            {client.preferred_location}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#3A3A3A]">
        <span className="text-sm font-semibold text-[#CCFF00]">
          ${client.session_price}
          <span className="text-xs font-normal text-[#555] ml-1">
            /session
          </span>
        </span>
        <StatusPill status={client.status} />
      </div>
    </div>
  );
}
