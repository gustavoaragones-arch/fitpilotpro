import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn("w-10 h-10 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center text-sm font-medium text-[#A0A0A0]",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
