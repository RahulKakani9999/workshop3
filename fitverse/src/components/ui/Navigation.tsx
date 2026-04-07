'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Zone } from '@/stores/appStore';

interface NavigationProps {
  activeZone: Zone;
  onZoneChange: (zone: Zone) => void;
}

const zones = [
  { id: 'orbit' as Zone, label: 'Universe', icon: '🌌', color: '#fbbf24' },
  { id: 'body' as Zone, label: 'Body', icon: '🏔️', color: '#10b981' },
  { id: 'mind' as Zone, label: 'Mind', icon: '🌊', color: '#818cf8' },
  { id: 'care' as Zone, label: 'Care', icon: '💊', color: '#f59e0b' },
];

export default function Navigation({ activeZone, onZoneChange }: NavigationProps) {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
    >
      <div className="glass rounded-2xl px-2 py-2 flex gap-1">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneChange(zone.id)}
            className="relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer select-none"
            style={{
              color: activeZone === zone.id ? zone.color : 'rgba(255,255,255,0.5)',
            }}
          >
            {activeZone === zone.id && (
              <motion.div
                layoutId="activeZone"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `${zone.color}10`,
                  border: `1px solid ${zone.color}30`,
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span>{zone.icon}</span>
              <span>{zone.label}</span>
            </span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
