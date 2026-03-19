"use client";

import { Globe, DollarSign, Ruler } from "lucide-react";
import { useUnitSystem } from "@/hooks/useUnitSystem";
import { useUpdateProfile } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

export function UnitsLanguageTab() {
  const { units, currency } = useUnitSystem();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  return (
    <div className="space-y-6">
      {/* Measurement Units */}
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-[#CCFF00]" />
          <p className="text-sm font-semibold text-white">Measurement Units</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(
            [
              {
                value: "imperial",
                label: "Imperial",
                desc: "lbs, inches, °F",
              },
              { value: "metric", label: "Metric", desc: "kg, cm, °C" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateProfile({ unit_system: opt.value })
              }
              disabled={isPending}
              className={cn(
                "flex flex-col items-start px-4 py-3 rounded-lg border transition-all min-h-[44px] text-left",
                units === opt.value
                  ? "bg-[#CCFF00]/10 border-[#CCFF00]/40"
                  : "bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#555]"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                    units === opt.value
                      ? "border-[#CCFF00]"
                      : "border-[#555]"
                  )}
                >
                  {units === opt.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    units === opt.value ? "text-white" : "text-[#A0A0A0]"
                  )}
                >
                  {opt.label}
                </span>
              </div>
              <p className="text-xs text-[#555] mt-1 ml-5.5">{opt.desc}</p>
            </button>
          ))}
        </div>

        <p className="text-xs text-[#555]">
          Affects weight and measurement displays throughout the app.
        </p>
      </div>

      {/* Currency */}
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#CCFF00]" />
          <p className="text-sm font-semibold text-white">Currency</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "USD", label: "USD", desc: "US Dollar ($)" },
              { value: "CAD", label: "CAD", desc: "Canadian Dollar (CA$)" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateProfile({ currency: opt.value })}
              disabled={isPending}
              className={cn(
                "flex flex-col items-start px-4 py-3 rounded-lg border transition-all min-h-[44px] text-left",
                currency === opt.value
                  ? "bg-[#CCFF00]/10 border-[#CCFF00]/40"
                  : "bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#555]"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                    currency === opt.value
                      ? "border-[#CCFF00]"
                      : "border-[#555]"
                  )}
                >
                  {currency === opt.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    currency === opt.value ? "text-white" : "text-[#A0A0A0]"
                  )}
                >
                  {opt.label}
                </span>
              </div>
              <p className="text-xs text-[#555] mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>

        <p className="text-xs text-[#555]">
          Affects revenue and pricing displays throughout the app.
        </p>
      </div>

      {/* Language */}
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-5 space-y-4 opacity-60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#A0A0A0]" />
            <p className="text-sm font-semibold text-white">Language</p>
          </div>
          <span className="text-xs font-semibold bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] px-2 py-0.5 rounded-full">
            Coming Soon
          </span>
        </div>

        <select
          disabled
          className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-sm text-[#555] cursor-not-allowed"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>Portuguese (Brazil)</option>
          <option>French</option>
          <option>German</option>
          <option>Japanese</option>
          <option>Chinese (Simplified)</option>
        </select>

        <p className="text-xs text-[#555]">
          Multi-language support is coming in a future update.
        </p>
      </div>
    </div>
  );
}
