'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Stars({ count = 3000 }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 100;
      pos[i3 + 1] = (Math.random() - 0.5) * 100;
      pos[i3 + 2] = (Math.random() - 0.5) * 100;

      const brightness = 0.5 + Math.random() * 0.5;
      const tint = Math.random();
      col[i3] = tint > 0.7 ? brightness : brightness * 0.8;
      col[i3 + 1] = tint > 0.4 ? brightness : brightness * 0.7;
      col[i3 + 2] = brightness;
    }
    return [pos, col];
  }, [count]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0001;
      meshRef.current.rotation.x += 0.00005;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}
