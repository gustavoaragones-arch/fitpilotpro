"use client";

import { useState, useEffect } from "react";
import { X, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateRoutine,
  useUpdateRoutine,
  useSaveRoutineExercises,
} from "@/hooks/useRoutines";
import { ExerciseSearchDropdown } from "./ExerciseSearchDropdown";
import type { Routine, Exercise } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  focus_area: z.string().optional(),
  goal: z.string().optional(),
  difficulty: z.string().optional(),
  duration_minutes: z.number().min(5).max(300),
  warm_up: z.string().optional(),
  cool_down: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type ExerciseEntry = {
  tempId: string;
  exercise_id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]";

const selectCls =
  "w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]";

interface RoutineModalProps {
  routine?: Routine | null;
  onClose: () => void;
  onSaved: () => void;
}

export function RoutineModal({ routine, onClose, onSaved }: RoutineModalProps) {
  const isEdit = !!routine;
  const createRoutine = useCreateRoutine();
  const updateRoutine = useUpdateRoutine();
  const saveExercises = useSaveRoutineExercises();

  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: routine?.name ?? "",
      description: routine?.description ?? "",
      focus_area: routine?.focus_area ?? "",
      goal: routine?.goal ?? "",
      difficulty: routine?.difficulty ?? "",
      duration_minutes: routine?.duration_minutes ?? 60,
      warm_up: routine?.warm_up ?? "",
      cool_down: routine?.cool_down ?? "",
      notes: routine?.notes ?? "",
    },
  });

  // Seed exercise entries from existing routine
  useEffect(() => {
    if (routine?.routine_exercises) {
      const sorted = [...routine.routine_exercises].sort(
        (a, b) => a.order_index - b.order_index
      );
      setExerciseEntries(
        sorted.map((re) => ({
          tempId: re.id,
          exercise_id: re.exercise_id,
          exercise: re.exercise!,
          sets: re.sets ?? 3,
          reps: re.reps ?? "10",
          rest_seconds: re.rest_seconds ?? 90,
          notes: re.notes ?? "",
        }))
      );
    }
  }, [routine]);

  const addExercise = (ex: Exercise) => {
    setExerciseEntries((prev) => [
      ...prev,
      {
        tempId: `temp-${Date.now()}-${Math.random()}`,
        exercise_id: ex.id,
        exercise: ex,
        sets: 3,
        reps: "10",
        rest_seconds: 90,
        notes: "",
      },
    ]);
  };

  const removeExercise = (tempId: string) => {
    setExerciseEntries((prev) => prev.filter((e) => e.tempId !== tempId));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setExerciseEntries((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    setExerciseEntries((prev) => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const updateEntry = (
    tempId: string,
    field: keyof Omit<ExerciseEntry, "tempId" | "exercise_id" | "exercise">,
    value: string | number
  ) => {
    setExerciseEntries((prev) =>
      prev.map((e) => (e.tempId === tempId ? { ...e, [field]: value } : e))
    );
  };

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      let routineId: string;

      if (isEdit && routine) {
        await updateRoutine.mutateAsync({ id: routine.id, ...data });
        routineId = routine.id;
      } else {
        const created = await createRoutine.mutateAsync(data);
        routineId = created.id;
      }

      await saveExercises.mutateAsync({
        routine_id: routineId,
        exercises: exerciseEntries.map((e, i) => ({
          exercise_id: e.exercise_id,
          sets: e.sets,
          reps: e.reps,
          rest_seconds: e.rest_seconds,
          notes: e.notes || null,
          order_index: i,
        })),
      });

      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const existingIds = exerciseEntries.map((e) => e.exercise_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A3A3A] shrink-0">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? "Edit Routine" : "Create Routine"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="px-6 py-5 space-y-6">
            {/* Section 1 — Details */}
            <div>
              <SectionHeader>Routine Details</SectionHeader>
              <div className="space-y-4">
                <Field label="Routine Name *" error={errors.name?.message}>
                  <input
                    {...register("name")}
                    placeholder="e.g. Upper Body Hypertrophy A"
                    className={inputCls}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    {...register("description")}
                    placeholder="Brief description of the routine..."
                    rows={2}
                    className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 resize-none"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Focus Area">
                    <select {...register("focus_area")} className={selectCls}>
                      <option value="">Any</option>
                      <option value="upper_body">Upper Body</option>
                      <option value="lower_body">Lower Body</option>
                      <option value="full_body">Full Body</option>
                      <option value="core">Core</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                    </select>
                  </Field>
                  <Field label="Goal">
                    <select {...register("goal")} className={selectCls}>
                      <option value="">Any</option>
                      <option value="hypertrophy">Hypertrophy</option>
                      <option value="strength">Strength</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="endurance">Endurance</option>
                      <option value="general_fitness">General Fitness</option>
                      <option value="athletic_performance">Athletic Performance</option>
                      <option value="rehabilitation">Rehabilitation</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Difficulty">
                    <select {...register("difficulty")} className={selectCls}>
                      <option value="">Any</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </Field>
                  <Field
                    label="Duration (minutes)"
                    error={errors.duration_minutes?.message}
                  >
                    <input
                      {...register("duration_minutes", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min={5}
                      max={300}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Section 2 — Warm-up / Cool-down */}
            <div>
              <SectionHeader>Warm-up &amp; Cool-down</SectionHeader>
              <div className="space-y-4">
                <Field label="Warm-up Notes">
                  <textarea
                    {...register("warm_up")}
                    placeholder="e.g. 5 min arm circles, band pull-aparts..."
                    rows={2}
                    className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 resize-none"
                  />
                </Field>
                <Field label="Cool-down Notes">
                  <textarea
                    {...register("cool_down")}
                    placeholder="e.g. Child pose, doorway chest stretch..."
                    rows={2}
                    className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 resize-none"
                  />
                </Field>
              </div>
            </div>

            {/* Section 3 — Exercises */}
            <div>
              <SectionHeader>Exercises</SectionHeader>
              <ExerciseSearchDropdown
                onSelect={addExercise}
                excludeIds={existingIds}
              />

              {exerciseEntries.length > 0 && (
                <div className="mt-4 space-y-3">
                  {exerciseEntries.map((entry, index) => (
                    <div
                      key={entry.tempId}
                      className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Number badge */}
                        <div className="w-6 h-6 bg-[#CCFF00] rounded flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-[#000000]">
                            {index + 1}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white mb-3">
                            {entry.exercise.name}
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-[#A0A0A0] mb-1 block">
                                Sets
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={entry.sets}
                                onChange={(e) =>
                                  updateEntry(
                                    entry.tempId,
                                    "sets",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#CCFF00] min-h-[44px]"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-[#A0A0A0] mb-1 block">
                                Reps
                              </label>
                              <input
                                type="text"
                                value={entry.reps}
                                onChange={(e) =>
                                  updateEntry(
                                    entry.tempId,
                                    "reps",
                                    e.target.value
                                  )
                                }
                                placeholder="10-12"
                                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#CCFF00] min-h-[44px]"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-[#A0A0A0] mb-1 block">
                                Rest (sec)
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={entry.rest_seconds}
                                onChange={(e) =>
                                  updateEntry(
                                    entry.tempId,
                                    "rest_seconds",
                                    parseInt(e.target.value) || 60
                                  )
                                }
                                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#CCFF00] min-h-[44px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="w-7 h-7 flex items-center justify-center rounded text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all disabled:opacity-30 min-h-[44px]"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDown(index)}
                            disabled={index === exerciseEntries.length - 1}
                            className="w-7 h-7 flex items-center justify-center rounded text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all disabled:opacity-30 min-h-[44px]"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExercise(entry.tempId)}
                            className="w-7 h-7 flex items-center justify-center rounded text-[#A0A0A0] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all min-h-[44px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {exerciseEntries.length === 0 && (
                <p className="mt-3 text-sm text-[#555] text-center py-4">
                  Search and add exercises above
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#3A3A3A] shrink-0 flex items-center justify-between gap-3">
            {error && (
              <p className="text-sm text-[#EF4444] flex-1">{error}</p>
            )}
            {!error && <div className="flex-1" />}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-[#A0A0A0] hover:text-white border border-[#3A3A3A] hover:border-[#555] rounded-lg transition-all min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold bg-[#CCFF00] text-[#000000] rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Routine"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
