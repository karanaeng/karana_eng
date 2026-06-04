import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Preload } from '@react-three/drei';
import * as THREE from 'three';

const InnerHeroElement = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.cos(t / 4) / 2;
      meshRef.current.rotation.y = Math.sin(t / 4) / 2;
      meshRef.current.position.y = Math.sin(t / 2) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      {/* Reduced sphere segments: 64,64 → 32,32 */}
      <Sphere ref={meshRef} args={[1, 32, 32]}>
        <MeshDistortMaterial
          color="#9CA6B7"
          speed={1.5}
          distort={0.3}
          radius={1}
          metalness={0.8}
          roughness={0.2}
          emissive="#9CA6B7"
          emissiveIntensity={0.15}
        />
      </Sphere>
    </Float>
  );
};

export const HeroElement = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <directionalLight position={[-5, -5, 2]} intensity={0.8} />
          <InnerHeroElement />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};
