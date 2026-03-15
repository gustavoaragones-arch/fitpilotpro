import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QueryProvider } from "@/components/providers/QueryProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  return (
    <QueryProvider>
      <div className="min-h-screen bg-[#1A1A1A] flex">
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        <div className="flex-1 md:ml-[220px] flex flex-col min-h-screen">
          <main className="flex-1 p-6 pb-24 md:pb-6">{children}</main>
        </div>

        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </QueryProvider>
  );
}
