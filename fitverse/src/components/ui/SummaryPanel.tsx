'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Zone, Reminder } from '@/stores/appStore';

interface SummaryPanelProps {
  activeZone: Zone;
  streakDays: number;
  totalWorkouts: number;
  currentMood: number;
  meditationMinutes: number;
  reminders: Reminder[];
}

export default function SummaryPanel({
  activeZone,
  streakDays,
  totalWorkouts,
  currentMood,
  meditationMinutes,
  reminders,
}: SummaryPanelProps) {
  const doneReminders = reminders.filter((r) => r.done).length;
  const moodLabels = ['', 'Low', 'Fair', 'Okay', 'Good', 'Great'];
  const moodColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#8b5cf6'];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeZone}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-6 left-6 z-40"
      >
        <div className="glass rounded-2xl p-5 min-w-[220px]">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-3">
            Today&apos;s Summary
          </div>

          {activeZone === 'orbit' && (
            <div className="space-y-3">
              <StatRow icon="🔥" label="Streak" value={`${streakDays} days`} color="#f59e0b" />
              <StatRow icon="💪" label="Workouts" value={`${totalWorkouts} total`} color="#10b981" />
              <StatRow icon="🧠" label="Mood" value={moodLabels[currentMood]} color={moodColors[currentMood]} />
              <StatRow icon="💊" label="Care" value={`${doneReminders}/${reminders.length}`} color="#3b82f6" />
            </div>
          )}

          {activeZone === 'body' && (
            <div className="space-y-3">
              <StatRow icon="🔥" label="Streak" value={`${streakDays} days`} color="#f59e0b" />
              <StatRow icon="💪" label="Total" value={`${totalWorkouts} workouts`} color="#10b981" />
              <StatRow icon="⚡" label="This Week" value="7 sessions" color="#22d3ee" />
              <StatRow icon="🏔️" label="Terrain" value="Growing" color="#34d399" />
            </div>
          )}

          {activeZone === 'mind' && (
            <div className="space-y-3">
              <StatRow icon="🧠" label="Mood" value={moodLabels[currentMood]} color={moodColors[currentMood]} />
              <StatRow icon="🧘" label="Meditation" value={`${meditationMinutes} min`} color="#a855f7" />
              <StatRow icon="📝" label="Journal" value="7 entries" color="#818cf8" />
              <StatRow icon="🌊" label="Ocean" value="Calm" color="#3b82f6" />
            </div>
          )}

          {activeZone === 'care' && (
            <div className="space-y-3">
              <StatRow icon="💊" label="Meds" value={`${doneReminders}/${reminders.length}`} color="#f59e0b" />
              <StatRow icon="✅" label="Done" value={`${Math.round((doneReminders / reminders.length) * 100)}%`} color="#22c55e" />
              <StatRow icon="⏰" label="Next" value={reminders.find(r => !r.done)?.time || 'All done!'} color="#3b82f6" />
              <StatRow icon="📊" label="Adherence" value="92%" color="#a855f7" />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatRow({ icon, label, value, color }: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base">{icon}</span>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wider text-white/30">{label}</div>
        <div className="text-sm font-semibold" style={{ color }}>
          {value}
        </div>
      </div>
    </div>
  );
}
