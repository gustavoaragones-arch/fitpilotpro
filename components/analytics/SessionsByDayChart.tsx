"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";
import { CHART_CONFIG } from "@/lib/chartConfig";

interface SessionsByDayChartProps {
  data: { day: string; count: number }[];
}

export function SessionsByDayChart({ data }: SessionsByDayChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-5">
      <p className="text-sm font-semibold text-white mb-4">
        Sessions by Day of Week
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid {...CHART_CONFIG.grid} vertical={false} />
          <XAxis
            dataKey="day"
            tick={CHART_CONFIG.axis.tick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={CHART_CONFIG.axis.tick}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={CHART_CONFIG.tooltip.contentStyle}
            cursor={{ fill: "#3A3A3A" }}
            formatter={(v) => [Number(v), "Sessions"]}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  activeIndex === index
                    ? CHART_CONFIG.colors.primary
                    : `${CHART_CONFIG.colors.primary}99`
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
