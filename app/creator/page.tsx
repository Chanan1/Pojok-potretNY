import { CreatorHero } from "@/components/creator/CreatorHero";
import { UploadCard } from "@/components/creator/UploadCard";
import { TemplateManagerCard } from "@/components/creator/TemplateManagerCard";
import { StatsCard } from "@/components/creator/StatsCard";
import { TemplateList } from "@/components/creator/TemplateList";
import { CreatorTips } from "@/components/creator/CreatorTips";

export const metadata = {
  title: "Creator Hub | Pojok•Potret",
  description: "Kelola template photobooth dan lihat performa karyamu.",
};

export default function CreatorHubPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-10">
      {/* 1. HERO SECTION */}
      <CreatorHero />

      {/* 2. ACTION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadCard />
          <TemplateManagerCard />
        </div>
        <StatsCard />
      </div>

      {/* 3. TEMPLATE + INFO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TemplateList />
        </div>
        <div className="lg:col-span-1">
          <CreatorTips />
        </div>
      </div>
    </div>
  );
}
