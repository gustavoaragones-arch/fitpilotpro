"use client";

import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // HH:mm (24h)
  onChange: (value: string) => void;
  error?: boolean;
}

function generateTimeSlots(): { value: string; label: string }[] {
  const slots = [];
  for (let h = 5; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const ampm = h < 12 ? "AM" : "PM";
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const label = `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
      slots.push({ value, label });
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export function TimePicker({ value, onChange, error }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: "center" });
      }
    }
  }, [open]);

  const displayLabel = (() => {
    if (!value) return "Select time";
    const slot = TIME_SLOTS.find((s) => s.value === value);
    if (slot) return slot.label;
    const [h, m] = value.split(":").map(Number);
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  })();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2 bg-[#1A1A1A] border rounded-lg px-3 py-2.5 text-sm text-left transition-colors min-h-[44px]",
          error ? "border-[#EF4444]" : "border-[#3A3A3A]",
          open ? "border-[#CCFF00] ring-1 ring-[#CCFF00]/20" : "hover:border-[#555]",
          value ? "text-white" : "text-[#555]"
        )}
      >
        <Clock className="w-4 h-4 text-[#CCFF00] flex-shrink-0" />
        <span className="flex-1">{displayLabel}</span>
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute top-full left-0 mt-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl shadow-2xl z-[100] overflow-y-auto w-48"
          style={{ maxHeight: "280px" }}
        >
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot.value === value;
            return (
              <button
                key={slot.value}
                type="button"
                data-selected={isSelected}
                onClick={() => {
                  onChange(slot.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center px-4 py-2.5 text-sm transition-colors text-left min-h-[44px]",
                  isSelected
                    ? "bg-[#CCFF00] text-[#000000] font-semibold"
                    : "text-[#A0A0A0] hover:text-white hover:bg-[#313131]"
                )}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
