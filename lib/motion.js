'use client';

import { useReducedMotion } from 'framer-motion';

/**
 * Shared transition configurations for framer-motion to keep animations
 * consistent across the app.
 */
export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  easeOut: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  },
  fast: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.15,
  }
};

/**
 * Helper hook to wrap framer-motion props with reduced motion checks.
 * If reduced motion is enabled, it returns instantaneous or simplified animations.
 * 
 * Usage: <motion.div {...useAccessibleMotion({ initial: {opacity: 0}, animate: {opacity: 1} })} />
 */
export function useAccessibleMotion(motionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.01 }, // Instant fade
    };
  }

  return motionProps;
}
