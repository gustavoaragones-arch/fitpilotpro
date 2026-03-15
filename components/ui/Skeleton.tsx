import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse bg-[#3A3A3A] rounded-lg", className)}
    />
  );
}
