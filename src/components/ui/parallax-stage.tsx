"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/**
 * A 3D stage that turns toward the cursor. Children keep their 3D position
 * (`transformStyle: preserve-3d`), so anything given a `translateZ` floats
 * in front of the rest and shifts with parallax as the stage rotates.
 * Does nothing on touch devices or when reduced motion is requested.
 */
export function ParallaxStage({
  children,
  className = "",
  maxRotate = 9,
}: {
  children: ReactNode;
  className?: string;
  maxRotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const spring = { stiffness: 120, damping: 18, mass: 0.8 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxRotate, -maxRotate]), spring);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxRotate, maxRotate]), spring);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div style={{ perspective: 1400 }} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div ref={ref} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        {children}
      </motion.div>
    </div>
  );
}
