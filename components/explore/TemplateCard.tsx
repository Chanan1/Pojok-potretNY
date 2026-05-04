"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { toggleLike } from "@/lib/api-client";

interface TemplateCardProps {
  id: string;
  name: string;
  src: string;
  category: string;
  frameCount: number;
  likes: number;
  creator: string;
  isLiked?: boolean;
}

export function TemplateCard({ id, name, src, category, frameCount, likes: initialLikes, creator, isLiked: initialIsLiked = false }: TemplateCardProps) {
  const router = useRouter();
  const setTotalFrames = useAppStore((state) => state.setTotalFrames);
  
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);

  const handleClick = () => {
    setTotalFrames(frameCount);
    router.push(`/capture?template=${id}&frame=${frameCount}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    try {
      setIsLiking(true);
      // Optimistic update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikes(prev => newIsLiked ? prev + 1 : prev - 1);

      const res = await toggleLike(id);
      if (!res.success) {
        // Rollback on failure
        setIsLiked(isLiked);
        setLikes(likes);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Rollback on error
      setIsLiked(isLiked);
      setLikes(likes);
    } finally {
      setIsLiking(false);
    }
  };

  const formattedLikes = likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : likes.toString();

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-pink-50 bg-white shadow-[0_2px_12px_rgba(250,182,210,0.12)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-pink-200 hover:shadow-[0_20px_48px_rgba(236,72,153,0.16)]"
      onClick={handleClick}
    >
      {/* Image area — consistent aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-pink-50/50">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Top badges overlay */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 z-30">
          <span className="rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            {frameCount} Frame
          </span>
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium shadow-sm backdrop-blur-sm transition-all active:scale-90 ${
              isLiked ? "bg-pink-500 text-white" : "bg-white/90 text-slate-600 hover:text-pink-500"
            }`}
          >
            <svg className={`h-3 w-3 transition-colors ${isLiked ? "text-white" : "text-pink-400"}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isLiked ? "0" : "2.5"} viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {formattedLikes}
          </button>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/20">
          <div className="translate-y-3 rounded-full bg-white px-5 py-2 text-sm font-semibold text-pink-600 opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-pink-50">
            Gunakan →
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 p-4">
        <h3 className="text-sm font-bold text-pink-600 transition-colors duration-300 group-hover:text-pink-700 truncate">
          {name} <span className="text-pink-300">✿</span>
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-pink-50 px-2.5 py-1 text-pink-600">{category}</span>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>by {creator}</span>
            <span className="text-blue-500">●</span>
            <span>{frameCount} Frame</span>
          </div>
        </div>
      </div>
    </div>
  );
}
