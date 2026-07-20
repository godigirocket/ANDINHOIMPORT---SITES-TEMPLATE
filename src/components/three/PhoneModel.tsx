import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Smartphone 3D geométrico — mockup visual genérico.
 * Não representa um modelo exato de iPhone.
 * Corpo + tela + módulo de câmeras + botões laterais.
 */
export function PhoneModel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Rotação lenta base + influência do scroll
    const targetY = -0.3 + scrollProgress * Math.PI * 0.6;
    const targetX = 0.15 - scrollProgress * 0.3;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * delta * 2;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * delta * 2;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.8}>
      {/* Corpo principal */}
      <RoundedBox args={[1, 2.1, 0.08]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color="#1a1a1e"
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Tela */}
      <RoundedBox args={[0.88, 1.94, 0.005]} radius={0.04} smoothness={4} position={[0, 0, 0.043]}>
        <meshPhysicalMaterial
          color="#0a0a0c"
          metalness={0.1}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </RoundedBox>

      {/* Dynamic Island */}
      <mesh position={[0, 0.82, 0.046]}>
        <capsuleGeometry args={[0.025, 0.1, 8, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Módulo de câmeras (traseira) */}
      <group position={[-0.22, 0.55, -0.043]}>
        {/* Base do módulo */}
        <RoundedBox args={[0.38, 0.38, 0.02]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial color="#1e1e22" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Lente 1 */}
        <mesh position={[-0.08, 0.08, -0.012]}>
          <cylinderGeometry args={[0.055, 0.055, 0.015, 24]} />
          <meshPhysicalMaterial color="#111" metalness={1} roughness={0.05} clearcoat={1} />
        </mesh>
        {/* Lente 2 */}
        <mesh position={[0.08, 0.08, -0.012]}>
          <cylinderGeometry args={[0.055, 0.055, 0.015, 24]} />
          <meshPhysicalMaterial color="#111" metalness={1} roughness={0.05} clearcoat={1} />
        </mesh>
        {/* Lente 3 */}
        <mesh position={[-0.08, -0.08, -0.012]}>
          <cylinderGeometry args={[0.055, 0.055, 0.015, 24]} />
          <meshPhysicalMaterial color="#111" metalness={1} roughness={0.05} clearcoat={1} />
        </mesh>
        {/* Flash */}
        <mesh position={[0.08, -0.08, -0.01]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#f5d080" emissive="#f5b700" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Botão lateral direito (power) */}
      <mesh position={[0.52, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.008, 0.12, 4, 8]} />
        <meshPhysicalMaterial color="#2a2a2e" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Botões volume (esquerda) */}
      <mesh position={[-0.52, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.007, 0.06, 4, 8]} />
        <meshPhysicalMaterial color="#2a2a2e" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[-0.52, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.007, 0.06, 4, 8]} />
        <meshPhysicalMaterial color="#2a2a2e" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}
