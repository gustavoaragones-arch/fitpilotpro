"use client";

import { useState } from "react";
import { Plus, Search, Dumbbell } from "lucide-react";
import { useRoutines, useDeleteRoutine, useCreateRoutine, useSaveRoutineExercises } from "@/hooks/useRoutines";
import { RoutineRow } from "./RoutineRow";
import { RoutineModal } from "./RoutineModal";
import type { Routine } from "@/types";

const FOCUS_OPTIONS = [
  { value: "", label: "All Focus" },
  { value: "upper_body", label: "Upper Body" },
  { value: "lower_body", label: "Lower Body" },
  { value: "full_body", label: "Full Body" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
  { value: "flexibility", label: "Flexibility" },
];

const GOAL_OPTIONS = [
  { value: "", label: "All Goals" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "strength", label: "Strength" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "endurance", label: "Endurance" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "athletic_performance", label: "Athletic Performance" },
  { value: "rehabilitation", label: "Rehabilitation" },
];

const selectCls =
  "bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px] cursor-pointer";

function RoutinesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-5 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#3A3A3A] rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-[#3A3A3A] rounded" />
              <div className="h-3 w-64 bg-[#3A3A3A] rounded" />
              <div className="h-3 w-40 bg-[#3A3A3A] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RoutinesView() {
  const [search, setSearch] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoutine, setEditRoutine] = useState<Routine | null>(null);

  const { data: routines = [], isLoading, refetch } = useRoutines();
  const deleteRoutine = useDeleteRoutine();
  const createRoutine = useCreateRoutine();
  const saveExercises = useSaveRoutineExercises();

  const filtered = routines.filter((r) => {
    const matchSearch =
      !search.trim() ||
      r.name.toLowerCase().includes(search.toLowerCase());
    const matchFocus = !focusFilter || r.focus_area === focusFilter;
    const matchGoal = !goalFilter || r.goal === goalFilter;
    return matchSearch && matchFocus && matchGoal;
  });

  const handleDelete = async (routine: Routine) => {
    if (!confirm(`Delete "${routine.name}"? This cannot be undone.`)) return;
    await deleteRoutine.mutateAsync(routine.id);
  };

  const handleDuplicate = async (routine: Routine) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at: _ca, updated_at: _ua, routine_exercises, ...rest } = routine;
    const created = await createRoutine.mutateAsync(rest);
    if (routine_exercises && routine_exercises.length > 0) {
      await saveExercises.mutateAsync({
        routine_id: created.id,
        exercises: routine_exercises
          .sort((a, b) => a.order_index - b.order_index)
          .map((re, i) => ({
            exercise_id: re.exercise_id,
            sets: re.sets,
            reps: re.reps,
            rest_seconds: re.rest_seconds,
            notes: re.notes,
            order_index: i,
          })),
      });
    }
    refetch();
  };

  const openCreate = () => {
    setEditRoutine(null);
    setModalOpen(true);
  };

  const openEdit = (routine: Routine) => {
    setEditRoutine(routine);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Routine Library</h1>
          <p className="text-sm text-[#A0A0A0] mt-0.5">
            {isLoading ? "Loading..." : `${routines.length} routine${routines.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-[#000000] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Create Routine
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            placeholder="Search routines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]"
          />
        </div>
        <select
          value={focusFilter}
          onChange={(e) => setFocusFilter(e.target.value)}
          className={selectCls}
        >
          {FOCUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          className={selectCls}
        >
          {GOAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <RoutinesSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 bg-[#CCFF00]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-6 h-6 text-[#CCFF00]" />
          </div>
          <p className="text-white font-semibold mb-1">
            {search || focusFilter || goalFilter
              ? "No routines match your filters"
              : "No routines yet"}
          </p>
          <p className="text-sm text-[#A0A0A0] mb-5">
            {search || focusFilter || goalFilter
              ? "Try adjusting your search or filters"
              : "Create your first routine to get started"}
          </p>
          {!search && !focusFilter && !goalFilter && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#000000] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#B8E600] min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              Create Routine
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((routine) => (
            <RoutineRow
              key={routine.id}
              routine={routine}
              onEdit={() => openEdit(routine)}
              onDelete={() => handleDelete(routine)}
              onDuplicate={() => handleDuplicate(routine)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <RoutineModal
          routine={editRoutine}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
