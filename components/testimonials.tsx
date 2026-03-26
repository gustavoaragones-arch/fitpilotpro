"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "motion/react";

export function Testimonials() {
  return (
    <div className="w-full max-w-7xl mx-auto my-20 py-20 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Title Section - 40% */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-20">
            <h2
              className={cn(
                "text-3xl text-center lg:text-left md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#E8E8E8_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#E8E8E8_100%)] ",
                "bg-clip-text text-transparent leading-tight"
              )}
            >
              What trainers <br />
              say about us
            </h2>
            <p className="text-sm text-center lg:text-left mx-auto lg:mx-0 text-neutral-400 mt-6 max-w-sm">
              Join 500+ trainers who run their business on FitPilot Pro.
            </p>
          </div>
        </div>

        {/* Right Testimonials Section - 60% */}
        <div className="w-full grid gap-8 grid-cols-1 lg:grid-cols-2 md:w-[60%] mx-auto">
          <TestimonialCard
            name="Sarah K."
            role="Personal Trainer, Austin TX"
            initials="SK"
            quote="I used to spend 3 hours every Sunday planning my schedule and tracking payments in spreadsheets. FitPilot killed that. Now it takes me 20 minutes."
          />
          <TestimonialCard
            name="Marcus T."
            role="Mobile Trainer, Los Angeles CA"
            initials="MT"
            quote="The route optimizer alone saves me $200/month in gas. That pays for the subscription 10x over."
            className="lg:mt-[50px]"
          />
          <TestimonialCard
            name="Priya M."
            role="Strength Coach, Toronto"
            initials="PM"
            quote="My Diamond clients get better service because I actually know who they are. Retention went up 40% in 3 months."
            className="lg:mt-[-50px]"
          />
          <TestimonialCard
            name="David R."
            role="CrossFit Coach, Miami FL"
            initials="DR"
            quote="The AI scheduler figured out a weekly plan for my 12 clients that I never would have built manually. It's scary good."
          />
        </div>
      </div>
    </div>
  );
}

const TestimonialCard = ({
  name,
  role,
  initials,
  quote,
  className,
}: {
  name: string;
  role: string;
  initials: string;
  quote: string;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "flex flex-col h-96 p-8 rounded-[17px]",
        "border border-[#474747]",
        "bg-white bg-[linear-gradient(178deg,#2E2E2E_0.37%,#0B0B0B_38.61%),linear-gradient(180deg,#4C4C4C_0%,#151515_100%),linear-gradient(180deg,#2E2E2E_0%,#0B0B0B_100%)]",
        "relative isolate",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#CCFF00]/15 flex items-center justify-center flex-shrink-0">
          <span className="text-[#CCFF00] font-bold text-lg">{initials}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-neutral-400">{role}</p>
        </div>
      </div>
      <p className="text-lg text-neutral-300 leading-relaxed">
        &quot;{quote}&quot;
      </p>
    </motion.div>
  );
};
