"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/types";

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  email: z
    .string()
    .email("Invalid email")
    .or(z.literal(""))
    .optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  status: z.enum(["active", "inactive", "prospect"]),
  preferred_location: z.enum([
    "home",
    "gym",
    "studio",
    "park",
    "online",
    "other",
  ]),
  fitness_level: z.enum(["beginner", "intermediate", "advanced"]),
  goal: z.enum([
    "muscle_gain",
    "weight_loss",
    "strength",
    "endurance",
    "athletic_performance",
    "general_fitness",
    "rehabilitation",
  ]),
  address: z.string().optional(),
  health_conditions: z.string().optional(),
  session_price: z.number().min(0),
  sessions_per_week: z.number().min(1).max(14),
  payment_model: z.enum(["per_session", "monthly", "upfront"]),
  notes: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
});

type ClientForm = z.infer<typeof schema>;

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
      {error && (
        <p className="text-xs text-[#EF4444] mt-1">{error}</p>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-4 pt-2">
      {title}
    </p>
  );
}

const inputClass =
  "w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 transition-colors min-h-[44px]";
const selectClass = inputClass + " appearance-none cursor-pointer";

function calcTier(
  price: number,
  sessionsPerWeek: number,
  paymentModel: string
): "diamond" | "gold" | "silver" {
  const priceScore = price >= 100 ? 40 : price >= 60 ? 24 : 0;
  const freqScore = sessionsPerWeek >= 4 ? 30 : sessionsPerWeek >= 2 ? 18 : 0;
  const paymentScore =
    paymentModel === "upfront" ? 20 : paymentModel === "monthly" ? 12 : 0;
  const total = priceScore + freqScore + paymentScore;
  return total >= 70 ? "diamond" : total >= 40 ? "gold" : "silver";
}

interface ClientModalProps {
  client: Client | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ClientModal({
  client,
  onClose,
  onSaved,
}: ClientModalProps) {
  const supabase = createClient();
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(schema) as Resolver<ClientForm>,
    defaultValues: {
      status: "active",
      preferred_location: "gym",
      fitness_level: "intermediate",
      goal: "general_fitness",
      session_price: 75 as number,
      sessions_per_week: 2 as number,
      payment_model: "per_session",
    },
  });

  useEffect(() => {
    if (client) {
      reset({
        full_name: client.full_name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        date_of_birth: client.date_of_birth ?? "",
        status: client.status,
        preferred_location: (client.preferred_location as ClientForm["preferred_location"]) ?? "gym",
        fitness_level: (client.fitness_level as ClientForm["fitness_level"]) ?? "intermediate",
        goal: (client.goal as ClientForm["goal"]) ?? "general_fitness",
        address: client.address ?? "",
        health_conditions: client.health_conditions ?? "",
        session_price: client.session_price,
        sessions_per_week: client.sessions_per_week,
        payment_model: (client.payment_model as ClientForm["payment_model"]) ?? "per_session",
        notes: client.notes ?? "",
        emergency_contact_name: client.emergency_contact_name ?? "",
        emergency_contact_phone: client.emergency_contact_phone ?? "",
      });
    }
  }, [client, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ClientForm) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const tier = calcTier(
        data.session_price,
        data.sessions_per_week,
        data.payment_model
      );
      const tierScore =
        (data.session_price >= 100 ? 40 : data.session_price >= 60 ? 24 : 0) +
        (data.sessions_per_week >= 4 ? 30 : data.sessions_per_week >= 2 ? 18 : 0) +
        (data.payment_model === "upfront" ? 20 : data.payment_model === "monthly" ? 12 : 0);

      const payload = {
        ...data,
        tier,
        tier_score: tierScore,
        trainer_id: user.id,
        email: data.email || null,
        phone: data.phone || null,
        date_of_birth: data.date_of_birth || null,
        address: data.address || null,
        health_conditions: data.health_conditions || null,
        notes: data.notes || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
      };

      if (isEditing && client) {
        const { error } = await supabase
          .from("clients")
          .update(payload)
          .eq("id", client.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("clients").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3A3A3A] flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Client" : "Add New Client"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <SectionHeader title="Basic Information" />
            <Field label="Full Name *" error={errors.full_name?.message}>
              <input
                {...register("full_name")}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="jane@email.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Phone">
                <input
                  {...register("phone")}
                  placeholder="+1 604-555-0100"
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Birth">
                <input
                  {...register("date_of_birth")}
                  type="date"
                  className={inputClass}
                />
              </Field>
              <Field label="Status">
                <select {...register("status")} className={selectClass}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Emergency Contact Name">
                <input
                  {...register("emergency_contact_name")}
                  placeholder="John Smith"
                  className={inputClass}
                />
              </Field>
              <Field label="Emergency Contact Phone">
                <input
                  {...register("emergency_contact_phone")}
                  placeholder="+1 604-555-0199"
                  className={inputClass}
                />
              </Field>
            </div>

            <SectionHeader title="Training Details" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Preferred Location">
                <select
                  {...register("preferred_location")}
                  className={selectClass}
                >
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                  <option value="park">Park / Outdoor</option>
                  <option value="studio">Studio</option>
                  <option value="online">Online</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Fitness Level">
                <select {...register("fitness_level")} className={selectClass}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary Goal">
                <select {...register("goal")} className={selectClass}>
                  <option value="general_fitness">General Fitness</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="strength">Strength</option>
                  <option value="endurance">Endurance</option>
                  <option value="athletic_performance">
                    Athletic Performance
                  </option>
                  <option value="rehabilitation">Rehabilitation</option>
                </select>
              </Field>
              <Field label="Training Address">
                <input
                  {...register("address")}
                  placeholder="123 Main St, City"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Health Conditions">
              <input
                {...register("health_conditions")}
                placeholder="e.g. Lower back sensitivity, knee injury"
                className={inputClass}
              />
            </Field>

            <SectionHeader title="Pricing & Schedule" />
            <div className="grid grid-cols-3 gap-4">
              <Field
                label="Session Price ($) *"
                error={errors.session_price?.message}
              >
                <input
                  {...register("session_price", { valueAsNumber: true })}
                  type="number"
                  placeholder="75"
                  className={inputClass}
                />
              </Field>
              <Field label="Sessions / Week">
                <input
                  {...register("sessions_per_week", { valueAsNumber: true })}
                  type="number"
                  placeholder="2"
                  className={inputClass}
                />
              </Field>
              <Field label="Payment Model">
                <select {...register("payment_model")} className={selectClass}>
                  <option value="per_session">Per Session</option>
                  <option value="monthly">Monthly</option>
                  <option value="upfront">Upfront</option>
                </select>
              </Field>
            </div>
            <p className="text-xs text-[#555] -mt-2">
              Tier (Diamond / Gold / Silver) is calculated automatically based
              on price, frequency, and payment model.
            </p>

            <Field label="Notes">
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Health conditions, preferences, goals..."
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
              {isEditing ? "Save Changes" : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
