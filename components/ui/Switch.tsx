"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onChange, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex items-center rounded-full transition-colors duration-150",
        "w-11 min-w-[44px] h-6",
        checked ? "bg-[#CCFF00]" : "bg-[#3A3A3A]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-150",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
