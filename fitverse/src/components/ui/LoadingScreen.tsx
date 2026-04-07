'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030014]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 2.5 }}
      onAnimationComplete={onComplete}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center glow-amber">
          <span className="text-3xl">✦</span>
        </div>
        {/* Orbiting dot */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-emerald-400"
          style={{ top: '50%', left: '50%' }}
          animate={{
            x: [0, 40, 0, -40, 0],
            y: [-40, 0, 40, 0, -40],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-indigo-400"
          style={{ top: '50%', left: '50%' }}
          animate={{
            x: [30, 0, -30, 0, 30],
            y: [0, 30, 0, -30, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 text-3xl font-bold bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent"
      >
        FitVerse
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-2 text-sm text-white/40 tracking-widest uppercase"
      >
        Your Wellness Universe
      </motion.p>

      {/* Loading bar */}
      <motion.div
        className="mt-8 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-amber-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
