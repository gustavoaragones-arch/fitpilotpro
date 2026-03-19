"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }: LoginForm) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError("Incorrect email or password. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#CCFF00] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(204,255,0,0.15)]">
          <Image
            src="/logo.png"
            alt="FitPilot Pro"
            width={40}
            height={40}
            className="rounded-xl"
          />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">
          Sign in to your FitPilot Pro account
        </p>
      </div>

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6">
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#111] border border-[#2A2A2A]
                     rounded-lg px-4 py-3 text-sm font-medium text-white
                     hover:border-[#3A3A3A] hover:bg-[#161616] transition-all
                     min-h-[44px] mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#2A2A2A]" />
          <span className="text-xs text-[#555]">or continue with email</span>
          <div className="flex-1 h-px bg-[#2A2A2A]" />
        </div>

        {authError && (
          <div className="mb-4 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
            <p className="text-sm text-[#EF4444]">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#A0A0A0] mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5
                           text-white text-sm placeholder:text-[#444]
                           focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20
                           transition-colors min-h-[44px]"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[#EF4444] mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[#A0A0A0]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#CCFF00] hover:text-[#B8E600] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
              <input
                {...register("password")}
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg pl-10 pr-11 py-2.5
                           text-white text-sm placeholder:text-[#444]
                           focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20
                           transition-colors min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#A0A0A0] transition-colors"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#EF4444] mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#CCFF00] text-black font-semibold text-sm rounded-lg py-3
                       hover:bg-[#B8E600] active:scale-[0.98] transition-all
                       min-h-[48px] flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[#A0A0A0] mt-5">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#CCFF00] font-medium hover:text-[#B8E600] transition-colors"
        >
          Start for free
        </Link>
      </p>
    </div>
  );
}
