"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_CONFIG } from "@/lib/chartConfig";
import { formatCurrency, type Currency } from "@/lib/units";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
  currency: Currency;
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-6 h-[280px] flex items-center justify-center">
        <p className="text-sm text-[#555]">No revenue data for this period</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-5">
      <p className="text-sm font-semibold text-white mb-4">Revenue Over Time</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CCFF00" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#CCFF00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...CHART_CONFIG.grid} />
          <XAxis dataKey="date" {...CHART_CONFIG.xAxis} />
          <YAxis
            {...CHART_CONFIG.yAxis}
            tickFormatter={(v: number) =>
              formatCurrency(v, currency).replace(/\.00$/, "")
            }
          />
          <Tooltip
            contentStyle={CHART_CONFIG.tooltip.contentStyle}
            cursor={CHART_CONFIG.tooltip.cursor}
            formatter={(v) => [formatCurrency(Number(v), currency), "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_CONFIG.colors.primary}
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={{ fill: CHART_CONFIG.colors.primary, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
