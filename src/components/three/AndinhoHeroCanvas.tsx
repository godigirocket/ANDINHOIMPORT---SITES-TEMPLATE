import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { PhoneModel } from './PhoneModel';

interface Props {
  scrollProgress: number;
}

/**
 * Canvas WebGL do hero — cena 3D real com smartphone geométrico.
 * Carregado via React.lazy na HeroSection.
 * DPR limitado a 1.5.
 * Pausa fora da viewport (via frameloop).
 */
export function AndinhoHeroCanvas({ scrollProgress }: Props) {
  const [visible, setVisible] = useState(true);

  // Pausar quando tab não está visível
  useEffect(() => {
    const handler = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.5], fov: 35 }}
      frameloop={visible ? 'always' : 'never'}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        {/* Iluminação de estúdio */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-2, 2, -3]} intensity={0.4} color="#f5b700" />
        <pointLight position={[0, -2, 3]} intensity={0.6} color="#f5b700" distance={8} />
        <spotLight position={[-3, 3, 2]} intensity={0.8} angle={0.4} penumbra={0.8} color="#ffffff" />

        {/* Modelo */}
        <PhoneModel scrollProgress={scrollProgress} />

        {/* Environment para reflexos realistas */}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
