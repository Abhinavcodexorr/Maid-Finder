"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";

/**
 * Wraps children in a card that tilts in 3D space toward the cursor, with a
 * glossy light sweep and a subtle lift. Gracefully does nothing on touch
 * devices (no mousemove), so it never gets in the way on mobile.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  glare = true,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const hovering = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);
  const liftScale = useSpring(useTransform(hovering, [0, 1], [1, scale]), springConfig);
  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);
  const glareOpacity = useSpring(useTransform(hovering, [0, 1], [0, 0.35]), springConfig);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8), transparent 60%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleEnter() {
    hovering.set(1);
  }

  function handleLeave() {
    hovering.set(0);
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, scale: liftScale, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            style={{
              opacity: glareOpacity,
              background: glareBackground,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
