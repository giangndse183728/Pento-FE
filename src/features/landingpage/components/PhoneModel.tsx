'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLDetector from '@/features/landingpage/components/WebGLDetector';
import LoadingScreen from '@/components/decoration/LoadingScreen';

gsap.registerPlugin(ScrollTrigger);

function CameraController({ scrollProgress, featureProgress }: { scrollProgress: number; featureProgress: number }) {
  const cameraKeyframes = [
    { pos: new THREE.Vector3(6, 1, -12), zoom: 4 },   
    { pos: new THREE.Vector3(0, 0, -12), zoom: 5 }, 
    { pos: new THREE.Vector3(11, 1, -12), zoom: 5.5 },     
  ];

  const featureCameraKeyframes = [,  
    { pos: new THREE.Vector3(0, 0, -13), zoom: 5 },   
    { pos: new THREE.Vector3(0, -12, -12), zoom: 4 }, 
    { pos: new THREE.Vector3(0, 0, -14), zoom: 5 },  
  ];

  const { camera } = useThree();

  useFrame(() => {
    if (featureProgress > 0) {
      const totalSlides = featureCameraKeyframes.length - 1;
      const slideProgress = featureProgress * totalSlides;
      const currentSlideIndex = Math.floor(slideProgress);
      const nextSlideIndex = Math.min(currentSlideIndex + 1, totalSlides);
      const localProgress = slideProgress - currentSlideIndex;

      const start = featureCameraKeyframes[currentSlideIndex];
      const end = featureCameraKeyframes[nextSlideIndex];

      if (start && end) {
        const targetPos = new THREE.Vector3().lerpVectors(start.pos, end.pos, localProgress);
        const targetZoom = THREE.MathUtils.lerp(start.zoom, end.zoom, localProgress);

        camera.position.lerp(targetPos, 0.15);
        camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.15);
      }
    } else {
      const totalSections = cameraKeyframes.length - 1;
      const progressPerSection = 1 / totalSections;
      const sectionIndex = Math.floor(scrollProgress / progressPerSection);
      const localProgress = (scrollProgress - sectionIndex * progressPerSection) / progressPerSection;

      const start = cameraKeyframes[sectionIndex] ?? cameraKeyframes[0];
      const end = cameraKeyframes[sectionIndex + 1] ?? cameraKeyframes[cameraKeyframes.length - 1];

      const targetPos = new THREE.Vector3().lerpVectors(start.pos, end.pos, localProgress);
      const targetZoom = THREE.MathUtils.lerp(start.zoom, end.zoom, localProgress);

      camera.position.lerp(targetPos, 0.1);
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.1);
    }
    
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}


function Phone({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF('/assets/3d/phone.glb');
  const modelRef = useRef<THREE.Group>(null);
  const fridgeRef = useRef<THREE.Group>(null);
  
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationY = useRef(0);
  const returnTimer = useRef<NodeJS.Timeout>(null);
  const isReturning = useRef(false);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        const materials: THREE.Material[] = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((mat) => {
          const standard = mat as THREE.MeshStandardMaterial;
          if (standard && standard.name === 'Body_Wallpaper_0') {
            if (!standard.emissive) standard.emissive = new THREE.Color(0x000000);
            standard.emissive.set('#ffffff');
            standard.emissiveIntensity = 10;
            if (typeof standard.envMapIntensity === 'number') standard.envMapIntensity = 4;
            if (typeof standard.roughness === 'number') standard.roughness = Math.max(0, Math.min(standard.roughness * 1, 1));
            if (typeof standard.metalness === 'number') standard.metalness = Math.max(standard.metalness, 0.5);
            standard.needsUpdate = true;
          }
        });
      }
    });
  }, [scene]);

  useFrame(() => {
    if (modelRef.current) {
      const cameraKeyframes = [
        { pos: new THREE.Vector3(6, 1, -12), zoom: 4 },
        { pos: new THREE.Vector3(0, 0, -12), zoom: 5 },
        { pos: new THREE.Vector3(0, 0, -13), zoom: 5 },
      ];
      const totalSections = cameraKeyframes.length - 1;
      const progressPerSection = 1 / totalSections;
      const sectionIndex = Math.floor(scrollProgress / progressPerSection);
      const localProgress = (scrollProgress - sectionIndex * progressPerSection) / progressPerSection;

      const rotationByScroll = sectionIndex === 1 ? (Math.PI * 2) * THREE.MathUtils.clamp(localProgress, 0, 1) : 0;

      modelRef.current.rotation.y = rotationY.current + rotationByScroll;
    }
  });

  const handlePointerDown = (event: any) => {
    isDragging.current = true;
    previousMousePosition.current = { x: event.clientX, y: event.clientY };
    event.stopPropagation();
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging.current) return;
    
    const deltaX = event.clientX - previousMousePosition.current.x;
    rotationY.current += deltaX * 0.01; // Adjust sensitivity
    
    previousMousePosition.current = { x: event.clientX, y: event.clientY };
    event.stopPropagation();
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    
    if (returnTimer.current) {
      clearTimeout(returnTimer.current);
    }
    
    returnTimer.current = setTimeout(() => {
      if (!isDragging.current) {
        isReturning.current = true;
        const startRotation = rotationY.current;
        const targetRotation = 0;
        const duration = 1000;
        const startTime = Date.now();
        
        const animateReturn = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
    
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          rotationY.current = startRotation + (targetRotation - startRotation) * easeProgress;
          
          if (progress < 1) {
            requestAnimationFrame(animateReturn);
          } else {
            isReturning.current = false;
          }
        };
        
        animateReturn();
      }
    }, 800);
  };

  useEffect(() => {
    const handleGlobalPointerMove = (event: PointerEvent) => handlePointerMove(event);
    const handleGlobalPointerUp = () => handlePointerUp();

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, []);

  return (
    <Center>
      <group 
        ref={modelRef}
        onPointerDown={handlePointerDown}
    
      >
        <group ref={fridgeRef}>
          <primitive 
            object={scene} 
            scale={[2, 2, 2]} 
            position={[0, 0, 0]}
          />
        </group>
      </group>
    </Center>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  );
}


export default function PhoneModel() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [featureProgress, setFeatureProgress] = useState(0);
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    gsap.set(container, { xPercent: -50, yPercent: -50 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-section", 
        start: "top top", 
        end: "bottom top", 
        endTrigger: "#prosol-section",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          progressRef.current.value = progress;
          setScrollProgress(progress);
        }
      }
    });

    tl.to(container, { x: 480, duration: 1, ease: "power2.out" }, 0) 
      .to(container, { x: 0, y: -40, duration: 1, ease: "power2.inOut" }, 1); 
    

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const handleFeatureSlideChange = (event: CustomEvent) => {
      const { slideIndex, progress } = event.detail;
      setCurrentFeatureSlide(slideIndex);
      setFeatureProgress(progress);
    };

    window.addEventListener('featureSlideChange', handleFeatureSlideChange as EventListener);
    
    return () => {
      window.removeEventListener('featureSlideChange', handleFeatureSlideChange as EventListener);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoadingScreen background="linear-gradient(180deg, #B9D7EA 0%, #D6E6F2 100%)" />
      
      <div 
        ref={canvasContainerRef}
        className="w-150 h-150"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          willChange: 'transform'
        }}
      >
        <WebGLDetector>
          <Canvas
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: false
          }}
          camera={{ 
            position: [18, 2, 12], 
            zoom: 1.4,
            fov: 45
          }}
          style={{ 
            background: 'transparent' 
          }}
          onCreated={(state) => {
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }}
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-center">
                <h3 className="text-xl mb-2">3D Model Unavailable</h3>
                <p className="text-sm opacity-70">WebGL is not supported or blocked</p>
              </div>
            </div>
          }
        >
       
          <Environment files="/assets/3d/snow_field_puresky_4k.hdr"  />
          {/* <Environment preset="sunset"  /> */}
          
          <Suspense fallback={<Loader />}>
            <Phone scrollProgress={scrollProgress}/>
          </Suspense>
          
          <CameraController scrollProgress={scrollProgress} featureProgress={featureProgress} />
          </Canvas>
        </WebGLDetector>
      </div>
    </div>
  );
}

useGLTF.preload('/assets/3d/phone.glb');
