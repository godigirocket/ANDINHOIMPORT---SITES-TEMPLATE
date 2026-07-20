import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Smartphone 3D geométrico — mockup visual genérico.
 * Não representa um modelo exato de iPhone.
 * Usa apenas geometria nativa Three.js (sem drei RoundedBox).
 */
export function PhoneModel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = -0.3 + scrollProgress * Math.PI * 0.6;
    const targetX = 0.15 - scrollProgress * 0.3;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * delta * 2;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * delta * 2;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.8}>
      {/* Corpo */}
      <mesh>
        <boxGeometry args={[1, 2.1, 0.08]} />
        <meshPhysicalMaterial
          color="#1a1a1e"
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.4}
        />
      </mesh>

      {/* Tela */}
      <mesh position={[0, 0, 0.042]}>
        <boxGeometry args={[0.88, 1.94, 0.005]} />
        <meshPhysicalMaterial
          color="#0a0a0c"
          metalness={0.1}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>

      {/* Dynamic Island */}
      <mesh position={[0, 0.82, 0.046]}>
        <capsuleGeometry args={[0.025, 0.1, 8, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Módulo de câmeras */}
      <group position={[-0.22, 0.55, -0.043]}>
        <mesh>
          <boxGeometry args={[0.36, 0.36, 0.02]} />
          <meshPhysicalMaterial color="#1e1e22" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* 3 Lentes */}
        {[[-0.08, 0.08], [0.08, 0.08], [-0.08, -0.08]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.015, 24]} />
            <meshPhysicalMaterial color="#111" metalness={1} roughness={0.05} clearcoat={1} />
          </mesh>
        ))}
        {/* Flash */}
        <mesh position={[0.08, -0.08, -0.01]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial color="#f5d080" emissive="#f5b700" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Botão lateral */}
      <mesh position={[0.52, 0.3, 0]}>
        <boxGeometry args={[0.015, 0.12, 0.02]} />
        <meshPhysicalMaterial color="#2a2a2e" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}
