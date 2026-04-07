'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cone, Cylinder, Text, Float, MeshDistortMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';
import Stars from '../three/Stars';

interface BodyZoneProps {
  streakDays: number;
  totalWorkouts: number;
}

export default function BodyZone({ streakDays, totalWorkouts }: BodyZoneProps) {
  return (
    <>
      <Stars count={2000} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#10b981" />
      <pointLight position={[0, 3, 0]} intensity={1} color="#fbbf24" distance={15} />
      <fog attach="fog" args={['#030014', 15, 40]} />

      {/* Ground terrain */}
      <Terrain />

      {/* Mountains (built from workouts) */}
      <Mountain position={[-4, 0, -6]} height={3.5} color="#059669" label="Lifting" />
      <Mountain position={[3, 0, -8]} height={2.8} color="#047857" label="Running" />
      <Mountain position={[-7, 0, -10]} height={2.2} color="#065f46" label="Swimming" />
      <Mountain position={[6, 0, -5]} height={1.8} color="#10b981" label="Yoga" />
      <Mountain position={[0, 0, -12]} height={4} color="#34d399" label="Cycling" />

      {/* Streak Flame */}
      <StreakFlame streakDays={streakDays} />

      {/* Workout counter monument */}
      <Monument totalWorkouts={totalWorkouts} />

      {/* Running paths */}
      <RunningPath />

      {/* Floating stats text */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Text position={[0, 6, -5]} fontSize={0.5} color="#10b981" anchorX="center">
          YOUR FITNESS TERRAIN
        </Text>
      </Float>
    </>
  );
}

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(50, 50, 80, 80);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.3) * 0.3 + Math.cos(y * 0.3) * 0.3 + Math.random() * 0.1);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} geometry={geo}>
      <meshStandardMaterial color="#064e3b" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function Mountain({ position, height, color, label }: {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Cone args={[height * 0.6, height, 6]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
      </Cone>
      {/* Snow cap */}
      <Cone args={[height * 0.15, height * 0.2, 6]} position={[0, height * 0.9, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} emissive="#e2e8f0" emissiveIntensity={0.1} />
      </Cone>
      <group ref={textRef} position={[0, height + 0.5, 0]}>
        <Text fontSize={0.2} color="white" anchorX="center">
          {label}
        </Text>
      </group>
    </group>
  );
}

function StreakFlame({ streakDays }: { streakDays: number }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const flameScale = Math.min(streakDays / 10, 3);
  const flameColor = streakDays >= 30 ? '#fbbf24' : streakDays >= 7 ? '#3b82f6' : '#f97316';

  useFrame((state) => {
    if (flameRef.current) {
      const t = state.clock.getElapsedTime();
      flameRef.current.scale.y = flameScale * (1 + Math.sin(t * 5) * 0.15);
      flameRef.current.scale.x = flameScale * (1 + Math.cos(t * 4) * 0.1);
      flameRef.current.position.y = 0.5 + flameScale * 0.5;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Base logs */}
      <Cylinder args={[0.08, 0.08, 1]} rotation={[0, 0, Math.PI / 4]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#92400e" roughness={1} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 1]} rotation={[0, 0, -Math.PI / 4]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#78350f" roughness={1} />
      </Cylinder>

      {/* Flame */}
      <Sphere ref={flameRef} args={[0.4, 16, 16]} position={[0, 0.8, 0]}>
        <MeshDistortMaterial
          color={flameColor}
          emissive={flameColor}
          emissiveIntensity={2}
          roughness={0}
          metalness={0}
          distort={0.6}
          speed={8}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Glow */}
      <pointLight position={[0, 1, 0]} intensity={2} color={flameColor} distance={8} />

      {/* Streak label */}
      <Text position={[0, flameScale + 1.5, 0]} fontSize={0.25} color={flameColor} anchorX="center">
        {`${streakDays} DAY STREAK`}
      </Text>
    </group>
  );
}

function Monument({ totalWorkouts }: { totalWorkouts: number }) {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group position={[5, 0, -2]}>
      <Cylinder args={[0.3, 0.4, 2]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </Cylinder>
      <Torus args={[0.5, 0.08, 16, 32]} position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} metalness={1} />
      </Torus>
      <group ref={textRef} position={[0, 3, 0]}>
        <Text fontSize={0.2} color="#fbbf24" anchorX="center">
          {`${totalWorkouts} WORKOUTS`}
        </Text>
      </group>
    </group>
  );
}

function RunningPath() {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8, 0, 2),
      new THREE.Vector3(-4, 0, 1),
      new THREE.Vector3(-1, 0, 3),
      new THREE.Vector3(2, 0, 1),
      new THREE.Vector3(5, 0, 2),
      new THREE.Vector3(8, 0, 0),
    ]);
  }, []);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.08, 8, false), [curve]);

  return (
    <mesh geometry={tubeGeo} position={[0, 0.05, 0]}>
      <meshStandardMaterial color="#a7f3d0" emissive="#10b981" emissiveIntensity={0.3} />
    </mesh>
  );
}
