"use client";

import { useState } from "react";
import { Check, Zap, ExternalLink } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { format, parseISO } from "date-fns";

const PLAN_DETAILS: Record<
  string,
  {
    name: string;
    price: string;
    features: string[];
    color: string;
  }
> = {
  free: {
    name: "Free",
    price: "$0/mo",
    features: [
      "Up to 5 clients",
      "Dashboard & scheduling",
      "Client management",
      "Routine library",
      "Progress tracking",
    ],
    color: "text-[#A0A0A0]",
  },
  professional: {
    name: "Professional",
    price: "$19.99/mo",
    features: [
      "Unlimited clients",
      "Route optimizer",
      "Analytics dashboard",
      "Social export",
      "Priority support",
    ],
    color: "text-[#60A5FA]",
  },
  elite: {
    name: "Elite",
    price: "$39.99/mo",
    features: [
      "Everything in Professional",
      "AI Scheduler",
      "Custom branding",
      "Client app access",
      "Advanced analytics",
    ],
    color: "text-[#CCFF00]",
  },
  studio: {
    name: "Studio",
    price: "$99.99/mo",
    features: [
      "Everything in Elite",
      "Multi-trainer management",
      "White-label",
      "Team scheduling",
      "Dedicated support",
    ],
    color: "text-[#FACC15]",
  },
};

const UPGRADE_PATH: Record<string, string> = {
  free: "professional",
  professional: "elite",
  elite: "studio",
};

export function SubscriptionTab() {
  const { tier, profile, isLoading } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const currentPlan = PLAN_DETAILS[tier] ?? PLAN_DETAILS.free;
  const nextTierId = UPGRADE_PATH[tier];
  const nextPlan = nextTierId ? PLAN_DETAILS[nextTierId] : null;

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    if (!priceId) {
      alert("Upgrade temporarily unavailable. Please contact support@fitpilotpro.app");
      return;
    }
    setUpgradeError(null);
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch {
      setUpgradeLoading(false);
      setUpgradeError("Unable to start checkout. Please try again or contact support.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-[#3A3A3A] rounded-xl" />
        <div className="h-32 bg-[#3A3A3A] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Current plan */}
      <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-1">
              Current Plan
            </p>
            <p className="text-2xl font-bold text-white">{currentPlan.name}</p>
            <p className={`text-sm font-semibold mt-0.5 ${currentPlan.color}`}>
              {currentPlan.price}
            </p>
          </div>
          {tier !== "free" && (
            <button
              onClick={handleManage}
              disabled={portalLoading}
              className="flex items-center gap-1.5 text-sm text-[#A0A0A0] hover:text-white border border-[#3A3A3A] hover:border-[#555] px-4 py-2 rounded-lg transition-all min-h-[44px] disabled:opacity-60"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {portalLoading ? "Loading..." : "Manage"}
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {currentPlan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-[#A0A0A0]">
              <Check className="w-4 h-4 text-[#4ADE80] shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {profile?.subscription_period_end && tier !== "free" && (
          <p className="text-xs text-[#555] mt-4">
            Next billing:{" "}
            {format(
              parseISO(profile.subscription_period_end),
              "MMMM d, yyyy"
            )}
          </p>
        )}
      </div>

      {/* Free usage bar */}
      {tier === "free" && (
        <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-5">
          <p className="text-sm text-[#A0A0A0] mb-2">
            You&apos;re on the Free plan
          </p>
          <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-2">
            <span>Client usage</span>
            <span>5 max</span>
          </div>
          <div className="w-full bg-[#3A3A3A] rounded-full h-2">
            <div
              className="bg-[#CCFF00] h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, 0)}%` }}
            />
          </div>
        </div>
      )}

      {/* Upgrade section */}
      {nextPlan && (
        <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#CCFF00]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Upgrade to {nextPlan.name}
              </p>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                {nextPlan.price} — unlock more features
              </p>
            </div>
          </div>

          <ul className="space-y-1.5 mb-4">
            {nextPlan.features.slice(0, 3).map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-xs text-[#A0A0A0]"
              >
                <Check className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade("")}
            disabled={upgradeLoading}
            className="w-full bg-[#CCFF00] text-[#000000] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-60"
          >
            {upgradeLoading ? "Loading..." : `Upgrade to ${nextPlan.name}`}
          </button>
          {upgradeError && (
            <p className="text-xs text-[#EF4444] mt-2 text-center">{upgradeError}</p>
          )}
        </div>
      )}
    </div>
  );
}
