import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      {/* Flower Icon */}
      <div className="relative flex h-8 w-8 items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full text-pink-500 drop-shadow-sm"
          fill="currentColor"
        >
          {/* 5 Petals */}
          <circle cx="50" cy="20" r="18" />
          <circle cx="21" cy="41" r="18" />
          <circle cx="32" cy="74" r="18" />
          <circle cx="68" cy="74" r="18" />
          <circle cx="79" cy="41" r="18" />
          {/* Inner white circle */}
          <circle cx="50" cy="50" r="14" fill="white" />
        </svg>
      </div>

      {/* Text Group */}
      <div className="flex flex-col justify-center">
        <span className="text-[22px] font-black leading-none tracking-tight text-[#1e293b]">
          Pojok-Potret
        </span>
        <span className="mt-0.5 text-[8.5px] font-bold uppercase leading-none tracking-[0.2em] text-slate-400">
          Photo Booth Digital
        </span>
      </div>
    </Link>
  );
}
