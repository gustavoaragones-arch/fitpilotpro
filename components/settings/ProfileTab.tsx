"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useSettings";

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  business_name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]";

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function ProfileTab() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      business_name: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? "",
        business_name: profile.business_name ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSaved(false);
    try {
      await updateProfile.mutateAsync(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-[#3A3A3A] rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[#3A3A3A] rounded" />
            <div className="h-3 w-24 bg-[#3A3A3A] rounded" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 bg-[#3A3A3A] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-[#CCFF00]/10 border-2 border-[#CCFF00]/20 rounded-full flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-[#CCFF00]">
            {getInitials(profile?.full_name ?? null)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {profile?.full_name ?? "Your Name"}
          </p>
          <button
            type="button"
            className="text-xs text-[#A0A0A0] hover:text-white transition-colors mt-1 min-h-[44px]"
          >
            Change Photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
            Full Name
          </label>
          <input
            {...register("full_name")}
            placeholder="Your name"
            className={inputCls}
          />
          {errors.full_name && (
            <p className="text-xs text-[#EF4444] mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={profile?.email ?? ""}
            readOnly
            disabled
            className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-[#555] text-sm min-h-[44px] cursor-not-allowed"
          />
          <p className="text-xs text-[#555] mt-1">
            Contact support to change your email
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
            Business Name
          </label>
          <input
            {...register("business_name")}
            placeholder="Your business name"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
            Role
          </label>
          <input
            type="text"
            value={(profile as Record<string, string> | undefined)?.role ?? "Personal Trainer"}
            readOnly
            disabled
            className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-[#555] text-sm min-h-[44px] cursor-not-allowed capitalize"
          />
          <p className="text-xs text-[#555] mt-1">Set during onboarding</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="px-6 py-2.5 text-sm font-semibold bg-[#CCFF00] text-[#000000] rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#4ADE80]">
            <CheckCircle className="w-4 h-4" />
            Changes saved
          </span>
        )}

        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      </div>
    </form>
  );
}
