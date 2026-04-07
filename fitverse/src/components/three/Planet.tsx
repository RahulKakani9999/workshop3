'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  color: string;
  emissiveColor: string;
  size: number;
  label: string;
  orbitRadius: number;
  orbitSpeed: number;
  onClick: () => void;
  glowIntensity?: number;
  hasRings?: boolean;
}

export default function Planet({
  color,
  emissiveColor,
  size,
  label,
  orbitRadius,
  orbitSpeed,
  onClick,
  glowIntensity = 0.5,
  hasRings = false,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t * orbitSpeed) * orbitRadius;
      groupRef.current.position.z = Math.sin(t * orbitSpeed) * orbitRadius;
      groupRef.current.position.y = Math.sin(t * orbitSpeed * 0.5) * 0.5;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  const glowColor = useMemo(() => new THREE.Color(emissiveColor), [emissiveColor]);

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Planet body */}
      <Sphere ref={planetRef} args={[size, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={glowIntensity}
          roughness={0.3}
          metalness={0.7}
          distort={0.15}
          speed={2}
        />
      </Sphere>

      {/* Glow sphere */}
      <Sphere ref={glowRef} args={[size * 1.3, 32, 32]}>
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Rings */}
      {hasRings && (
        <Ring args={[size * 1.4, size * 2, 64]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshBasicMaterial
            color={emissiveColor}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}

      {/* Label */}
      <group ref={textRef} position={[0, size + 0.6, 0]}>
        <Text
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {label}
        </Text>
      </group>
    </group>
  );
}
