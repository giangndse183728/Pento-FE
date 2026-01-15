'use client';

import { Suspense, useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/assets/3d/scene.glb';

const Apple = memo(function Apple() {
  const { scene } = useGLTF(MODEL_PATH);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Center>
      <group ref={modelRef}>
        <primitive object={scene} scale={[2, 2, 2]} />
      </group>
    </Center>
  );
});

const AppleModel = memo(function AppleModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [12, 4, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]} // Limit device pixel ratio for performance
        performance={{ min: 0.5 }} // Allow frame rate drops for smoother experience
      >
        <Suspense
          fallback={
            <Html center>
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 animate-pulse" />
            </Html>
          }
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Apple />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={4}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default AppleModel;

