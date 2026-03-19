"use client";

import { useState } from "react";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client } from "@/types";

const TIER_BADGE: Record<
  "diamond" | "gold" | "silver",
  { text: string; bg: string }
> = {
  diamond: {
    text: "text-[#CCFF00]",
    bg: "bg-[#CCFF00]/10 border border-[#CCFF00]/20",
  },
  gold: {
    text: "text-[#FACC15]",
    bg: "bg-[#FACC15]/10 border border-[#FACC15]/20",
  },
  silver: {
    text: "text-[#9CA3AF]",
    bg: "bg-[#9CA3AF]/10 border border-[#9CA3AF]/20",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface ClientSelectorProps {
  clients: Pick<Client, "id" | "full_name" | "tier" | "status">[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export function ClientSelector({
  clients,
  selectedId,
  onSelect,
  isLoading,
}: ClientSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? clients.filter((c) =>
        c.full_name.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  if (isLoading) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4 h-full">
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#3A3A3A] rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-3.5 w-24 bg-[#3A3A3A] rounded" />
                <div className="h-3 w-16 bg-[#3A3A3A] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl flex flex-col h-full">
      <div className="p-4 border-b border-[#3A3A3A]">
        <p className="text-sm font-semibold text-white mb-3">Clients</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg pl-8 pr-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="p-4 text-center">
            <User className="w-8 h-8 text-[#555] mx-auto mb-2" />
            <p className="text-sm text-[#A0A0A0]">
              {search ? "No clients found" : "No active clients"}
            </p>
          </div>
        ) : (
          filtered.map((client) => {
            const tier = TIER_BADGE[client.tier];
            const selected = selectedId === client.id;
            return (
              <button
                key={client.id}
                type="button"
                onClick={() => onSelect(client.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all min-h-[44px] text-left",
                  selected
                    ? "bg-[#CCFF00]/5 border-l-2 border-[#CCFF00]"
                    : "hover:bg-[#313131] border-l-2 border-transparent"
                )}
              >
                <div className="w-9 h-9 bg-[#3A3A3A] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">
                    {getInitials(client.full_name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      selected ? "text-white" : "text-[#A0A0A0]"
                    )}
                  >
                    {client.full_name}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${tier.bg} ${tier.text}`}
                  >
                    {client.tier}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
