export function Modal({
  open,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-[#2A2A2A] rounded-2xl border border-[#3A3A3A] p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
