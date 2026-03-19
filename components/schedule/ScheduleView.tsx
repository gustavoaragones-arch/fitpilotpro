"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Plus, Calendar } from "lucide-react";
import { MiniCalendar } from "./MiniCalendar";
import { SessionRow, type SessionRowSession } from "./SessionRow";
import { SessionModal, type SessionForEdit } from "./SessionModal";
import { useMonthSessions, useDaySessions } from "@/hooks/useSchedule";

function SkeletonRows() {
  return (
    <div className="divide-y divide-[#3A3A3A]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4 animate-pulse"
        >
          <div className="w-14 space-y-1.5">
            <div className="w-10 h-4 bg-[#3A3A3A] rounded mx-auto" />
            <div className="w-6  h-3 bg-[#3A3A3A] rounded mx-auto" />
          </div>
          <div className="w-px h-10 bg-[#3A3A3A]" />
          <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 bg-[#3A3A3A] rounded" />
            <div className="w-48 h-3 bg-[#3A3A3A] rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-5 bg-[#3A3A3A] rounded-full" />
            <div className="w-16 h-5 bg-[#3A3A3A] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScheduleView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionRowSession | null>(null);

  const { data: monthSessions = [] } = useMonthSessions(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );
  const { data: daySessions = [], isLoading } = useDaySessions(selectedDate);
  const sessionDates = (monthSessions as { scheduled_at: string }[]).map(
    (s) => s.scheduled_at
  );

  const handleEdit = (session: SessionRowSession) => {
    setEditingSession(session);
    setModalOpen(true);
  };
  const handleAdd = () => {
    setEditingSession(null);
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setEditingSession(null);
  };

  const todaySelected = isSameDay(selectedDate, new Date());
  const dateLabel = todaySelected
    ? `Today · ${format(selectedDate, "MMMM d")}`
    : format(selectedDate, "EEEE, MMMM d");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Schedule</h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            {format(new Date(), "MMMM yyyy")}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#000000] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Add Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        <div className="lg:sticky lg:top-8">
          <MiniCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            sessionDates={sessionDates}
          />
        </div>

        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#3A3A3A]">
            <div>
              <h2 className="text-base font-semibold text-white">
                {dateLabel}
              </h2>
              {!isLoading && (
                <p className="text-xs text-[#A0A0A0] mt-0.5">
                  {daySessions.length > 0
                    ? `${daySessions.length} session${daySessions.length !== 1 ? "s" : ""}`
                    : "No sessions"}
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-white border border-[#3A3A3A] hover:border-[#555] rounded-lg px-3 py-2 transition-all min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {isLoading ? (
            <SkeletonRows />
          ) : daySessions.length > 0 ? (
            <div className="divide-y divide-[#3A3A3A]">
              {(daySessions as SessionRowSession[]).map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  onEdit={() => handleEdit(session)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 bg-[#CCFF00]/10 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[#CCFF00]" />
              </div>
              <p className="text-sm font-medium text-white mb-1">
                No sessions
              </p>
              <p className="text-xs text-[#A0A0A0] mb-5">
                {format(selectedDate, "MMMM d")} is free. Schedule a session?
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#000000] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px]"
              >
                <Plus className="w-4 h-4" /> Schedule Session
              </button>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <SessionModal
          session={editingSession as SessionForEdit | null}
          defaultDate={selectedDate}
          onClose={handleClose}
          onSaved={handleClose}
        />
      )}
    </div>
  );
}
