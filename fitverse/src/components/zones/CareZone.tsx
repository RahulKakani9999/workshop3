'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Float, Cylinder, Box, Torus, RoundedBox, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Stars from '../three/Stars';
import type { Reminder } from '@/stores/appStore';

interface CareZoneProps {
  reminders: Reminder[];
  onToggle: (id: string) => void;
}

export default function CareZone({ reminders, onToggle }: CareZoneProps) {
  const doneCount = reminders.filter((r) => r.done).length;
  const totalCount = reminders.length;

  return (
    <>
      <Stars count={1500} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} color="#fbbf24" />
      <fog attach="fog" args={['#030014', 15, 40]} />

      {/* Station platform */}
      <StationPlatform />

      {/* Reminder capsules arranged in a circle */}
      {reminders.map((reminder, i) => (
        <ReminderCapsule
          key={reminder.id}
          reminder={reminder}
          index={i}
          total={reminders.length}
          onToggle={onToggle}
        />
      ))}

      {/* Progress ring at center */}
      <ProgressRing done={doneCount} total={totalCount} />

      {/* Title */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text position={[0, 7, 0]} fontSize={0.5} color="#fbbf24" anchorX="center">
          CARE STATION
        </Text>
        <Text position={[0, 6.3, 0]} fontSize={0.2} color="#d97706" anchorX="center">
          {`${doneCount}/${totalCount} COMPLETED TODAY`}
        </Text>
      </Float>
    </>
  );
}

function StationPlatform() {
  return (
    <group>
      {/* Main platform */}
      <Cylinder args={[8, 8, 0.2, 64]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.9} />
      </Cylinder>
      {/* Glowing ring */}
      <Torus args={[8, 0.05, 8, 128]} position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#6366f1" emissive="#818cf8" emissiveIntensity={1} />
      </Torus>
      {/* Inner ring */}
      <Torus args={[3, 0.03, 8, 64]} position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
      </Torus>
    </group>
  );
}

function ReminderCapsule({ reminder, index, total, onToggle }: {
  reminder: Reminder;
  index: number;
  total: number;
  onToggle: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const capsuleRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 5.5;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const typeIcons: Record<string, string> = {
    medication: '💊',
    water: '💧',
    appointment: '📅',
    break: '🌿',
    stretch: '⚡',
    sleep: '🌙',
    custom: '⭐',
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = reminder.done
        ? 0.5 + Math.sin(t * 0.5 + index) * 0.1
        : 1.5 + Math.sin(t * 1.5 + index) * 0.3;
    }
    if (capsuleRef.current && !reminder.done) {
      // Pulsing for undone reminders
      const pulse = 1 + Math.sin(t * 3 + index) * 0.05;
      capsuleRef.current.scale.set(pulse, pulse, pulse);
    }
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  const capsuleColor = reminder.done ? '#374151' : reminder.color;
  const emissiveIntensity = reminder.done ? 0.05 : 0.8;

  return (
    <group
      ref={groupRef}
      position={[x, 1.5, z]}
      onClick={(e) => { e.stopPropagation(); onToggle(reminder.id); }}
    >
      {/* Capsule body */}
      <RoundedBox
        ref={capsuleRef}
        args={[0.8, 1.2, 0.8]}
        radius={0.2}
        smoothness={4}
      >
        <meshStandardMaterial
          color={capsuleColor}
          emissive={capsuleColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={reminder.done ? 0.4 : 0.9}
        />
      </RoundedBox>

      {/* Glow for active reminders */}
      {!reminder.done && (
        <Sphere args={[0.9, 16, 16]}>
          <meshBasicMaterial
            color={capsuleColor}
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </Sphere>
      )}

      {/* Done check mark particle effect */}
      {reminder.done && (
        <Float speed={3} rotationIntensity={0} floatIntensity={0.5}>
          <Text position={[0, 0, 0.5]} fontSize={0.3} anchorX="center">
            ✓
          </Text>
        </Float>
      )}

      {/* Label */}
      <group ref={textRef} position={[0, 1, 0]}>
        <Text fontSize={0.12} color="white" anchorX="center" maxWidth={2}>
          {`${typeIcons[reminder.type] || '⭐'} ${reminder.title}`}
        </Text>
        <Text fontSize={0.1} color="#94a3b8" anchorX="center" position={[0, -0.18, 0]}>
          {reminder.time}
        </Text>
      </group>

      {/* Connection beam to platform */}
      <Beam from={[0, -0.6, 0]} color={capsuleColor} done={reminder.done} />

      {/* Light */}
      {!reminder.done && (
        <pointLight position={[0, 0, 0]} intensity={0.5} color={capsuleColor} distance={3} />
      )}
    </group>
  );
}

function Beam({ from, color, done }: { from: [number, number, number]; color: string; done: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && !done) {
      const t = state.clock.getElapsedTime();
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <Cylinder ref={ref} args={[0.015, 0.015, 2]} position={[from[0], from[1] - 1, from[2]]}>
      <meshBasicMaterial color={color} transparent opacity={done ? 0.05 : 0.15} />
    </Cylinder>
  );
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const progress = total > 0 ? done / total : 0;
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      {/* Background ring */}
      <Torus args={[1.2, 0.06, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#374151" roughness={0.5} />
      </Torus>

      {/* Progress ring */}
      <Torus
        ref={ringRef}
        args={[1.2, 0.08, 8, 64, Math.PI * 2 * progress]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1}
        />
      </Torus>

      {/* Center percentage */}
      <Text fontSize={0.35} color="#22c55e" anchorX="center" anchorY="middle">
        {`${Math.round(progress * 100)}%`}
      </Text>

      <pointLight position={[0, 0, 0]} intensity={0.8} color="#22c55e" distance={5} />
    </group>
  );
}
