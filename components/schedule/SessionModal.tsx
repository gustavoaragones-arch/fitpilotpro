"use client";

import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import {
  useClientsForSelect,
  useDaySessionsAsNeighbors,
} from "@/hooks/useSchedule";
import { TravelIntelligencePanel } from "./TravelIntelligencePanel";
import { DatePicker } from "@/components/ui/DatePicker";
import { TimePicker } from "@/components/ui/TimePicker";

const schema = z.object({
  client_id: z.string().min(1, "Select a client"),
  scheduled_date: z.string().min(1, "Required"),
  scheduled_time: z.string().min(1, "Required"),
  duration_minutes: z.coerce.number().min(15).max(240),
  location_type: z.enum([
    "gym",
    "home",
    "park",
    "studio",
    "online",
    "other",
  ]),
  location: z.string().optional(),
  price: z.coerce.number().min(0),
  payment_status: z.enum(["paid", "unpaid", "waived"]),
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]),
  notes: z.string().optional(),
  trainer_notes: z.string().optional(),
});

type SessionForm = z.infer<typeof schema>;

const inputClass =
  "w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 transition-colors min-h-[44px]";
const selectClass = inputClass + " appearance-none cursor-pointer";

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-4 pt-2">
      {title}
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
      <label className="text-sm font-medium text-[#A0A0A0] mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}

export type SessionForEdit = {
  id: string;
  client_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  location_type: string | null;
  location: string | null;
  price: number | null;
  payment_status: string;
  status: string;
  notes: string | null;
  trainer_notes: string | null;
};

interface SessionModalProps {
  session?: SessionForEdit | null;
  defaultDate?: Date;
  onClose: () => void;
  onSaved: () => void;
}

export function SessionModal({
  session,
  defaultDate,
  onClose,
  onSaved,
}: SessionModalProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const isEditing = !!session;
  const { data: clients = [] } = useClientsForSelect();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SessionForm>({
    resolver: zodResolver(schema) as Resolver<SessionForm>,
    defaultValues: {
      scheduled_date: defaultDate
        ? format(defaultDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      scheduled_time: "09:00",
      duration_minutes: 60,
      location_type: "gym",
      price: 75,
      payment_status: "unpaid",
      status: "scheduled",
    },
  });

  const watchedClientId = watch("client_id");
  const watchedDate = watch("scheduled_date");
  const watchedTime = watch("scheduled_time");

  const proposedDate = useMemo(() => {
    if (!watchedDate || !watchedTime) return null;
    try {
      return new Date(`${watchedDate}T${watchedTime}:00`);
    } catch {
      return null;
    }
  }, [watchedDate, watchedTime]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === watchedClientId) ?? null,
    [clients, watchedClientId]
  );

  const sessionDate = proposedDate ?? defaultDate ?? new Date();
  const existingNeighbors = useDaySessionsAsNeighbors(sessionDate);

  const neighborsForIntel = useMemo(
    () => existingNeighbors.filter((s) => s.id !== session?.id),
    [existingNeighbors, session?.id]
  );

  useEffect(() => {
    if (watchedClientId && !isEditing) {
      const client = clients.find((c) => c.id === watchedClientId);
      if (client) {
        setValue("price", client.session_price ?? 0);
        const loc = client.preferred_location;
        if (loc && ["gym", "home", "park", "studio", "online", "other"].includes(loc)) {
          setValue("location_type", loc as SessionForm["location_type"]);
        }
        if (client.address) {
          setValue("location", client.address);
        }
      }
    }
  }, [watchedClientId, clients, setValue, isEditing]);

  useEffect(() => {
    if (session) {
      const dt = new Date(session.scheduled_at);
      reset({
        client_id: session.client_id ?? "",
        scheduled_date: format(dt, "yyyy-MM-dd"),
        scheduled_time: format(dt, "HH:mm"),
        duration_minutes: session.duration_minutes,
        location_type: (session.location_type as SessionForm["location_type"]) ?? "gym",
        location: session.location ?? "",
        price: session.price ?? 0,
        payment_status: session.payment_status as SessionForm["payment_status"],
        status: session.status as SessionForm["status"],
        notes: session.notes ?? "",
        trainer_notes: session.trainer_notes ?? "",
      });
    }
  }, [session, reset]);

  const mutation = useMutation({
    mutationFn: async (data: SessionForm) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const scheduled_at = new Date(
        `${data.scheduled_date}T${data.scheduled_time}:00`
      ).toISOString();

      const payload = {
        trainer_id: user.id,
        client_id: data.client_id || null,
        scheduled_at,
        duration_minutes: data.duration_minutes,
        location_type: data.location_type,
        location: data.location || null,
        price: data.price,
        payment_status: data.payment_status,
        status: data.status,
        notes: data.notes || null,
        trainer_notes: data.trainer_notes || null,
      };

      if (isEditing && session) {
        const { error } = await supabase
          .from("sessions")
          .update(payload)
          .eq("id", session.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sessions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-day"] });
      queryClient.invalidateQueries({ queryKey: ["sessions-month"] });
      queryClient.invalidateQueries({ queryKey: ["todays-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      onSaved();
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3A3A3A] flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Session" : "Schedule Session"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <SectionHeader title="Session Details" />

            <Field label="Client *" error={errors.client_id?.message}>
              <select {...register("client_id")} className={selectClass}>
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date *" error={errors.scheduled_date?.message}>
                <DatePicker
                  value={watch("scheduled_date") ?? ""}
                  onChange={(val) =>
                    setValue("scheduled_date", val, { shouldValidate: true })
                  }
                  error={!!errors.scheduled_date}
                />
              </Field>
              <Field label="Start Time *" error={errors.scheduled_time?.message}>
                <TimePicker
                  value={watch("scheduled_time") ?? ""}
                  onChange={(val) =>
                    setValue("scheduled_time", val, { shouldValidate: true })
                  }
                  error={!!errors.scheduled_time}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration">
                <select {...register("duration_minutes")} className={selectClass}>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={75}>75 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>2 hours</option>
                </select>
              </Field>
              <Field label="Status">
                <select {...register("status")} className={selectClass}>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </Field>
            </div>

            {watchedClientId && proposedDate && selectedClient && (
              <TravelIntelligencePanel
                proposedTime={proposedDate}
                newClientName={selectedClient.full_name}
                newClientAddress={selectedClient.address ?? null}
                existingSessions={neighborsForIntel}
              />
            )}

            <SectionHeader title="Location & Payment" />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Location Type">
                <select {...register("location_type")} className={selectClass}>
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                  <option value="park">Park / Outdoor</option>
                  <option value="studio">Studio</option>
                  <option value="online">Online</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Address">
                <input
                  {...register("location")}
                  placeholder="123 Main St..."
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price ($)">
                <input
                  {...register("price")}
                  type="number"
                  placeholder="75"
                  className={inputClass}
                />
              </Field>
              <Field label="Payment Status">
                <select {...register("payment_status")} className={selectClass}>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="waived">Waived</option>
                </select>
              </Field>
            </div>

            <SectionHeader title="Notes" />
            <Field label="Session Notes">
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="Notes visible to client..."
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 transition-colors resize-none"
              />
            </Field>
            <Field label="Trainer Notes">
              <textarea
                {...register("trainer_notes")}
                rows={2}
                placeholder="Private notes for yourself..."
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 transition-colors resize-none"
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#3A3A3A] flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-[#A0A0A0] hover:text-white bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg hover:border-[#555] transition-all min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-[#000000] font-semibold text-sm rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-50"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {isEditing ? "Save Changes" : "Schedule Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
