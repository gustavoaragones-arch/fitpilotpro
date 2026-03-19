"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Routine, Exercise } from "@/types";

export function useRoutines() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["routines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routines")
        .select(
          `
          *,
          routine_exercises (
            *,
            exercise:exercises (*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Routine[];
    },
    staleTime: 60_000,
  });
}

export function useExercises(search?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["exercises", search ?? ""],
    queryFn: async () => {
      let query = supabase
        .from("exercises")
        .select("*")
        .order("name", { ascending: true })
        .limit(50);

      if (search && search.trim()) {
        query = query.ilike("name", `%${search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Exercise[];
    },
    staleTime: 120_000,
    enabled: search !== undefined,
  });
}

type RoutineInput = {
  name: string;
  description?: string | null;
  focus_area?: string | null;
  goal?: string | null;
  difficulty?: string | null;
  duration_minutes?: number;
  warm_up?: string | null;
  cool_down?: string | null;
  notes?: string | null;
  tags?: string[];
};

export function useCreateRoutine() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RoutineInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("routines")
        .insert({ ...input, trainer_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useUpdateRoutine() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: RoutineInput & { id: string }) => {
      const { data, error } = await supabase
        .from("routines")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useDeleteRoutine() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("routines")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });
}

type ExerciseEntry = {
  exercise_id: string;
  sets: number | null;
  reps: string | null;
  rest_seconds: number;
  notes: string | null;
  order_index: number;
};

export function useSaveRoutineExercises() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      routine_id,
      exercises,
    }: {
      routine_id: string;
      exercises: ExerciseEntry[];
    }) => {
      // Delete all existing, then re-insert
      const { error: delError } = await supabase
        .from("routine_exercises")
        .delete()
        .eq("routine_id", routine_id);
      if (delError) throw delError;

      if (exercises.length > 0) {
        const { error: insError } = await supabase
          .from("routine_exercises")
          .insert(exercises.map((e) => ({ ...e, routine_id })));
        if (insError) throw insError;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });
}
