"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { TrendingDown, TrendingUp, Minus, Activity } from "lucide-react";
import { CHART_CONFIG } from "@/lib/chartConfig";
import type { ProgressRecord } from "@/types";

interface ProgressChartsProps {
  records: ProgressRecord[];
}

function DeltaStat({
  label,
  firstVal,
  lastVal,
  unit,
  lowerIsBetter,
}: {
  label: string;
  firstVal: number | null;
  lastVal: number | null;
  unit: string;
  lowerIsBetter: boolean;
}) {
  if (firstVal === null || lastVal === null) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
        <p className="text-xs text-[#A0A0A0] mb-1">{label}</p>
        <p className="text-lg font-bold text-white">
          {lastVal !== null ? `${lastVal}${unit}` : "—"}
        </p>
        <p className="text-xs text-[#555] mt-0.5">No data</p>
      </div>
    );
  }

  const delta = lastVal - firstVal;
  if (delta === 0) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
        <p className="text-xs text-[#A0A0A0] mb-1">{label}</p>
        <p className="text-lg font-bold text-white">
          {lastVal}
          {unit}
        </p>
        <p className="text-xs text-[#555] mt-0.5 flex items-center gap-0.5">
          <Minus className="w-3 h-3" /> No change
        </p>
      </div>
    );
  }

  const improved = lowerIsBetter ? delta < 0 : delta > 0;
  const color = improved ? "text-[#4ADE80]" : "text-[#EF4444]";

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
      <p className="text-xs text-[#A0A0A0] mb-1">{label}</p>
      <p className="text-lg font-bold text-white">
        {lastVal}
        {unit}
      </p>
      <p className={`text-xs font-semibold mt-0.5 flex items-center gap-0.5 ${color}`}>
        {delta < 0 ? (
          <TrendingDown className="w-3 h-3" />
        ) : (
          <TrendingUp className="w-3 h-3" />
        )}
        {delta > 0 ? "+" : ""}
        {delta.toFixed(1)}
        {unit}
      </p>
    </div>
  );
}

export function ProgressCharts({ records }: ProgressChartsProps) {
  if (records.length === 0) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-12 text-center">
        <Activity className="w-10 h-10 text-[#555] mx-auto mb-3" />
        <p className="text-white font-semibold mb-1">No progress records yet</p>
        <p className="text-sm text-[#A0A0A0]">
          Add the first record to start tracking progress
        </p>
      </div>
    );
  }

  const chartData = records.map((r) => ({
    date: format(parseISO(r.recorded_at), "MMM d"),
    weight: r.weight_lbs,
    bodyFat: r.body_fat_pct,
  }));

  const first = records[0];
  const last = records[records.length - 1];

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <DeltaStat
          label="Weight (lbs)"
          firstVal={first.weight_lbs}
          lastVal={last.weight_lbs}
          unit=" lbs"
          lowerIsBetter={true}
        />
        <DeltaStat
          label="Body Fat"
          firstVal={first.body_fat_pct}
          lastVal={last.body_fat_pct}
          unit="%"
          lowerIsBetter={true}
        />
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
          <p className="text-xs text-[#A0A0A0] mb-1">Check-ins</p>
          <p className="text-lg font-bold text-white">{records.length}</p>
          <p className="text-xs text-[#555] mt-0.5">Total records</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weight chart */}
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
          <p className="text-sm font-semibold text-white mb-4">Weight (lbs)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid {...CHART_CONFIG.grid} />
              <XAxis dataKey="date" {...CHART_CONFIG.xAxis} />
              <YAxis {...CHART_CONFIG.yAxis} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={CHART_CONFIG.tooltip.contentStyle}
                cursor={CHART_CONFIG.tooltip.cursor}
                formatter={(v) => [`${Number(v)} lbs`, "Weight"]}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke={CHART_CONFIG.colors.primary}
                strokeWidth={2}
                dot={{ fill: "#fff", r: 3 }}
                activeDot={{ r: 5, fill: CHART_CONFIG.colors.primary }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Body fat chart */}
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
          <p className="text-sm font-semibold text-white mb-4">Body Fat (%)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid {...CHART_CONFIG.grid} />
              <XAxis dataKey="date" {...CHART_CONFIG.xAxis} />
              <YAxis {...CHART_CONFIG.yAxis} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={CHART_CONFIG.tooltip.contentStyle}
                cursor={CHART_CONFIG.tooltip.cursor}
                formatter={(v) => [`${Number(v)}%`, "Body Fat"]}
              />
              <Line
                type="monotone"
                dataKey="bodyFat"
                stroke={CHART_CONFIG.colors.secondary}
                strokeWidth={2}
                dot={{ fill: "#fff", r: 3 }}
                activeDot={{ r: 5, fill: CHART_CONFIG.colors.secondary }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
