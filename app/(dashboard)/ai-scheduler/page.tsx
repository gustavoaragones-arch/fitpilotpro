import Link from "next/link";
import { Bot } from "lucide-react";

export default function AISchedulerPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Bot className="w-8 h-8 text-[#CCFF00]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">AI Scheduler</h1>
        <p className="text-sm text-[#A0A0A0] mb-6">
          Available on Elite and Studio plans. Let AI optimize your training
          schedule for maximum client results.
        </p>
        <Link
          href="/settings?tab=subscription"
          className="inline-flex items-center justify-center bg-[#CCFF00] text-[#000000] font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px]"
        >
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
}
