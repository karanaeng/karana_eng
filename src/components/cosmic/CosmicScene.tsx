import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Starfield } from './Starfield';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const CosmicScene = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-cosmic-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: false,       // Disabled — not noticeable on dark scenes, big perf gain
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#070B12']} />

        <Suspense fallback={null}>
          <Starfield />

          {children}

          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.05}
              luminanceBands={0}
              mipmapBlur={false}
            />
          </EffectComposer>
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};
