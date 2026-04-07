'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Float, MeshDistortMaterial, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';
import Stars from '../three/Stars';

interface MindZoneProps {
  currentMood: number;
  meditationMinutes: number;
  moodEntries: { mood: number; note: string; date: string }[];
}

export default function MindZone({ currentMood, meditationMinutes, moodEntries }: MindZoneProps) {
  const moodColors: Record<number, string> = {
    1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#8b5cf6'
  };

  return (
    <>
      <Stars count={1500} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={0.4} color="#818cf8" />
      <fog attach="fog" args={['#030014', 12, 35]} />

      {/* Ocean surface */}
      <Ocean mood={currentMood} />

      {/* Mood orbs floating above water */}
      {moodEntries.map((entry, i) => (
        <MoodOrb
          key={entry.date}
          position={[
            Math.cos((i / moodEntries.length) * Math.PI * 2) * (3 + i * 0.5),
            2 + Math.sin(i * 1.5) * 1,
            Math.sin((i / moodEntries.length) * Math.PI * 2) * (3 + i * 0.5) - 3,
          ]}
          color={moodColors[entry.mood] || '#eab308'}
          note={entry.note}
          date={entry.date}
          index={i}
        />
      ))}

      {/* Meditation Island */}
      <MeditationIsland minutes={meditationMinutes} />

      {/* Floating title */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text position={[0, 7, -5]} fontSize={0.5} color="#818cf8" anchorX="center">
          YOUR INNER OCEAN
        </Text>
      </Float>

      {/* Mood indicator */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Text position={[0, 5.5, -5]} fontSize={0.25} color={moodColors[currentMood]} anchorX="center">
          {`TODAY'S MOOD: ${['', 'LOW', 'FAIR', 'OKAY', 'GOOD', 'GREAT'][currentMood]}`}
        </Text>
      </Float>
    </>
  );
}

function Ocean({ mood }: { mood: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    return new THREE.PlaneGeometry(60, 60, 100, 100);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const pos = (meshRef.current.geometry as THREE.PlaneGeometry).attributes.position;
      const waveIntensity = mood >= 4 ? 0.15 : mood >= 3 ? 0.3 : 0.5;
      const waveSpeed = mood >= 4 ? 1 : mood >= 3 ? 2 : 3;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(
          i,
          Math.sin(x * 0.5 + t * waveSpeed) * waveIntensity +
          Math.cos(y * 0.3 + t * waveSpeed * 0.7) * waveIntensity * 0.5
        );
      }
      pos.needsUpdate = true;
    }
  });

  const oceanColor = mood >= 4 ? '#1e40af' : mood >= 3 ? '#1e3a5f' : '#1c1917';

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} geometry={geo}>
      <meshStandardMaterial
        color={oceanColor}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.85}
        emissive="#3b82f6"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function MoodOrb({ position, color, note, date, index }: {
  position: [number, number, number];
  color: string;
  note: string;
  date: string;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + index) * 0.3;
    }
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={ref} position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0}>
        <Sphere args={[0.3, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            transparent
            opacity={0.7}
            distort={0.2}
            speed={3}
          />
        </Sphere>
        <Sphere args={[0.45, 16, 16]}>
          <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.BackSide} />
        </Sphere>
      </Float>
      <group ref={textRef} position={[0, 0.7, 0]}>
        <Text fontSize={0.12} color="white" anchorX="center" maxWidth={2}>
          {note}
        </Text>
        <Text fontSize={0.08} color="gray" anchorX="center" position={[0, -0.18, 0]}>
          {date}
        </Text>
      </group>
      <pointLight position={[0, 0, 0]} intensity={0.5} color={color} distance={3} />
    </group>
  );
}

function MeditationIsland({ minutes }: { minutes: number }) {
  const growth = Math.min(minutes / 100, 3);
  const treeCount = Math.min(Math.floor(minutes / 50), 6);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) textRef.current.lookAt(state.camera.position);
  });

  return (
    <group position={[8, -0.3, -8]}>
      {/* Island base */}
      <Cylinder args={[1.5 + growth * 0.3, 2 + growth * 0.3, 0.8, 16]}>
        <meshStandardMaterial color="#365314" roughness={0.9} />
      </Cylinder>

      {/* Trees */}
      {Array.from({ length: treeCount }).map((_, i) => {
        const angle = (i / treeCount) * Math.PI * 2;
        const r = 0.8;
        return (
          <group key={i} position={[Math.cos(angle) * r, 0.5, Math.sin(angle) * r]}>
            <Cylinder args={[0.04, 0.06, 0.5, 8]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color="#78350f" />
            </Cylinder>
            <Sphere args={[0.25, 12, 12]} position={[0, 0.65, 0]}>
              <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.2} />
            </Sphere>
          </group>
        );
      })}

      {/* Meditation lotus at center */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        <Torus args={[0.3, 0.08, 8, 16]} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={1} />
        </Torus>
        <pointLight position={[0, 1, 0]} intensity={1} color="#a855f7" distance={5} />
      </Float>

      <group ref={textRef} position={[0, 2.5, 0]}>
        <Text fontSize={0.2} color="#c084fc" anchorX="center">
          {`${minutes} MIN MEDITATED`}
        </Text>
        <Text fontSize={0.13} color="#a78bfa" anchorX="center" position={[0, -0.25, 0]}>
          MEDITATION ISLAND
        </Text>
      </group>
    </group>
  );
}
