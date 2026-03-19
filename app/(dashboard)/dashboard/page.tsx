import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TodaysSchedule } from "@/components/dashboard/TodaysSchedule";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingSessions } from "@/components/dashboard/UpcomingSessions";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let displayName = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("business_name, full_name")
      .eq("id", user.id)
      .single();

    if (profile?.business_name) {
      displayName = profile.business_name;
    } else if (profile?.full_name) {
      displayName = profile.full_name.split(" ")[0] ?? "";
    }
  }

  const greeting = getGreeting();
  const headingText = displayName
    ? `${greeting}, ${displayName}`
    : greeting;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{headingText}</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">
          {format(today, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <TodaysSchedule />
        <div className="flex flex-col gap-6">
          <QuickActions />
          <UpcomingSessions />
        </div>
      </div>
    </div>
  );
}
