"use client";

import Image from "next/image";

interface LogoMarkProps {
  size?: number;
  className?: string;
  theme?: "light" | "dark";
}

export function LogoMark({ size = 36, className = "", theme = "light" }: LogoMarkProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-mark.png"
        alt="Help Zone Logo Mark"
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-contain"
        priority
      />
    </span>
  );
}

interface LogoProps {
  size?: number;
  wordmarkClassName?: string;
  className?: string;
  theme?: "light" | "dark";
  variant?: "horizontal" | "stacked" | "auto";
}

export function Logo({
  size = 36,
  wordmarkClassName = "",
  className = "",
  theme = "light",
  variant = "horizontal",
}: LogoProps) {
  // If wordmarkClassName indicates dark background (e.g. text-white in footer)
  const isDark = theme === "dark" || wordmarkClassName.includes("text-white");

  if (variant === "stacked") {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <Image
          src={isDark ? "/logo-white.png" : "/logo-full.png"}
          alt="Help Zone - Clean Homes, Happy Lives"
          width={size * 4}
          height={size * 3}
          className="h-auto object-contain"
          style={{ maxHeight: size * 2.5 }}
          priority
        />
      </div>
    );
  }

  // Horizontal logo layout (Mark + HelpZone + Slogan)
  // Height calculated from size parameter
  const height = size;
  const width = Math.round(height * 4.4); // Aspect ratio of logo-horizontal is ~1066 x 240 (~4.44)

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={isDark ? "/logo-horizontal-white.png" : "/logo-horizontal.png"}
        alt="Help Zone - Clean Homes, Happy Lives"
        width={width * 2}
        height={height * 2}
        className="h-auto object-contain"
        style={{ height: size, width: "auto", maxHeight: 48 }}
        priority
      />
    </span>
  );
}
