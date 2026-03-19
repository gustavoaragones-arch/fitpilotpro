import Link from "next/link";
import { UserPlus, CalendarPlus, Dumbbell, ChevronRight } from "lucide-react";

const ACTIONS = [
  {
    href: "/clients?action=new",
    icon: UserPlus,
    label: "Add New Client",
    description: "Create a client profile",
  },
  {
    href: "/schedule?action=new",
    icon: CalendarPlus,
    label: "Schedule Session",
    description: "Book a training session",
  },
  {
    href: "/routines?action=new",
    icon: Dumbbell,
    label: "Create Routine",
    description: "Build a workout template",
  },
];

export function QuickActions() {
  return (
    <div className="bg-[#2A2A2A] rounded-2xl border border-[#3A3A3A] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#3A3A3A]">
        <h2 className="text-base font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="divide-y divide-[#3A3A3A]">
        {ACTIONS.map(({ href, icon: Icon, label, description }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#313131] transition-colors group min-h-[60px]"
          >
            <div className="w-9 h-9 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#CCFF00]/20 transition-colors">
              <Icon className="w-4 h-4 text-[#CCFF00]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-[#A0A0A0]">{description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#555] group-hover:text-[#A0A0A0] transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
