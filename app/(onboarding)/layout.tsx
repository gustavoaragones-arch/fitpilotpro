export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
