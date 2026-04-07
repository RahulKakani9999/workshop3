'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import Stars from './Stars';

interface OrbitSceneProps {
  onZoneSelect: (zone: 'body' | 'mind' | 'care') => void;
}

export default function OrbitScene({ onZoneSelect }: OrbitSceneProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const sunGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.003;
    }
    if (sunGlowRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      sunGlowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <>
      <Stars count={4000} />

      {/* Ambient + directional light */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#fff5e6" distance={30} />

      {/* Central Sun — YOU */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere ref={sunRef} args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.5}
            distort={0.3}
            speed={3}
          />
        </Sphere>
        <Sphere ref={sunGlowRef} args={[1.8, 32, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.06} side={THREE.BackSide} />
        </Sphere>
      </Float>

      {/* Orbit rings (visual guides) */}
      {[4.5, 7.5, 10.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
          <meshBasicMaterial color="white" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Body Planet — Fitness (Green/Teal) */}
      <Planet
        position={[4.5, 0, 0]}
        color="#059669"
        emissiveColor="#10b981"
        size={0.7}
        label="BODY"
        orbitRadius={4.5}
        orbitSpeed={0.3}
        onClick={() => onZoneSelect('body')}
        glowIntensity={0.6}
        hasRings
      />

      {/* Mind Planet — Mental Wellness (Blue/Purple) */}
      <Planet
        position={[7.5, 0, 0]}
        color="#6366f1"
        emissiveColor="#818cf8"
        size={0.6}
        label="MIND"
        orbitRadius={7.5}
        orbitSpeed={0.2}
        onClick={() => onZoneSelect('mind')}
        glowIntensity={0.5}
      />

      {/* Care Planet — Reminders (Amber/Gold) */}
      <Planet
        position={[10.5, 0, 0]}
        color="#d97706"
        emissiveColor="#fbbf24"
        size={0.55}
        label="CARE"
        orbitRadius={10.5}
        orbitSpeed={0.15}
        onClick={() => onZoneSelect('care')}
        glowIntensity={0.7}
        hasRings
      />

      {/* Floating particles around the scene */}
      <Particles />
    </>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 12;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#818cf8" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}
