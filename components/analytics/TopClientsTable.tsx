"use client";

import { Users } from "lucide-react";
import { formatCurrency, type Currency } from "@/lib/units";

const TIER_BADGE: Record<string, { text: string; bg: string }> = {
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

interface TopClient {
  client_id: string;
  full_name: string;
  tier: string;
  sessions: number;
  revenue: number;
}

interface TopClientsTableProps {
  clients: TopClient[];
  currency: Currency;
}

export function TopClientsTable({ clients, currency }: TopClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-8 text-center">
        <Users className="w-8 h-8 text-[#555] mx-auto mb-2" />
        <p className="text-sm text-[#A0A0A0]">
          No completed sessions in this period
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#3A3A3A]">
        <p className="text-sm font-semibold text-white">
          Top Clients by Revenue
        </p>
      </div>
      <div className="divide-y divide-[#3A3A3A]">
        {clients.map((client, i) => {
          const tier = TIER_BADGE[client.tier] ?? TIER_BADGE.silver;
          const rankStyle =
            i === 0
              ? "bg-[#CCFF00] text-[#000000]"
              : "bg-[#2A2A2A] border border-[#3A3A3A] text-[#A0A0A0]";
          return (
            <div
              key={client.client_id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-[#313131] transition-colors"
            >
              {/* Rank badge */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${rankStyle}`}
              >
                <span className="text-xs font-bold">{i + 1}</span>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 bg-[#3A3A3A] rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">
                  {getInitials(client.full_name)}
                </span>
              </div>

              {/* Name + tier */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {client.full_name}
                </p>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${tier.bg} ${tier.text}`}
                >
                  {client.tier}
                </span>
              </div>

              {/* Sessions */}
              <div className="text-right shrink-0">
                <p className="text-xs text-[#A0A0A0]">
                  {client.sessions} session{client.sessions !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Revenue */}
              <div className="text-right shrink-0 w-20">
                <p className="text-sm font-bold text-[#CCFF00]">
                  {formatCurrency(client.revenue, currency)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
