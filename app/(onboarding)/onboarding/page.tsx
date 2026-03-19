"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  Dumbbell,
  Users,
  MapPin,
  BarChart3,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Role =
  | "personal_trainer"
  | "fitness_coach"
  | "studio_owner";
type Goal =
  | "grow_clients"
  | "save_time"
  | "track_progress"
  | "optimize_routes";

interface OnboardingData {
  role: Role | null;
  goals: Goal[];
  business_name: string;
  client_count: string;
}

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            i < current
              ? "bg-[#CCFF00] w-8"
              : i === current
                ? "bg-[#CCFF00] w-8 opacity-60"
                : "bg-[#2A2A2A] w-6"
          )}
        />
      ))}
    </div>
  );
}

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-[#CCFF00] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_rgba(204,255,0,0.2)]">
        <Dumbbell className="w-10 h-10 text-black" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">
        Welcome to FitPilot Pro
      </h1>
      <p className="text-[#A0A0A0] mb-8 leading-relaxed">
        Let&apos;s set up your account in 2 minutes so you can start managing
        your training business like a pro.
      </p>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[52px] text-sm"
      >
        Get Started <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

const ROLES: {
  value: Role;
  label: string;
  description: string;
}[] = [
  {
    value: "personal_trainer",
    label: "Personal Trainer",
    description: "Work with clients one-on-one",
  },
  {
    value: "fitness_coach",
    label: "Fitness Coach",
    description: "Online or hybrid coaching",
  },
  {
    value: "studio_owner",
    label: "Studio Owner",
    description: "Manage multiple trainers and clients",
  },
];

function StepRole({
  data,
  onUpdate,
  onNext,
}: {
  data: OnboardingData;
  onUpdate: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-2">
        What describes you best?
      </h2>
      <p className="text-[#A0A0A0] mb-6">We&apos;ll customize your experience.</p>
      <div className="space-y-3 mb-8">
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => onUpdate({ role: role.value })}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left min-h-[72px]",
              data.role === role.value
                ? "border-[#CCFF00] bg-[#CCFF00]/5"
                : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#3A3A3A]"
            )}
          >
            <div>
              <p
                className={cn(
                  "font-semibold text-sm",
                  data.role === role.value ? "text-white" : "text-white"
                )}
              >
                {role.label}
              </p>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                {role.description}
              </p>
            </div>
            {data.role === role.value && (
              <div className="w-6 h-6 bg-[#CCFF00] rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                <Check className="w-3.5 h-3.5 text-black" />
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!data.role}
        className="w-full flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[52px] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

const GOALS: { value: Goal; label: string; icon: typeof Users }[] = [
  {
    value: "grow_clients",
    label: "Grow my client base",
    icon: Users,
  },
  {
    value: "save_time",
    label: "Save time on admin work",
    icon: BarChart3,
  },
  {
    value: "track_progress",
    label: "Track client progress better",
    icon: Dumbbell,
  },
  {
    value: "optimize_routes",
    label: "Optimize my travel routes",
    icon: MapPin,
  },
];

function StepGoals({
  data,
  onUpdate,
  onNext,
}: {
  data: OnboardingData;
  onUpdate: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  const toggle = (goal: Goal) => {
    const current = data.goals;
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    onUpdate({ goals: updated });
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-2">
        What are your main goals?
      </h2>
      <p className="text-[#A0A0A0] mb-6">Select all that apply.</p>
      <div className="space-y-3 mb-8">
        {GOALS.map(({ value, label, icon: Icon }) => {
          const selected = data.goals.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggle(value)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left min-h-[64px]",
                selected
                  ? "border-[#CCFF00] bg-[#CCFF00]/5"
                  : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#3A3A3A]"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                  selected ? "bg-[#CCFF00]" : "bg-[#2A2A2A]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    selected ? "text-black" : "text-[#A0A0A0]"
                  )}
                />
              </div>
              <span className="text-sm font-medium text-white">{label}</span>
              {selected && (
                <div className="ml-auto w-5 h-5 bg-[#CCFF00] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={data.goals.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[52px] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

const CLIENT_COUNTS = [
  "Just starting out",
  "1–5 clients",
  "6–15 clients",
  "16–30 clients",
  "30+ clients",
];

function StepBusiness({
  data,
  onUpdate,
  onNext,
}: {
  data: OnboardingData;
  onUpdate: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-2">
        Tell us about your business
      </h2>
      <p className="text-[#A0A0A0] mb-6">
        This helps us personalize your dashboard.
      </p>
      <div className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-medium text-[#A0A0A0] mb-1.5 block">
            Business name{" "}
            <span className="text-[#555] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={data.business_name}
            onChange={(e) => onUpdate({ business_name: e.target.value })}
            placeholder="Jane Smith Fitness"
            className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 transition-colors min-h-[44px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#A0A0A0] mb-2 block">
            How many clients do you currently have?
          </label>
          <div className="space-y-2">
            {CLIENT_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => onUpdate({ client_count: count })}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left min-h-[44px]",
                  data.client_count === count
                    ? "border-[#CCFF00] bg-[#CCFF00]/5 text-white"
                    : "border-[#2A2A2A] bg-[#1A1A1A] text-[#A0A0A0] hover:border-[#3A3A3A] hover:text-white"
                )}
              >
                <span className="text-sm font-medium">{count}</span>
                {data.client_count === count && (
                  <Check className="w-4 h-4 text-[#CCFF00]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={onNext}
        disabled={!data.client_count}
        className="w-full flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[52px] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function StepComplete({
  onFinish,
  loading,
}: {
  onFinish: () => void;
  loading: boolean;
}) {
  return (
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_rgba(204,255,0,0.25)]">
        <Check className="w-10 h-10 text-black" strokeWidth={3} />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">
        Your FitPilot Pro dashboard is ready.
      </h1>
      <p className="text-[#A0A0A0] mb-8">
        Let&apos;s start building your training empire.
      </p>
      <button
        onClick={onFinish}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[52px] text-sm disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Go to Dashboard <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    role: null,
    goals: [],
    business_name: "",
    client_count: "",
  });
  const router = useRouter();
  const supabase = createClient();

  const update = (partial: Partial<OnboardingData>) =>
    setFormData((prev) => ({ ...prev, ...partial }));

  const next = () =>
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  const finish = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const locale =
          (typeof navigator !== "undefined" && navigator.language) || "en-US";
        const unitSystem = locale.startsWith("en-US") ? "imperial" : "metric";
        const currency =
          locale.startsWith("en-CA") || locale.startsWith("fr-CA")
            ? "CAD"
            : "USD";
        const language = locale.startsWith("es")
          ? "es"
          : locale.startsWith("pt")
          ? "pt-BR"
          : "en";

        await supabase
          .from("profiles")
          .update({
            role: formData.role,
            business_name: formData.business_name || null,
            onboarding_completed: true,
            unit_system: unitSystem,
            currency,
            language,
          })
          .eq("id", user.id);
      }
    } catch {
      // Non-blocking — proceed even if update fails
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <StepIndicator current={step} total={TOTAL_STEPS} />
      {step === 0 && <StepWelcome onNext={next} />}
      {step === 1 && (
        <StepRole data={formData} onUpdate={update} onNext={next} />
      )}
      {step === 2 && (
        <StepGoals data={formData} onUpdate={update} onNext={next} />
      )}
      {step === 3 && (
        <StepBusiness data={formData} onUpdate={update} onNext={next} />
      )}
      {step === 4 && (
        <StepComplete onFinish={finish} loading={saving} />
      )}
    </div>
  );
}
