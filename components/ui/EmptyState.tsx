export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12 text-[#A0A0A0]">
      <p className="font-medium text-white">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}
