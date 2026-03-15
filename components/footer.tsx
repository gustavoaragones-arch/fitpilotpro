import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Linkedin, MessageCircle } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Login" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookies", label: "Cookie Notice" },
];

const SOCIAL_LINKS = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://discord.com", icon: MessageCircle, label: "Discord" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1E1E1E] bg-[#0A0A0A]">
      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12">
        {/* Left — Brand */}
        <div className="flex flex-col gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <Image
              src="/logo.png"
              alt="FitPilot Pro"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <div className="leading-none">
              <span className="font-bold text-white text-sm">FitPilot</span>
              <span className="text-[10px] text-[#CCFF00] font-bold tracking-[0.15em] ml-1">
                PRO
              </span>
            </div>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-[#666] max-w-[220px] leading-relaxed">
            Built for trainers who are serious about their business.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#2A2A2A] text-[#666] hover:text-white hover:border-[#3A3A3A] transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Middle — Product links */}
        <div>
          <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
            Product
          </p>
          <ul className="space-y-3">
            {PRODUCT_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[#666] hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Legal links */}
        <div>
          <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
            Legal
          </p>
          <ul className="space-y-3">
            {LEGAL_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[#666] hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#444]">
            © 2026 Albor Digital LLC. All rights reserved.
          </p>
          <p className="text-xs text-[#444]">
            Built for trainers who are serious about their business.
          </p>
        </div>
      </div>
    </footer>
  );
}
