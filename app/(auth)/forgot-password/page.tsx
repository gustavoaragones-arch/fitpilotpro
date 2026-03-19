"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});
type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ForgotForm) => {
    await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings/reset-password`,
    });
    setEmail(data.email);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-[#CCFF00]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-[#CCFF00]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Check your email
          </h2>
          <p className="text-sm text-[#A0A0A0] mb-1">
            We sent a reset link to
          </p>
          <p className="text-sm text-white font-medium mb-5">{email}</p>
          <p className="text-xs text-[#555] mb-6">
            Check your spam folder if you don&apos;t see it within a minute.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-[#CCFF00] font-medium hover:text-[#B8E600] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Reset password</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#A0A0A0] mb-1.5 block">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 transition-colors min-h-[44px]"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[#EF4444] mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#CCFF00] text-black font-semibold text-sm rounded-lg py-3 hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Send Reset Link
          </button>
        </form>
      </div>
      <div className="text-center mt-5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#A0A0A0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>
      </div>
    </div>
  );
}
