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

const WALLPAPER_IMAGES = [
  '/assets/img/summary-screen.jpg',
  '/assets/img/fooddetail-screen.jpg',
  '/assets/img/kanban.jpg',
];

const FEATURE_WALLPAPER_IMAGES = [
  '/assets/img/recipe-screen.jpg',
  '/assets/img/recipe-screen.jpg',
  '/assets/img/trade-screen.jpg',
];

function CameraController({ scrollProgress, featureProgress }: { scrollProgress: number; featureProgress: number }) {
  const cameraKeyframes = [
    { pos: new THREE.Vector3(6, 1, -12), zoom: 4 },   
    { pos: new THREE.Vector3(0, 0, -12), zoom: 5 }, 
    { pos: new THREE.Vector3(8, 1, -12), zoom: 5 },     
  ];

  const featureCameraKeyframes = [,  
    { pos: new THREE.Vector3(0, 12, -12), zoom: 4.5 },   
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


function Phone({ scrollProgress, featureProgress, isAtFooter }: { scrollProgress: number; featureProgress: number; isAtFooter: boolean }) {
  const { scene } = useGLTF('/assets/3d/pento_phone.glb');
  const modelRef = useRef<THREE.Group>(null);
  const fridgeRef = useRef<THREE.Group>(null);
  
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationY = useRef(0);
  const returnTimer = useRef<NodeJS.Timeout>(null);
  const isReturning = useRef(false);
  const wallpaperMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const texturesRef = useRef<(THREE.Texture | null)[]>(new Array(WALLPAPER_IMAGES.length).fill(null));
  const featureTexturesRef = useRef<(THREE.Texture | null)[]>(new Array(FEATURE_WALLPAPER_IMAGES.length).fill(null));
  const footerTextureRef = useRef<THREE.Texture | null>(null);
  const currentSectionRef = useRef<number>(-1);
  const currentFeatureSectionRef = useRef<number>(-1);
  const textureLoader = useRef(new THREE.TextureLoader());
  const transitionTweenRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const isInFeatureModeRef = useRef(false);

  useEffect(() => {
    const loader = textureLoader.current;

    // Load footer wallpaper (home-screen.jpg) separately
    loader.load(
      '/assets/img/home-screen.jpg',
      (texture) => {
        texture.flipY = true;
        texture.colorSpace = THREE.SRGBColorSpace;
        footerTextureRef.current = texture;
      },
      undefined,
      (error) => {
        console.warn('Failed to load footer wallpaper texture: /assets/img/home-screen.jpg', error);
      }
    );

    WALLPAPER_IMAGES.forEach((imagePath, index) => {
      loader.load(
        imagePath,
        (texture) => {
          texture.flipY = true;
          texture.colorSpace = THREE.SRGBColorSpace;
          texturesRef.current[index] = texture;
          
          if (wallpaperMaterialRef.current && !isInFeatureModeRef.current) {
            if (currentSectionRef.current === index || 
                (index === 0 && !wallpaperMaterialRef.current.map)) {
              wallpaperMaterialRef.current.map = texture;
              if (currentSectionRef.current === -1) {
                currentSectionRef.current = 0;
                wallpaperMaterialRef.current.opacity = 1;
              }
              wallpaperMaterialRef.current.needsUpdate = true;
            }
          }
        },
        undefined,
        (error) => {
          console.warn(`Failed to load wallpaper texture: ${imagePath}`, error);
        }
      );
    });

    FEATURE_WALLPAPER_IMAGES.forEach((imagePath, index) => {
      loader.load(
        imagePath,
        (texture) => {
          texture.flipY = true;
          texture.colorSpace = THREE.SRGBColorSpace;
          featureTexturesRef.current[index] = texture;
          
          if (wallpaperMaterialRef.current && isInFeatureModeRef.current) {
            if (currentFeatureSectionRef.current === index || 
                (index === 0 && !wallpaperMaterialRef.current.map)) {
              wallpaperMaterialRef.current.map = texture;
              if (currentFeatureSectionRef.current === -1) {
                currentFeatureSectionRef.current = 0;
                wallpaperMaterialRef.current.opacity = 1;
              }
              wallpaperMaterialRef.current.needsUpdate = true;
            }
          }
        },
        undefined,
        (error) => {
          console.warn(`Failed to load feature wallpaper texture: ${imagePath}`, error);
        }
      );
    });

    return () => {
      texturesRef.current.forEach((texture) => {
        if (texture) texture.dispose();
      });
      featureTexturesRef.current.forEach((texture) => {
        if (texture) texture.dispose();
      });
      if (footerTextureRef.current) {
        footerTextureRef.current.dispose();
      }
      if (transitionTweenRef.current) {
        transitionTweenRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (!scene) return;
    let found = false;
    const allMaterials: string[] = [];
    
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        const meshName = mesh.name || '';
        const materials: THREE.Material[] = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((mat) => {
          const standard = mat as THREE.MeshStandardMaterial;
          if (standard) {
            allMaterials.push(`Mesh: ${meshName}, Material: ${standard.name || 'unnamed'}`);
          }
          
          const isWallpaperMaterial = 
            (meshName.includes('Body_Wallpaper_0') || meshName.includes('Wallpaper')) ||
            (standard && (standard.name === 'Body_Wallpaper_0' || standard.name?.includes('Wallpaper')));
          
          if (standard && isWallpaperMaterial && !found) {
            found = true;
            wallpaperMaterialRef.current = standard;
            console.log('Found wallpaper material:', { meshName, materialName: standard.name });
            if (!standard.emissive) standard.emissive = new THREE.Color(0x000000);
            standard.emissive.set('#000000');
            standard.emissiveIntensity = 0;
            if (typeof standard.envMapIntensity === 'number') standard.envMapIntensity = 1;
            if (typeof standard.roughness === 'number') standard.roughness = 0.5;
            if (typeof standard.metalness === 'number') standard.metalness = 0;
            standard.transparent = false;
            standard.opacity = 1;
            // Clear any original texture and set initial wallpaper to home-screen.jpg
            standard.map = null; // Clear original texture
            const initialTexture = texturesRef.current[0];
            if (initialTexture) {
              standard.map = initialTexture;
              currentSectionRef.current = 0;
            } else {
              // If texture not loaded yet, load it immediately
              const loader = textureLoader.current;
              loader.load(
                WALLPAPER_IMAGES[0], // home-screen.jpg
                (texture) => {
                  texture.flipY = true;
                  texture.colorSpace = THREE.SRGBColorSpace;
                  standard.map = texture;
                  texturesRef.current[0] = texture;
                  currentSectionRef.current = 0;
                  standard.needsUpdate = true;
                }
              );
            }
            standard.needsUpdate = true;
          }
        });
      }
    });
    
    if (!found) {
      console.warn('Body_Wallpaper_0 material not found. Available materials:', allMaterials);
    }
  }, [scene]);

  const applyTextureWithAnimation = (texture: THREE.Texture) => {
    if (!wallpaperMaterialRef.current || !texture || !modelRef.current) return;

    const material = wallpaperMaterialRef.current;

    // Kill any existing animation and immediately apply its target texture
    if (transitionTweenRef.current) {
      transitionTweenRef.current.kill();
      // Reset emissive state when killing animation
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;
      material.needsUpdate = true;
    }
    
    // Set emissive to white for fade-to-white effect
    material.emissive.set('#ffffff');
    
    const animProps = { 
      emissiveIntensity: 0
    };

    // Store the target texture for this animation
    const targetTexture = texture;
    
    const timeline = gsap.timeline({
      onInterrupt: () => {
        // When animation is interrupted, ensure texture is still applied
        if (material && targetTexture) {
          material.map = targetTexture;
          targetTexture.flipY = true;
          targetTexture.colorSpace = THREE.SRGBColorSpace;
          material.emissive.set('#000000');
          material.emissiveIntensity = 0;
          material.needsUpdate = true;
        }
      }
    });
    
    // Fade to white (increase emissive intensity)
    timeline.to(animProps, {
      emissiveIntensity: 1.5,
      duration: 0.25,
      ease: "power2.in",
      onUpdate: () => {
        material.emissiveIntensity = animProps.emissiveIntensity;
        material.needsUpdate = true;
      },
      onComplete: () => {
        // Swap texture when fully white
        material.map = targetTexture;
        targetTexture.flipY = true;
        targetTexture.colorSpace = THREE.SRGBColorSpace;
        material.needsUpdate = true;
      }
    })
    // Fade back from white (decrease emissive intensity)
    .to(animProps, {
      emissiveIntensity: 0,
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        material.emissiveIntensity = animProps.emissiveIntensity;
        material.needsUpdate = true;
      },
      onComplete: () => {
        // Reset emissive to black and ensure final state
        material.emissive.set('#000000');
        material.emissiveIntensity = 0;
        material.needsUpdate = true;
        transitionTweenRef.current = null;
      }
    });
      
    transitionTweenRef.current = timeline;
  };

  useEffect(() => {
    if (!wallpaperMaterialRef.current) return;

    // Check if at footer section - use home-screen.jpg
    if (isAtFooter) {
      const texture = footerTextureRef.current;
      
      if (texture) {
        // Use a special marker value (-2) to indicate footer mode
        if (currentSectionRef.current !== -2) {
          applyTextureWithAnimation(texture);
          currentSectionRef.current = -2; // Special marker for footer
          currentFeatureSectionRef.current = -1; // Reset feature section
          isInFeatureModeRef.current = false;
        }
      }
      return;
    }

    const isFeatureMode = featureProgress > 0;
    const wasPreviouslyFeatureMode = isInFeatureModeRef.current;
    isInFeatureModeRef.current = isFeatureMode;

    // Reset tracking refs when switching modes
    if (isFeatureMode !== wasPreviouslyFeatureMode) {
      if (isFeatureMode) {
        currentSectionRef.current = -1; // Reset regular section tracking
      } else {
        currentFeatureSectionRef.current = -1; // Reset feature section tracking
      }
    }

    if (isFeatureMode) {
      const totalFeatureSections = FEATURE_WALLPAPER_IMAGES.length;
      // Clamp featureProgress to avoid boundary issues
      const clampedProgress = Math.min(Math.max(featureProgress, 0), 0.9999);
      const featureSectionIndex = Math.floor(clampedProgress * totalFeatureSections);
      const clampedFeatureSectionIndex = Math.min(featureSectionIndex, FEATURE_WALLPAPER_IMAGES.length - 1);

      if (currentFeatureSectionRef.current !== clampedFeatureSectionIndex) {
        const newFeatureSectionIndex = clampedFeatureSectionIndex;
        const texture = featureTexturesRef.current[newFeatureSectionIndex];
        
        if (texture) {
          applyTextureWithAnimation(texture);
          currentFeatureSectionRef.current = newFeatureSectionIndex;
        }
      }
    } else {
      const totalSections = WALLPAPER_IMAGES.length;
      // Clamp scrollProgress to avoid boundary issues (0.9999 prevents index overflow)
      const clampedProgress = Math.min(Math.max(scrollProgress, 0), 0.9999);
      
      // Calculate section based on progress thresholds
      // Section 0: 0% - 33%, Section 1: 33% - 66%, Section 2: 66% - 100%
      const sectionIndex = Math.floor(clampedProgress * totalSections);
      const clampedSectionIndex = Math.min(sectionIndex, WALLPAPER_IMAGES.length - 1);

      if (currentSectionRef.current !== clampedSectionIndex) {
        const newSectionIndex = clampedSectionIndex;
        const texture = texturesRef.current[newSectionIndex];
        
        if (texture) {
          applyTextureWithAnimation(texture);
          currentSectionRef.current = newSectionIndex;
        }
      }
    }
  }, [scrollProgress, featureProgress, isAtFooter]);

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
    rotationY.current += deltaX * 0.01;
    
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
  const [isAtFooter, setIsAtFooter] = useState(false);
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

  // Detect when reaching footer section (FeedbackSection)
  useEffect(() => {
    const checkFooter = () => {
      const footerSection = document.getElementById('feedback-section');
      if (footerSection) {
        const rect = footerSection.getBoundingClientRect();
        // Check if footer is visible in viewport
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
        setIsAtFooter(isVisible);
      } else {
        // Retry finding the element after a delay
        setTimeout(() => {
          const retrySection = document.getElementById('feedback-section');
          if (retrySection) {
            const rect = retrySection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
            setIsAtFooter(isVisible);
          }
        }, 500);
      }
    };

    // Check immediately and set up interval
    checkFooter();
    const intervalId = setInterval(checkFooter, 200);

    // Also use IntersectionObserver for more reliable detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsAtFooter(entry.isIntersecting);
        });
      },
      {
        threshold: [0, 0.1, 0.5],
        rootMargin: '200px 0px' // Trigger earlier
      }
    );

    // Look for FeedbackSection with retry
    const findAndObserve = () => {
      const footerSection = document.getElementById('feedback-section');
      if (footerSection) {
        observer.observe(footerSection);
        return true;
      }
      return false;
    };

    if (!findAndObserve()) {
      // Retry after a delay if element not found
      const retryTimeout = setTimeout(() => {
        findAndObserve();
      }, 1000);
      
      return () => {
        clearInterval(intervalId);
        clearTimeout(retryTimeout);
        observer.disconnect();
      };
    }

    // Also listen to scroll events as fallback
    const handleScroll = () => checkFooter();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkFooter);

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkFooter);
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
          
          <Suspense fallback={<Loader />}>
            <Phone scrollProgress={scrollProgress} featureProgress={featureProgress} isAtFooter={isAtFooter}/>
          </Suspense>
          
          <CameraController scrollProgress={scrollProgress} featureProgress={featureProgress} />
          </Canvas>
        </WebGLDetector>
      </div>
    </div>
  );
}

useGLTF.preload('/assets/3d/pento_phone.glb');
