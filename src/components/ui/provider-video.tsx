"use client";

import { useRef, useState } from "react";

/**
 * A provider's intro video shown as a thumbnail (a frame near the start) with a
 * play button. Tapping play starts it in place without leaving the page, so it
 * also works inside a card that links to the profile.
 */
export function ProviderVideo({
  src,
  className = "",
  rounded = "",
  size = "md",
  controlsWhenPlaying = false,
}: {
  src: string;
  className?: string;
  rounded?: string;
  size?: "sm" | "md" | "lg";
  controlsWhenPlaying?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const button = size === "lg" ? "h-20 w-20" : size === "sm" ? "h-10 w-10" : "h-14 w-14";

  const toggle = (e: React.MouseEvent) => {
    // Cards are links to the profile; playing the video must not navigate.
    e.preventDefault();
    e.stopPropagation();
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <div className={`relative z-0 overflow-hidden bg-black ${rounded} ${className}`}>
      {!ready && <div className="shimmer absolute inset-0 z-10" />}
      <video
        ref={ref}
        src={`${src}#t=0.5`}
        preload="metadata"
        playsInline
        loop
        controls={controlsWhenPlaying && playing}
        onLoadedData={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      {ready && !(controlsWhenPlaying && playing) && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video introduction" : "Play video introduction"}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 transition-colors hover:bg-black/20"
        >
          <span
            className={`flex ${button} items-center justify-center rounded-full bg-white/95 shadow-xl transition-all ${playing ? "scale-75 opacity-60" : ""}`}
            style={{ color: "var(--primary)" }}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 translate-x-[7%]" fill="currentColor" aria-hidden><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
