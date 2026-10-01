"use client";

import React, { ReactNode } from "react";
import { motion, useScroll, useSpring, HTMLMotionProps } from "framer-motion";

export type AnimationDirection = "up" | "down" | "left" | "right" | "zoom" | "none";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 28,
  once = true,
  className = "",
  ...rest
}: ScrollRevealProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, x: 0, scale: 1 };
      case "down":
        return { opacity: 0, y: -distance, x: 0, scale: 1 };
      case "left":
        return { opacity: 0, x: distance, y: 0, scale: 1 };
      case "right":
        return { opacity: 0, x: -distance, y: 0, scale: 1 };
      case "zoom":
        return { opacity: 0, scale: 0.94, x: 0, y: 0 };
      case "none":
      default:
        return { opacity: 0, x: 0, y: 0, scale: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container for lists, grids of cards, or badges.
 * Automatically delays each item sequentially on scroll into view.
 */
export function ScrollStagger({
  children,
  staggerDelay = 0.08,
  className = "",
  once = true,
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item inside a ScrollStagger
 */
export function ScrollStaggerItem({
  children,
  className = "",
  yOffset = 24,
}: {
  children: ReactNode;
  className?: string;
  yOffset?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Smooth top scroll progress bar
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-[var(--accent)] origin-left z-50 pointer-events-none"
    />
  );
}
