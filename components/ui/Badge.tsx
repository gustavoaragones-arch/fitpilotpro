import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#3A3A3A] text-[#A0A0A0]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
