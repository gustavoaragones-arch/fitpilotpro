"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { IconArrowRight } from "@/icons/arrow-right";

const FAQs = [
  {
    question: "How does the client tier system work?",
    answer:
      "FitPilot Pro automatically classifies your clients into Diamond, Gold, or Silver tiers based on their session price, frequency, and payment model. Diamond clients (your top revenue generators) get priority sorting and visual highlighting. The algorithm updates automatically whenever you edit a client's pricing — no manual input needed.",
  },
  {
    question: "Can I use FitPilot Pro on my phone?",
    answer:
      "Yes. FitPilot Pro is a Progressive Web App — open it in your mobile browser and add it to your home screen for a native app experience. It's fully optimized for mobile with tap-friendly controls and a bottom navigation bar on smaller screens.",
  },
  {
    question: "Is my client data secure?",
    answer:
      "All data is stored in Supabase with Row Level Security — meaning your clients' data is only accessible by your account. Data is encrypted in transit (TLS) and at rest. We never share or sell client data to third parties.",
  },
  {
    question: "What happens when I hit the 5-client limit on the Free plan?",
    answer:
      "You'll see an upgrade prompt when you add your 5th client. Your existing clients and all their data remain accessible. You can upgrade to Professional at any time to unlock unlimited clients — no data is lost.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. Cancel anytime from Settings → Subscription → Manage Billing. Your access continues until the end of your current billing period. No cancellation fees, no questions asked.",
  },
  {
    question: "Does the route optimizer work for online trainers?",
    answer:
      "Route optimization is designed for mobile trainers who visit clients in person. If you train primarily online, you'll get more value from the scheduling, analytics, and client management features — the route optimizer simply won't show suggestions for virtual sessions.",
  },
  {
    question: "How does Travel Intelligence work when booking sessions?",
    answer:
      "When you open the Schedule Session modal and select a client, FitPilot Pro automatically calculates estimated drive time from your previous session to the new client, and from the new client to your next session. It shows a routing quality indicator (green/yellow/red) and a one-tap button to open the full route in Google Maps.",
  },
];
export function FrequentlyAskedQuestions() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto my-10 md:my-20 py-10 md:py-20 px-4 md:px-8">
      <div className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-center">
        <h2
          className={cn(
            "inline-block text-3xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#E8E8E8_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#E8E8E8_100%)]",
            "bg-clip-text text-transparent"
          )}
        >
          Let&apos;s Answer Your Questions
        </h2>
      </div>
      <p className="max-w-lg text-sm  text-center mx-auto mt-4 text-neutral-400 px-4 md:px-0">
        Everything you need to know about FitPilot Pro.
      </p>
      <div className="mt-10 md:mt-20 max-w-3xl mx-auto divide-y divide-neutral-800">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <motion.div
      className="cursor-pointer py-4 md:py-6"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="pr-8 md:pr-12">
          <h3 className="text-base md:text-lg font-medium text-neutral-200">
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden text-sm md:text-base text-neutral-400 mt-2"
              >
                <p>{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative mr-2 md:mr-4 mt-1 h-5 w-5 md:h-6 md:w-6 flex-shrink-0">
          <motion.div
            animate={{
              scale: isOpen ? [0, 1] : [1, 0, 1],
              rotate: isOpen ? 90 : 0,
              marginLeft: isOpen ? "1.5rem" : "0rem",
            }}
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconArrowRight className="absolute inset-0 h-5 w-5 md:h-6 md:w-6 transform text-white-500" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
