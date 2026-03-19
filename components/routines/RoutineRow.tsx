"use client";

import { useState } from "react";
import {
  Dumbbell,
  Clock,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
} from "lucide-react";
import type { Routine } from "@/types";

const FOCUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  upper_body: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    label: "Upper Body",
  },
  lower_body: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    label: "Lower Body",
  },
  full_body: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    label: "Full Body",
  },
  core: { bg: "bg-orange-500/10", text: "text-orange-400", label: "Core" },
  cardio: { bg: "bg-red-500/10", text: "text-red-400", label: "Cardio" },
  flexibility: {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    label: "Flexibility",
  },
};

function formatGoal(goal: string | null): string {
  if (!goal) return "General";
  return goal
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDifficulty(d: string | null): string {
  if (!d) return "";
  return d.charAt(0).toUpperCase() + d.slice(1);
}

interface RoutineRowProps {
  routine: Routine;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function RoutineRow({
  routine,
  onEdit,
  onDelete,
  onDuplicate,
}: RoutineRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const exercises = routine.routine_exercises ?? [];
  const sortedExercises = [...exercises].sort(
    (a, b) => a.order_index - b.order_index
  );
  const focusStyle = FOCUS_STYLES[routine.focus_area ?? ""] ?? {
    bg: "bg-[#3A3A3A]",
    text: "text-[#A0A0A0]",
    label: routine.focus_area ?? "General",
  };

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl overflow-hidden">
      {/* Collapsed header */}
      <button
        type="button"
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#313131] transition-all text-left min-h-[44px]"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Icon */}
        <div className="w-10 h-10 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-lg flex items-center justify-center shrink-0">
          <Dumbbell className="w-5 h-5 text-[#CCFF00]" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white truncate">
              {routine.name}
            </span>
            {routine.focus_area && (
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${focusStyle.bg} ${focusStyle.text}`}
              >
                {focusStyle.label}
              </span>
            )}
          </div>
          {routine.description && (
            <p className="text-xs text-[#A0A0A0] truncate mb-2">
              {routine.description}
            </p>
          )}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-[#A0A0A0]">
              <Clock className="w-3 h-3" />
              {routine.duration_minutes} min
            </span>
            {routine.goal && (
              <span className="flex items-center gap-1 text-xs text-[#A0A0A0]">
                <Target className="w-3 h-3" />
                {formatGoal(routine.goal)}
              </span>
            )}
            {routine.difficulty && (
              <span className="flex items-center gap-1 text-xs text-[#A0A0A0]">
                <Zap className="w-3 h-3" />
                {formatDifficulty(routine.difficulty)}
              </span>
            )}
            <span className="text-xs font-semibold text-[#CCFF00]">
              {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-10 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-2xl z-10 min-w-[140px] py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#313131] transition-all min-h-[44px]"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#313131] transition-all min-h-[44px]"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <div className="border-t border-[#3A3A3A] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-all min-h-[44px]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-[#3A3A3A] pt-4 space-y-4">
          {/* Warm-up */}
          {routine.warm_up && (
            <div>
              <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-1.5">
                Warm-up
              </p>
              <p className="text-sm text-[#A0A0A0]">{routine.warm_up}</p>
            </div>
          )}

          {/* Exercises */}
          {sortedExercises.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-3">
                Exercises
              </p>
              <div className="space-y-2">
                {sortedExercises.map((re, i) => (
                  <div key={re.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#CCFF00] rounded flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#000000]">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {re.exercise?.name ?? "Exercise"}
                      </p>
                      <p className="text-xs text-[#A0A0A0]">
                        {re.sets} sets × {re.reps} reps
                        {re.rest_seconds
                          ? ` · ${re.rest_seconds}s rest`
                          : ""}
                      </p>
                      {re.notes && (
                        <p className="text-xs text-[#555] mt-0.5">
                          {re.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cool-down */}
          {routine.cool_down && (
            <div>
              <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-1.5">
                Cool-down
              </p>
              <p className="text-sm text-[#A0A0A0]">{routine.cool_down}</p>
            </div>
          )}

          {/* Notes */}
          {routine.notes && (
            <div>
              <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-1.5">
                Notes
              </p>
              <p className="text-sm text-[#A0A0A0]">{routine.notes}</p>
            </div>
          )}

          {/* Tags */}
          {routine.tags && routine.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {routine.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#2A2A2A] border border-[#3A3A3A] text-[#A0A0A0] text-xs rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
