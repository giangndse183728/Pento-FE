'use client';

import { Suspense, useRef, memo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/assets/3d/scene.glb';

const Apple = memo(function Apple() {
  const { scene } = useGLTF(MODEL_PATH);
  const modelRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);
  const animationDuration = 1.2; // seconds
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    if (!scene) return;
    
    // Set up materials for fade-in animation
    materialsRef.current = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials: THREE.Material[] = Array.isArray(child.material)
          ? child.material
          : [child.material];
        
        materials.forEach((mat) => {
          const material = mat as THREE.MeshStandardMaterial;
          if (material) {
            material.transparent = true;
            material.opacity = 0;
            materialsRef.current.push(material);
          }
        });
      }
    });
    
    startTime.current = null;
  }, [scene]);

  useFrame((state) => {
    if (!modelRef.current) return;

    // Initialize start time on first frame
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - (startTime.current || 0);
    const progress = Math.min(elapsed / animationDuration, 1);

    // Easing function for smooth animation (ease-out cubic)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(progress);

    // Scale animation (from 0 to 2)
    const scale = easedProgress * 2;
    modelRef.current.scale.set(scale, scale, scale);

    // Fade in opacity for all materials
    materialsRef.current.forEach((material) => {
      material.opacity = easedProgress;
    });

    // Rotation animation (always runs)
    modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 1.5;
  });

  return (
    <Center>
      <group ref={modelRef} scale={[0, 0, 0]}>
        <primitive object={scene} scale={[1, 1, 1]} />
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

