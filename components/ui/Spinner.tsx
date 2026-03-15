import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-6 h-6 border-2 border-[#3A3A3A] border-t-[#CCFF00] rounded-full animate-spin",
        className
      )}
    />
  );
}
