"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGift } from "@/contexts/GiftContext";

// ============================================
// Per-gift animation configs
// ============================================

interface ParticleConfig {
  count: number;
  emoji: string;
  spread: number;
}

const GIFT_PARTICLES: Record<string, ParticleConfig> = {
  palma: { count: 8, emoji: "\u{1F44F}", spread: 200 },
  fogo: { count: 12, emoji: "\u{1F525}", spread: 180 },
  raio: { count: 6, emoji: "\u26A1", spread: 250 },
  trofeu: { count: 8, emoji: "\u{1F3C6}", spread: 160 },
  diamante: { count: 14, emoji: "\u2728", spread: 220 },
  coroa: { count: 10, emoji: "\u{1F451}", spread: 190 },
  estrela: { count: 16, emoji: "\u2B50", spread: 240 },
  personalizado: { count: 8, emoji: "\u{1F3AF}", spread: 180 },
};

const giftMainVariants = {
  initial: { scale: 0, opacity: 0, rotate: -30 },
  animate: {
    scale: [0, 1.6, 1.2],
    opacity: [0, 1, 1, 0],
    rotate: [-30, 10, 0],
    transition: { duration: 2.5, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.3 } },
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ============================================
// Particle component
// ============================================

function Particle({ emoji, index, spread }: { emoji: string; index: number; spread: number }) {
  const angle = (index / 12) * Math.PI * 2 + randomBetween(-0.3, 0.3);
  const distance = randomBetween(spread * 0.4, spread);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance - randomBetween(50, 150); // float upward
  const delay = randomBetween(0.1, 0.6);
  const duration = randomBetween(1.5, 2.5);

  return (
    <motion.span
      className="absolute text-xl pointer-events-none"
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x,
        y,
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 0.8, 0],
        rotate: randomBetween(-180, 180),
      }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {emoji}
    </motion.span>
  );
}

// ============================================
// Main Animation Overlay
// ============================================

export function GiftAnimation() {
  const { currentAnimation, dismissAnimation } = useGift();

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!currentAnimation) return;
    const timer = setTimeout(dismissAnimation, 3000);
    return () => clearTimeout(timer);
  }, [currentAnimation, dismissAnimation]);

  const handleClick = useCallback(() => {
    dismissAnimation();
  }, [dismissAnimation]);

  const config = currentAnimation
    ? GIFT_PARTICLES[currentAnimation.giftType.id] || GIFT_PARTICLES.palma
    : null;

  return (
    <AnimatePresence>
      {currentAnimation && config && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center cursor-pointer"
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Dim overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Center content */}
          <div className="relative flex flex-col items-center">
            {/* Particles */}
            {Array.from({ length: config.count }).map((_, i) => (
              <Particle key={i} emoji={config.emoji} index={i} spread={config.spread} />
            ))}

            {/* Main emoji */}
            <motion.span
              className="text-7xl sm:text-8xl drop-shadow-2xl"
              variants={giftMainVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentAnimation.giftType.emoji}
            </motion.span>

            {/* Text below */}
            <motion.p
              className="mt-6 text-white text-center text-lg sm:text-xl font-bold drop-shadow-lg px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {"\u{1F381}"} @{currentAnimation.senderName} enviou{" "}
              {currentAnimation.giftType.emoji} {currentAnimation.giftType.name} para @
              {currentAnimation.receiverName}!
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
