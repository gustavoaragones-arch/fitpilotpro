"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  ButtonHTMLAttributes,
  forwardRef,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/50";

    const variants = {
      primary:
        "bg-[#CCFF00] text-black hover:bg-[#B8E600]",
      secondary:
        "bg-[#2A2A2A] text-white border border-[#3A3A3A] hover:border-[#CCFF00]/40 hover:bg-[#333333]",
      ghost: "bg-transparent text-white hover:bg-[#2A2A2A]",
      outline:
        "bg-transparent text-[#CCFF00] border border-[#CCFF00] hover:bg-[#CCFF00]/10",
      danger:
        "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/20",
    };

    const sizes = {
      sm: "text-sm px-3 py-2 min-h-[36px]",
      md: "text-sm px-5 py-2.5 min-h-[44px]",
      lg: "text-base px-7 py-3.5 min-h-[52px]",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
