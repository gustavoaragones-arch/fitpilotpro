"use client";

import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { useDeleteProgressRecord } from "@/hooks/useProgress";
import type { ProgressRecord } from "@/types";

interface ProgressTableProps {
  records: ProgressRecord[];
  clientId: string;
}

function fmt(val: number | null): string {
  if (val === null || val === undefined) return "—";
  return val.toFixed(1);
}

export function ProgressTable({ records, clientId }: ProgressTableProps) {
  const deleteRecord = useDeleteProgressRecord();

  // Most recent first
  const sorted = [...records].reverse();

  if (sorted.length === 0) {
    return (
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-8 text-center">
        <p className="text-sm text-[#A0A0A0]">No records to display</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this progress record?")) return;
    await deleteRecord.mutateAsync({ id, clientId });
  };

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#3A3A3A]">
              {[
                "Date",
                "Weight (lbs)",
                "Body Fat %",
                "Muscle (lbs)",
                "Waist (in)",
                "Notes",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((record) => (
              <tr
                key={record.id}
                className="border-b border-[#3A3A3A] last:border-0 hover:bg-[#313131] transition-colors"
              >
                <td className="px-4 py-3 text-sm text-white whitespace-nowrap">
                  {format(parseISO(record.recorded_at), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3 text-sm text-[#A0A0A0] whitespace-nowrap">
                  {fmt(record.weight_lbs)}
                </td>
                <td className="px-4 py-3 text-sm text-[#A0A0A0] whitespace-nowrap">
                  {fmt(record.body_fat_pct)}%
                </td>
                <td className="px-4 py-3 text-sm text-[#A0A0A0] whitespace-nowrap">
                  {fmt(record.skeletal_muscle_mass_lbs)}
                </td>
                <td className="px-4 py-3 text-sm text-[#A0A0A0] whitespace-nowrap">
                  {fmt(record.waist_in)}
                </td>
                <td className="px-4 py-3 text-sm text-[#A0A0A0] max-w-[200px] truncate">
                  {record.notes ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(record.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all min-h-[44px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
