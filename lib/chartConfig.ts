export const CHART_CONFIG = {
  grid: { stroke: "#3A3A3A", strokeDasharray: "3 3" },
  xAxis: {
    tick: { fill: "#A0A0A0", fontSize: 11 },
    axisLine: false as const,
    tickLine: false as const,
  },
  yAxis: {
    tick: { fill: "#A0A0A0", fontSize: 11 },
    axisLine: false as const,
    tickLine: false as const,
  },
  // Keep backwards-compatible alias
  axis: {
    tick: { fill: "#A0A0A0", fontSize: 11 },
    axisLine: false as const,
    tickLine: false as const,
  },
  tooltip: {
    contentStyle: {
      background: "#2A2A2A",
      border: "1px solid #3A3A3A",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "13px",
    },
    cursor: { stroke: "#CCFF00", strokeWidth: 1, strokeOpacity: 0.3 },
  },
  colors: {
    primary: "#CCFF00",
    secondary: "#60A5FA",
    diamond: "#CCFF00",
    gold: "#FACC15",
    silver: "#6B7280",
    success: "#4ADE80",
    error: "#EF4444",
  },
} as const;
