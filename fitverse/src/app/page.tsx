'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore, type Zone } from '@/stores/appStore';
import Navigation from '@/components/ui/Navigation';
import SummaryPanel from '@/components/ui/SummaryPanel';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ZoneTransition from '@/components/ui/ZoneTransition';

// Dynamic import for the 3D scene (no SSR — requires WebGL)
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#030014] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    activeZone,
    setActiveZone,
    streakDays,
    totalWorkouts,
    workouts,
    currentMood,
    meditationMinutes,
    moodEntries,
    reminders,
    toggleReminder,
  } = useAppStore();

  const handleZoneChange = useCallback(
    (zone: Zone) => {
      if (zone === activeZone) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveZone(zone);
        setTimeout(() => setIsTransitioning(false), 600);
      }, 300);
    },
    [activeZone, setActiveZone]
  );

  const handleZoneSelect = useCallback(
    (zone: 'body' | 'mind' | 'care') => {
      handleZoneChange(zone);
    },
    [handleZoneChange]
  );

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* 3D Scene */}
      <Scene
        activeZone={activeZone}
        onZoneSelect={handleZoneSelect}
        streakDays={streakDays}
        totalWorkouts={totalWorkouts}
        currentMood={currentMood}
        meditationMinutes={meditationMinutes}
        moodEntries={moodEntries}
        reminders={reminders}
        onReminderToggle={toggleReminder}
      />

      {/* Zone transition overlay */}
      <ZoneTransition isTransitioning={isTransitioning} targetZone={activeZone} />

      {/* Navigation */}
      {loaded && (
        <Navigation activeZone={activeZone} onZoneChange={handleZoneChange} />
      )}

      {/* Summary panel */}
      {loaded && (
        <SummaryPanel
          activeZone={activeZone}
          streakDays={streakDays}
          totalWorkouts={totalWorkouts}
          currentMood={currentMood}
          meditationMinutes={meditationMinutes}
          reminders={reminders}
        />
      )}

      {/* Right side info hint */}
      {loaded && activeZone === 'orbit' && (
        <div className="fixed bottom-6 right-6 z-40 glass rounded-2xl p-4 max-w-[200px] animate-pulse-glow">
          <p className="text-xs text-white/50 leading-relaxed">
            Click a planet to explore your wellness zones. Drag to orbit. Scroll to zoom.
          </p>
        </div>
      )}

      {/* Care zone reminder hint */}
      {loaded && activeZone === 'care' && (
        <div className="fixed bottom-6 right-6 z-40 glass rounded-2xl p-4 max-w-[200px]">
          <p className="text-xs text-white/50 leading-relaxed">
            Click capsules to mark reminders as done. Watch them dissolve with a satisfying animation.
          </p>
        </div>
      )}
    </main>
  );
}
