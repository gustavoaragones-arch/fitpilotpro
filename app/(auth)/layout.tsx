import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <header className="px-6 py-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <Image
            src="/logo.png"
            alt="FitPilot Pro"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="leading-none">
            <span className="font-bold text-white text-sm">FitPilot</span>
            <span className="text-[10px] text-[#CCFF00] font-bold tracking-[0.15em] ml-1">
              PRO
            </span>
          </div>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>

      <footer className="px-6 py-4 text-center flex-shrink-0">
        <p className="text-xs text-[#444]">
          © 2026 Albor Digital LLC.{" "}
          <Link
            href="/terms"
            className="hover:text-[#A0A0A0] transition-colors"
          >
            Terms
          </Link>
          {" · "}
          <Link
            href="/privacy"
            className="hover:text-[#A0A0A0] transition-colors"
          >
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  );
}
