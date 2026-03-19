"use client";

import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";

function StatSkeleton() {
  return (
    <div className="rounded-2xl p-5 border border-[#3A3A3A] animate-pulse bg-[#2A2A2A]">
      <div className="w-8 h-8 bg-[#3A3A3A] rounded-lg mb-4" />
      <div className="w-20 h-8 bg-[#3A3A3A] rounded mb-2" />
      <div className="w-28 h-4 bg-[#3A3A3A] rounded" />
    </div>
  );
}

function TrendBadge({ value }: { value: number | null }) {
  if (value === null) return null;
  const positive = value >= 0;
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        positive
          ? "bg-[#4ADE80]/10 text-[#4ADE80]"
          : "bg-[#EF4444]/10 text-[#EF4444]"
      }`}
    >
      {positive ? "+" : ""}
      {value}%
    </span>
  );
}

export function StatsGrid() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 — Weekly Revenue (primary lime card) */}
      <div className="bg-[#CCFF00] rounded-2xl p-5 relative overflow-hidden col-span-1">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 bg-black/10 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#000000]/70" />
          </div>
          <span className="text-xs font-semibold text-[#000000]/60 bg-black/10 px-2 py-0.5 rounded-full">
            This week
          </span>
        </div>
        <p className="text-3xl font-bold text-[#000000]">
          ${(data?.weekRevenue ?? 0).toLocaleString()}
        </p>
        <p className="text-sm font-medium text-[#000000]/70 mt-1">Weekly Revenue</p>
      </div>

      {/* Card 2 — Monthly Revenue */}
      <div className="bg-[#2A2A2A] rounded-2xl p-5 border border-[#3A3A3A]">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#CCFF00]" />
          </div>
          <TrendBadge value={data?.revenueChange ?? null} />
        </div>
        <p className="text-3xl font-bold text-white">
          ${(data?.monthRevenue ?? 0).toLocaleString()}
        </p>
        <p className="text-sm text-[#A0A0A0] mt-1">Monthly Revenue</p>
      </div>

      {/* Card 3 — Active Clients */}
      <div className="bg-[#2A2A2A] rounded-2xl p-5 border border-[#3A3A3A]">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-[#CCFF00]" />
          </div>
        </div>
        <p className="text-3xl font-bold text-white">
          {data?.activeClients ?? 0}
        </p>
        <p className="text-sm text-[#A0A0A0] mt-1">Active Clients</p>
      </div>

      {/* Card 4 — Sessions This Week */}
      <div className="bg-[#2A2A2A] rounded-2xl p-5 border border-[#3A3A3A]">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#CCFF00]" />
          </div>
          {data?.completionRate !== null && data?.completionRate !== undefined && (
            <span className="text-xs font-medium text-[#A0A0A0]">
              {data.completionRate}% done
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-white">
          {data?.sessionsThisWeek ?? 0}
        </p>
        <p className="text-sm text-[#A0A0A0] mt-1">Sessions This Week</p>
      </div>
    </div>
  );
}
