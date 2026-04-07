'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Zone } from '@/stores/appStore';

interface ZoneTransitionProps {
  isTransitioning: boolean;
  targetZone: Zone;
}

const zoneInfo: Record<Zone, { label: string; color: string; icon: string }> = {
  orbit: { label: 'Your Universe', color: '#fbbf24', icon: '🌌' },
  body: { label: 'Body Zone', color: '#10b981', icon: '🏔️' },
  mind: { label: 'Mind Zone', color: '#818cf8', icon: '🌊' },
  care: { label: 'Care Station', color: '#f59e0b', icon: '💊' },
};

export default function ZoneTransition({ isTransitioning, targetZone }: ZoneTransitionProps) {
  const info = zoneInfo[targetZone];

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial warp lines */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, transparent 0%, ${info.color}08 50%, ${info.color}15 100%)`,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 1 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Zone name flash */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-4xl mb-2">{info.icon}</span>
            <span
              className="text-2xl font-bold tracking-widest uppercase"
              style={{ color: info.color }}
            >
              {info.label}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
