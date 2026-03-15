"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className ?? ""}`}
    >
      <Image
        src="/logo.png"
        alt="FitPilot Pro"
        width={36}
        height={36}
        className="rounded-lg"
        priority
      />
      <div className="leading-none">
        <span className="font-bold text-white text-sm tracking-tight">
          FitPilot
        </span>
        <span className="text-[10px] text-[#CCFF00] font-bold tracking-[0.15em] ml-1">
          PRO
        </span>
      </div>
    </Link>
  );
}
