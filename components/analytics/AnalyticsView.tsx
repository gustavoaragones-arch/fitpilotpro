"use client";

import { useState } from "react";
import { DollarSign, Calendar, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalyticsData, type DateRange } from "@/hooks/useAnalytics";
import { useUnitSystem } from "@/hooks/useUnitSystem";
import { formatCurrency } from "@/lib/units";
import { RevenueChart } from "./RevenueChart";
import { TierPieChart } from "./TierPieChart";
import { SessionsByDayChart } from "./SessionsByDayChart";
import { TopClientsTable } from "./TopClientsTable";

const RANGES: { value: DateRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

function KpiSkeleton() {
  return (
    <div className="rounded-2xl p-5 border border-[#3A3A3A] bg-[#2A2A2A] animate-pulse">
      <div className="w-8 h-8 bg-[#3A3A3A] rounded-lg mb-4" />
      <div className="w-20 h-7 bg-[#3A3A3A] rounded mb-2" />
      <div className="w-28 h-3.5 bg-[#3A3A3A] rounded" />
    </div>
  );
}

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl animate-pulse"
      style={{ height }}
    />
  );
}

export function AnalyticsView() {
  const [range, setRange] = useState<DateRange>("month");
  const { data, isLoading } = useAnalyticsData(range);
  const { currency } = useUnitSystem();

  const rangeLabel =
    RANGES.find((r) => r.value === range)?.label ?? "Period";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>

        {/* Range tabs */}
        <div className="flex bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-1 gap-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={cn(
                "px-4 py-1.5 text-sm font-semibold rounded-lg transition-all min-h-[36px]",
                range === r.value
                  ? "bg-[#CCFF00] text-[#000000]"
                  : "text-[#A0A0A0] hover:text-white"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 — Total Revenue (lime) */}
          <div className="bg-[#CCFF00] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-black/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#000000]/70" />
              </div>
              <span className="text-xs font-semibold text-[#000000]/60 bg-black/10 px-2 py-0.5 rounded-full">
                {rangeLabel}
              </span>
            </div>
            <p className="text-3xl font-bold text-[#000000]">
              {formatCurrency(data?.totalRevenue ?? 0, currency)}
            </p>
            <p className="text-sm font-medium text-[#000000]/70 mt-1">
              Total Revenue
            </p>
          </div>

          {/* Card 2 — Sessions Completed */}
          <div className="bg-[#2A2A2A] rounded-2xl p-5 border border-[#3A3A3A]">
            <div className="mb-3">
              <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#CCFF00]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
              {data?.sessionsCompleted ?? 0}
            </p>
            <p className="text-sm text-[#A0A0A0] mt-1">Sessions Completed</p>
          </div>

          {/* Card 3 — Completion Rate */}
          <div className="bg-[#2A2A2A] rounded-2xl p-5 border border-[#3A3A3A]">
            <div className="mb-3">
              <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#CCFF00]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
              {data?.completionRate ?? 0}%
            </p>
            <p className="text-sm text-[#A0A0A0] mt-1">Completion Rate</p>
          </div>

          {/* Card 4 — Avg Session Price */}
          <div className="bg-[#2A2A2A] rounded-2xl p-5 border border-[#3A3A3A]">
            <div className="mb-3">
              <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#CCFF00]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(data?.avgSessionPrice ?? 0, currency)}
            </p>
            <p className="text-sm text-[#A0A0A0] mt-1">Avg Session Price</p>
          </div>
        </div>
      )}

      {/* Revenue + Tier charts */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <ChartSkeleton height={280} />
          <ChartSkeleton height={280} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <RevenueChart data={data?.revenueByTime ?? []} currency={currency} />
          <TierPieChart data={data?.revenueByTier ?? []} currency={currency} />
        </div>
      )}

      {/* Sessions by day */}
      {isLoading ? (
        <ChartSkeleton height={220} />
      ) : (
        <SessionsByDayChart data={data?.sessionsByDay ?? []} />
      )}

      {/* Top clients */}
      {isLoading ? (
        <ChartSkeleton height={240} />
      ) : (
        <TopClientsTable clients={data?.topClients ?? []} currency={currency} />
      )}
    </div>
  );
}
