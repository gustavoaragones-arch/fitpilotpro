"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_CONFIG } from "@/lib/chartConfig";
import { formatCurrency, type Currency } from "@/lib/units";

interface TierPieChartProps {
  data: { tier: string; label: string; revenue: number; count: number }[];
  currency: Currency;
}

const TIER_COLORS: Record<string, string> = {
  diamond: CHART_CONFIG.colors.diamond,
  gold: CHART_CONFIG.colors.gold,
  silver: CHART_CONFIG.colors.silver,
};

export function TierPieChart({ data, currency }: TierPieChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  if (totalRevenue === 0) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-6 h-[280px] flex flex-col items-center justify-center">
        <p className="text-sm font-semibold text-white mb-1">Revenue by Tier</p>
        <p className="text-sm text-[#555]">No revenue data for this period</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-5">
      <p className="text-sm font-semibold text-white mb-2">Revenue by Tier</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            dataKey="revenue"
            nameKey="label"
          >
            {data.map((entry) => (
              <Cell
                key={entry.tier}
                fill={TIER_COLORS[entry.tier] ?? "#6B7280"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={CHART_CONFIG.tooltip.contentStyle}
            formatter={(v, _name, props) => {
              const num = Number(v);
              const label =
                (props as { payload?: { label?: string } }).payload?.label ?? "";
              return [
                `${formatCurrency(num, currency)} (${((num / totalRevenue) * 100).toFixed(0)}%)`,
                label,
              ];
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-1 space-y-1.5">
        {data.map((d) => (
          <div key={d.tier} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: TIER_COLORS[d.tier] ?? "#6B7280" }}
              />
              <span className="text-xs text-[#A0A0A0] capitalize">
                {d.label}
              </span>
            </div>
            <span className="text-xs font-semibold text-white">
              {formatCurrency(d.revenue, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
