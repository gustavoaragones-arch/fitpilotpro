"use client";
import React, { useEffect, useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export enum planType {
  free = "free",
  professional = "professional",
  elite = "elite",
  studio = "studio",
}

export type Plan = {
  id: string;
  name: string;
  shortDescription: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number;
  period: string;
  features: {
    text: string;
    included: boolean;
  }[];
  buttonText: string;
  subText?: string | React.ReactNode;
  onClick: () => void;
  isCtaLime?: boolean;
};

function getPlans(isAnnual: boolean): Array<Plan & { displayPrice: number }> {
  const raw: Plan[] = [
    {
      id: planType.free,
      name: "Free",
      shortDescription: "$0/mo",
      priceMonthly: 0,
      priceAnnual: 0,
      period: "mo",
      features: [
        { text: "Up to 5 active clients", included: true },
        { text: "Basic routine builder", included: true },
        { text: "Session scheduling", included: true },
        { text: "Manual progress tracking", included: true },
      ],
      buttonText: "Get Started Free",
      onClick: () => {},
    },
    {
      id: planType.professional,
      name: "Professional",
      shortDescription: "Most popular",
      badge: "MOST POPULAR",
      priceMonthly: 19.99,
      priceAnnual: 15.99,
      period: "mo",
      features: [
        { text: "Unlimited clients", included: true },
        { text: "Route optimization", included: true },
        { text: "Business analytics", included: true },
        { text: "Social media export", included: true },
        { text: "Progress PDF reports", included: true },
        { text: "Priority support", included: true },
      ],
      buttonText: "Go Professional",
      isCtaLime: true,
      onClick: () => {},
    },
    {
      id: planType.elite,
      name: "Elite",
      shortDescription: "",
      priceMonthly: 39.99,
      priceAnnual: 31.99,
      period: "mo",
      features: [
        { text: "Everything in Professional", included: true },
        { text: "AI scheduling assistant", included: true },
        { text: "Custom branding on reports", included: true },
        { text: "Client mobile app access", included: true },
        { text: "Advanced analytics", included: true },
      ],
      buttonText: "Upgrade to Elite",
      onClick: () => {},
    },
    {
      id: planType.studio,
      name: "Studio",
      shortDescription: "",
      priceMonthly: 99.99,
      priceAnnual: 99.99,
      period: "mo",
      features: [
        { text: "Everything in Elite", included: true },
        { text: "Multi-trainer management", included: true },
        { text: "White-label branding", included: true },
        { text: "Team scheduling", included: true },
        { text: "Centralized client database", included: true },
      ],
      buttonText: "Contact Sales",
      onClick: () => {},
    },
  ];
  return raw.map((p) => ({
    ...p,
    displayPrice: isAnnual ? p.priceAnnual : p.priceMonthly,
  }));
}

// Mobile Card Component
const MobileCard = ({ plan, isAnnual }: { plan: Plan & { displayPrice: number }; isAnnual: boolean }) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="bg-neutral-900 rounded-xl p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-semibold">{plan.name}</h3>
            <p className="text-sm text-neutral-400">{plan.shortDescription}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">${plan.displayPrice.toFixed(2)}</div>
            <div className="text-xs text-neutral-400">/{plan.period}{isAnnual ? " (billed annually)" : ""}</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {feature.included ? (
                <IconCheck className="h-4 w-4 text-neutral-400" />
              ) : (
                <IconX className="h-4 w-4 text-neutral-600" />
              )}
              <span
                className={cn(
                  "text-xs",
                  feature.included ? "text-neutral-300" : "text-neutral-500"
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {plan.id === planType.free && (
          <Link
            href="/signup"
            className="w-full inline-flex items-center justify-center bg-[#2A2A2A] text-white font-semibold text-sm px-5 py-3 rounded-lg border border-[#3A3A3A] hover:border-white/30 hover:bg-[#333] transition-all duration-150 min-h-[48px]"
          >
            Get Started Free
          </Link>
        )}
        {plan.id === planType.professional && (
          <Link
            href="/signup?plan=professional"
            className="w-full inline-flex items-center justify-center bg-[#CCFF00] text-black font-semibold text-sm px-5 py-3 rounded-lg hover:bg-[#B8E600] transition-all duration-150 min-h-[48px]"
          >
            Go Professional
          </Link>
        )}
        {plan.id === planType.elite && (
          <Link
            href="/signup?plan=elite"
            className="w-full inline-flex items-center justify-center bg-[#2A2A2A] text-white font-semibold text-sm px-5 py-3 rounded-lg border border-[#3A3A3A] hover:border-white/30 hover:bg-[#333] transition-all duration-150 min-h-[48px]"
          >
            Upgrade to Elite
          </Link>
        )}
        {plan.id === planType.studio && (
          <Link
            href="/contact"
            className="w-full inline-flex items-center justify-center bg-transparent text-white font-semibold text-sm px-5 py-3 rounded-lg border border-[#3A3A3A] hover:border-white/30 hover:bg-white/5 transition-all duration-150 min-h-[48px]"
          >
            Contact Sales
          </Link>
        )}

        {plan.subText && (
          <p className="text-xs text-neutral-500 text-center mt-2">
            {plan.subText}
          </p>
        )}
      </div>
    </div>
  );
};

// Desktop Card Component
const DesktopCard = ({ plan, isAnnual }: { plan: Plan & { displayPrice: number }; isAnnual: boolean }) => {
  return (
    <div
      className={cn(
        "relative rounded-3xl bg-neutral-900 p-8 ring-1 ring-neutral-700",
        plan.badge && "ring-1 ring-neutral-700"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-[#CCFF00] text-black text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <div className="inline-flex items-center font-bold justify-center p-2 rounded-[10px] border border-[rgba(62,62,64,0.77)] bg-[rgba(255,255,255,0)]">
            <h3 className="text-sm text-white">{plan.name}</h3>
          </div>
          <div>
            <p className="text-md text-neutral-400 my-4">
              {plan.shortDescription}
            </p>
          </div>
          <div className="mt-4">
            <span className="text-5xl font-bold text-white">${plan.displayPrice.toFixed(2)}</span>
            <span className="text-neutral-400 ml-2">/{plan.period}{isAnnual ? " (billed annually)" : ""}</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {feature.included ? (
                <IconCheck className="h-5 w-5 text-neutral-400" />
              ) : (
                <IconX className="h-5 w-5 text-neutral-600" />
              )}
              <span
                className={cn(
                  "text-sm",
                  feature.included ? "text-neutral-300" : "text-neutral-500"
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          {plan.id === planType.free && (
            <Link
              href="/signup"
              className="w-full inline-flex items-center justify-center bg-[#2A2A2A] text-white font-semibold text-sm px-5 py-3 rounded-xl border border-[#3A3A3A] hover:border-white/30 hover:bg-[#333] transition-all duration-150 min-h-[48px]"
            >
              Get Started Free
            </Link>
          )}
          {plan.id === planType.professional && (
            <Link
              href="/signup?plan=professional"
              className="w-full inline-flex items-center justify-center bg-[#CCFF00] text-black font-semibold text-sm px-5 py-3 rounded-xl hover:bg-[#B8E600] transition-all duration-150 min-h-[48px]"
            >
              Go Professional
            </Link>
          )}
          {plan.id === planType.elite && (
            <Link
              href="/signup?plan=elite"
              className="w-full inline-flex items-center justify-center bg-[#2A2A2A] text-white font-semibold text-sm px-5 py-3 rounded-xl border border-[#3A3A3A] hover:border-white/30 hover:bg-[#333] transition-all duration-150 min-h-[48px]"
            >
              Upgrade to Elite
            </Link>
          )}
          {plan.id === planType.studio && (
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center bg-transparent text-white font-semibold text-sm px-5 py-3 rounded-xl border border-[#3A3A3A] hover:border-white/30 hover:bg-white/5 transition-all duration-150 min-h-[48px]"
            >
              Contact Sales
            </Link>
          )}
          {plan.subText && (
            <div className="text-sm text-neutral-500 text-center mt-4">
              {plan.subText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function PricingList() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = getPlans(isAnnual);

  if (isMobile) {
    return (
      <div className="w-full px-4 py-4">
        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
              !isAnnual ? "bg-[#CCFF00] text-black" : "text-[#A0A0A0] hover:text-white"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
              isAnnual ? "bg-[#CCFF00] text-black" : "text-[#A0A0A0] hover:text-white"
            )}
          >
            Annual (Save 20%)
          </button>
        </div>
        <div className="max-w-md mx-auto">
          {plans.map((tier) => (
            <MobileCard plan={tier} isAnnual={isAnnual} key={tier.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setIsAnnual(false)}
          className={cn(
            "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
            !isAnnual ? "bg-[#CCFF00] text-black" : "text-[#A0A0A0] hover:text-white"
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setIsAnnual(true)}
          className={cn(
            "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
            isAnnual ? "bg-[#CCFF00] text-black" : "text-[#A0A0A0] hover:text-white"
          )}
        >
          Annual (Save 20%)
        </button>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((tier) => (
          <DesktopCard plan={tier} isAnnual={isAnnual} key={tier.id} />
        ))}
      </div>
    </div>
  );
}

export function Pricing() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      id="pricing"
      className="relative isolate w-full overflow-hidden px-4 py-16 md:py-40 pt-10 md:pt-60 lg:px-4"
    >
      {!isMobile && (
        <div className="pt-32 md:pt-48 mt-[600px]">
          <BackgroundShape />
        </div>
      )}
      <div
        className={cn(
          "z-20",
          isMobile ? "flex flex-col mt-0 relative" : "absolute inset-0 mt-80"
        )}
      >
        <div
          className={cn(
            "relative z-50 mx-auto mb-4",
            isMobile ? "w-full" : "max-w-4xl text-center"
          )}
        >
          <h2
            className={cn(
              "inline-block text-3xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#E8E8E8_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#E8E8E8_100%)] ",
              "bg-clip-text text-transparent"
            )}
          >
            Pricing
          </h2>
        </div>
        <p
          className={cn(
            "text-sm text-neutral-400 mt-4 px-4",
            isMobile ? "w-full" : "max-w-lg text-center mx-auto"
          )}
        >
          Choose the plan that fits your business. Annual billing saves 20%.
        </p>
        <div className="mx-auto mt-12 md:mt-20">
          <PricingList />
        </div>
      </div>
      {!isMobile && (
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            background:
              "linear-gradient(179.87deg, rgba(0, 0, 0, 0) 0.11%, rgba(0, 0, 0, 0.8) 69.48%, #000000 92.79%)",
          }}
        />
      )}
    </div>
  );
}

function BackgroundShape() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const size = isMobile ? 600 : 1400;
  const innerSize = isMobile ? 400 : 1000;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.1)]"
        style={{
          width: size,
          height: size,
          clipPath: "circle(50% at 50% 50%)",
          background: `
            radial-gradient(
              circle at center,
              rgba(40, 40, 40, 0.8) 0%,
              rgba(20, 20, 20, 0.6) 30%,
              rgba(0, 0, 0, 0.4) 70%
            )
          `,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? "20px 40px" : "60px 120px",
          }}
        />
      </div>
      <div
        className="absolute bg-black z-2 left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2 rounded-full 
          border border-[rgba(255,255,255,0.1)]
          shadow-[0_0_200px_80px_rgba(255,255,255,0.1)]"
        style={{
          width: innerSize,
          height: innerSize,
        }}
      />
    </div>
  );
}
