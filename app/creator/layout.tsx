import { CreatorNavbar } from "@/components/creator/CreatorNavbar";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col">
      <CreatorNavbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
