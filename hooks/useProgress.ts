"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Client, ProgressRecord } from "@/types";

export function useProgressClients() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["progress-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, tier, status")
        .eq("status", "active")
        .order("full_name", { ascending: true });

      if (error) throw error;
      return (data ?? []) as Pick<Client, "id" | "full_name" | "tier" | "status">[];
    },
    staleTime: 60_000,
  });
}

export function useProgressRecords(clientId: string | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["progress-records", clientId],
    queryFn: async () => {
      if (!clientId) return [];

      const { data, error } = await supabase
        .from("progress_records")
        .select("*")
        .eq("client_id", clientId)
        .order("recorded_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as ProgressRecord[];
    },
    enabled: !!clientId,
    staleTime: 30_000,
  });
}

type ProgressInput = {
  client_id: string;
  recorded_at: string;
  weight_lbs?: number | null;
  body_fat_pct?: number | null;
  skeletal_muscle_mass_lbs?: number | null;
  waist_in?: number | null;
  chest_in?: number | null;
  hips_in?: number | null;
  left_arm_in?: number | null;
  right_arm_in?: number | null;
  left_thigh_in?: number | null;
  right_thigh_in?: number | null;
  left_calf_in?: number | null;
  right_calf_in?: number | null;
  notes?: string | null;
};

export function useAddProgressRecord() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProgressInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("progress_records")
        .insert({ ...input, trainer_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["progress-records", variables.client_id],
      });
    },
  });
}

export function useDeleteProgressRecord() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      clientId,
    }: {
      id: string;
      clientId: string;
    }) => {
      const { error } = await supabase
        .from("progress_records")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return clientId;
    },
    onSuccess: (clientId) => {
      queryClient.invalidateQueries({
        queryKey: ["progress-records", clientId],
      });
    },
  });
}
