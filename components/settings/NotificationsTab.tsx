"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/Switch";

const NOTIFICATIONS = [
  {
    key: "session_reminders",
    label: "Session Reminders",
    description: "Get notified 24 hours before each scheduled session",
  },
  {
    key: "payment_reminders",
    label: "Payment Reminders",
    description: "Reminders for unpaid sessions",
  },
  {
    key: "weekly_summary",
    label: "Weekly Revenue Summary",
    description: "A weekly digest of your revenue and sessions",
  },
  {
    key: "new_client_welcome",
    label: "New Client Welcome",
    description: "Send a welcome notification when adding a new client",
  },
];

const STORAGE_KEY = "fitpilot_notifications";

function loadPrefs(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setMounted(true);
  }, []);

  const toggle = (key: string) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        {NOTIFICATIONS.map((n) => (
          <div key={n.key} className="h-16 bg-[#2A2A2A] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {NOTIFICATIONS.map((n) => (
        <div
          key={n.key}
          className="flex items-center justify-between gap-4 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl px-5 py-4 hover:bg-[#1E1E1E] transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-white">{n.label}</p>
            <p className="text-xs text-[#A0A0A0] mt-0.5">{n.description}</p>
          </div>
          <Switch
            checked={prefs[n.key] ?? false}
            onChange={() => toggle(n.key)}
          />
        </div>
      ))}

      <p className="text-xs text-[#555] pt-2 px-1">
        Notification preferences are stored locally. Email notification
        integration coming in a future update.
      </p>
    </div>
  );
}
