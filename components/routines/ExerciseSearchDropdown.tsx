"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useExercises } from "@/hooks/useRoutines";
import type { Exercise } from "@/types";

interface ExerciseSearchDropdownProps {
  onSelect: (exercise: Exercise) => void;
  excludeIds?: string[];
}

function getEquipmentDisplay(equipment: string | string[] | null): string {
  if (!equipment) return "";
  if (Array.isArray(equipment)) return equipment.join(", ");
  return String(equipment);
}

function getMuscleDisplay(muscle_groups: string[] | null): string {
  if (!muscle_groups || muscle_groups.length === 0) return "";
  return muscle_groups.slice(0, 3).join(", ");
}

export function ExerciseSearchDropdown({
  onSelect,
  excludeIds = [],
}: ExerciseSearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: exercises = [] } = useExercises(query.length >= 1 ? query : undefined);

  const filtered = exercises.filter((e) => !excludeIds.includes(e.id));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (ex: Exercise) => {
    onSelect(ex);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search exercises to add..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]"
        />
      </div>

      {open && (query.length >= 1 || filtered.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#A0A0A0]">
              No exercises found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleSelect(ex)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#313131] transition-colors text-left min-h-[44px]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {ex.name}
                  </p>
                  <p className="text-xs text-[#A0A0A0] mt-0.5">
                    {getMuscleDisplay(ex.muscle_groups)}
                    {getEquipmentDisplay(ex.equipment) && (
                      <span className="text-[#555]">
                        {" "}
                        · {getEquipmentDisplay(ex.equipment)}
                      </span>
                    )}
                  </p>
                </div>
                {ex.difficulty && (
                  <span className="text-xs text-[#A0A0A0] shrink-0 capitalize mt-0.5">
                    {ex.difficulty}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
