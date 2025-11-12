'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Apple() {
  const { scene } = useGLTF('/assets/3d/scene.glb');
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
}

function AppleModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [12, 4, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
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
            autoRotateSpeed={1}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default AppleModel;

useGLTF.preload('/assets/3d/apple.glb');

