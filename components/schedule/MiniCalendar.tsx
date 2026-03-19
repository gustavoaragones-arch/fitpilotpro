"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  sessionDates?: string[];
}

export function MiniCalendar({
  selectedDate,
  onSelectDate,
  sessionDates = [],
}: MiniCalendarProps) {
  const [viewMonth, setViewMonth] = useState(new Date(selectedDate));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewMonth)),
    end: endOfWeek(endOfMonth(viewMonth)),
  });

  const hasSession = (date: Date) =>
    sessionDates.some((s) => isSameDay(new Date(s), date));

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl p-5 select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))
          }
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-semibold text-white">
          {format(viewMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() =>
            setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))
          }
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
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
          const selected = isSameDay(day, selectedDate);
          const hasSess = hasSession(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg py-1.5 transition-all min-h-[36px] text-xs",
                !inMonth && "opacity-20 pointer-events-none",
                selected && today && "bg-[#CCFF00] text-[#000000] font-bold",
                selected &&
                  !today &&
                  "bg-[#CCFF00]/15 border border-[#CCFF00]/50 text-white font-semibold",
                !selected && today && "text-[#CCFF00] font-bold",
                !selected &&
                  !today &&
                  inMonth &&
                  "text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A]"
              )}
            >
              <span className="leading-none">{format(day, "d")}</span>
              {hasSess && (
                <span
                  className={cn(
                    "w-1 h-1 rounded-full mt-0.5",
                    selected && today ? "bg-black/40" : "bg-[#CCFF00]"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
