'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import OrbitScene from './OrbitScene';
import BodyZone from '../zones/BodyZone';
import MindZone from '../zones/MindZone';
import CareZone from '../zones/CareZone';
import type { Zone, Reminder, MoodEntry } from '@/stores/appStore';

interface SceneProps {
  activeZone: Zone;
  onZoneSelect: (zone: 'body' | 'mind' | 'care') => void;
  streakDays: number;
  totalWorkouts: number;
  currentMood: number;
  meditationMinutes: number;
  moodEntries: MoodEntry[];
  reminders: Reminder[];
  onReminderToggle: (id: string) => void;
}

function CameraController({ activeZone }: { activeZone: Zone }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const positions: Record<Zone, [number, number, number]> = {
      orbit: [0, 5, 16],
      body: [0, 4, 10],
      mind: [0, 5, 12],
      care: [0, 6, 14],
    };

    const targets: Record<Zone, [number, number, number]> = {
      orbit: [0, 0, 0],
      body: [0, 1, -3],
      mind: [0, 1, -2],
      care: [0, 1, 0],
    };

    const pos = positions[activeZone];
    const target = targets[activeZone];

    gsap.to(camera.position, {
      x: pos[0],
      y: pos[1],
      z: pos[2],
      duration: 1.5,
      ease: 'power2.inOut',
    });

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: target[0],
        y: target[1],
        z: target[2],
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => controlsRef.current?.update(),
      });
    }
  }, [activeZone, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={5}
      maxDistance={25}
      maxPolarAngle={Math.PI / 1.8}
      minPolarAngle={0.2}
      autoRotate={activeZone === 'orbit'}
      autoRotateSpeed={0.3}
    />
  );
}

export default function Scene({
  activeZone,
  onZoneSelect,
  streakDays,
  totalWorkouts,
  currentMood,
  meditationMinutes,
  moodEntries,
  reminders,
  onReminderToggle,
}: SceneProps) {
  return (
    <div className="fixed inset-0">
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#030014']} />
        <PerspectiveCamera makeDefault position={[0, 5, 16]} fov={60} />
        <CameraController activeZone={activeZone} />

        <Suspense fallback={null}>
          {activeZone === 'orbit' && <OrbitScene onZoneSelect={onZoneSelect} />}
          {activeZone === 'body' && (
            <BodyZone streakDays={streakDays} totalWorkouts={totalWorkouts} />
          )}
          {activeZone === 'mind' && (
            <MindZone
              currentMood={currentMood}
              meditationMinutes={meditationMinutes}
              moodEntries={moodEntries}
            />
          )}
          {activeZone === 'care' && (
            <CareZone reminders={reminders} onToggle={onReminderToggle} />
          )}
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0005, 0.0005)}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
