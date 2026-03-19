"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProfileTab } from "./ProfileTab";
import { SubscriptionTab } from "./SubscriptionTab";
import { UnitsLanguageTab } from "./UnitsLanguageTab";
import { DangerZoneTab } from "./DangerZoneTab";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "subscription", label: "Subscription" },
  { id: "units", label: "Units & Language" },
  { id: "danger", label: "Danger Zone" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsView() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  useEffect(() => {
    const tab = searchParams.get("tab") as TabId | null;
    if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-all min-h-[36px]",
              activeTab === tab.id
                ? "bg-[#CCFF00] text-[#000000]"
                : "text-[#A0A0A0] hover:text-white",
              tab.id === "danger" &&
                activeTab !== "danger" &&
                "hover:text-[#EF4444]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-xl">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "subscription" && <SubscriptionTab />}
        {activeTab === "units" && <UnitsLanguageTab />}
        {activeTab === "danger" && <DangerZoneTab />}
      </div>
    </div>
  );
}
