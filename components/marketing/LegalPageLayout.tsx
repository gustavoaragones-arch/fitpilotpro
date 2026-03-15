import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Page header */}
      <div className="border-b border-[#1E1E1E]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#555]">
            <span>{subtitle}</span>
            <span className="hidden md:inline text-[#2A2A2A]">·</span>
            <span>{lastUpdated}</span>
            <span className="hidden md:inline text-[#2A2A2A]">·</span>
            <span>Albor Digital LLC</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="prose-legal">{children}</div>

        {/* Contact footer */}
        <div className="mt-16 pt-8 border-t border-[#1E1E1E]">
          <p className="text-sm text-[#555] text-center">
            Questions? Contact us at{" "}
            <a
              href="mailto:contact@albor.digital"
              className="text-[#CCFF00] hover:text-[#B8E600] transition-colors"
            >
              contact@albor.digital
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
