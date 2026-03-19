"use client";

import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // yyyy-MM-dd
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  error,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() =>
    value ? parseISO(value) : new Date()
  );
  const ref = useRef<HTMLDivElement>(null);

  const selectedDate = value ? parseISO(value) : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewMonth)),
    end: endOfWeek(endOfMonth(viewMonth)),
  });

  const handleSelect = (day: Date) => {
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2 bg-[#1A1A1A] border rounded-lg px-3 py-2.5 text-sm text-left transition-colors min-h-[44px]",
          error ? "border-[#EF4444]" : "border-[#3A3A3A]",
          open ? "border-[#CCFF00] ring-1 ring-[#CCFF00]/20" : "hover:border-[#555]",
          selectedDate ? "text-white" : "text-[#555]"
        )}
      >
        <Calendar className="w-4 h-4 text-[#CCFF00] flex-shrink-0" />
        <span className="flex-1">
          {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl shadow-2xl z-[100] p-4 w-72 select-none">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewMonth((d) => subMonths(d, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-white">
              {format(viewMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth((d) => addMonths(d, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-medium text-[#555] py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day) => {
              const inMonth = isSameMonth(day, viewMonth);
              const today = isToday(day);
              const selected = selectedDate
                ? isSameDay(day, selectedDate)
                : false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "flex items-center justify-center rounded-lg h-9 text-xs transition-all min-h-[44px]",
                    !inMonth && "opacity-20 pointer-events-none",
                    selected && "bg-[#CCFF00] text-[#000000] font-bold",
                    !selected &&
                      today &&
                      "text-[#CCFF00] font-bold hover:bg-[#3A3A3A]",
                    !selected &&
                      !today &&
                      inMonth &&
                      "text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A]"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-[#3A3A3A] flex justify-end">
            <button
              type="button"
              onClick={() => {
                handleSelect(new Date());
                setViewMonth(new Date());
              }}
              className="text-xs text-[#CCFF00] hover:text-[#B8E600] font-medium transition-colors min-h-[44px]"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
