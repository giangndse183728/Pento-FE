"use client";

import { useEffect, useRef, useState, lazy, Suspense, useCallback, useMemo } from "react";
import gsap from "gsap";

const ShinyText = lazy(() => import("@/components/decoration/ShinyText"));
const PantrySection = lazy(() => import("./FeatureGuild/PantrySection"));
const HouseholdSection = lazy(() => import("./FeatureGuild/HouseholdSection"));
const RecipeSection = lazy(() => import("./FeatureGuild/RecipeSection"));



const SectionLoader = () => (
  <div className="min-h-screen w-screen flex-shrink-0 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      <p className="text-white/60 text-sm">Loading...</p>
    </div>
  </div>
);

export default function FeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = 3;

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            setLoadedSlides(new Set([0]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '200px' 
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  const scrollToSlide = useCallback((slideIndex: number) => {
    if (!sectionsRef.current || isScrolling) return;
    if (slideIndex < 0 || slideIndex >= totalSlides) return;

    setIsScrolling(true);
    setCurrentSlide(slideIndex);

    const slideWidth = window.innerWidth;
    const targetX = -slideWidth * slideIndex;

    gsap.to(sectionsRef.current, {
      x: targetX,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 500);
      },
    });
  }, [isScrolling, totalSlides]);

  useEffect(() => {
    if (!isVisible) return;

    if (containerRef.current) {
      containerRef.current.setAttribute('data-current-slide', currentSlide.toString());
      containerRef.current.setAttribute('data-at-start', (currentSlide === 0).toString());
      containerRef.current.setAttribute('data-at-end', (currentSlide === totalSlides - 1).toString());
      
      window.dispatchEvent(new CustomEvent('featureSlideChange', { 
        detail: { 
          slideIndex: currentSlide, 
          progress: currentSlide / (totalSlides - 1)
        } 
      }));
    }

    setLoadedSlides(() => {
      const newSet = new Set<number>();
      newSet.add(currentSlide);
      if (currentSlide > 0) newSet.add(currentSlide - 1);
      if (currentSlide < totalSlides - 1) newSet.add(currentSlide + 1);
      return newSet;
    });

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentSlide, totalSlides, isVisible]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isInViewport = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

    if (!isInViewport) return;

    if (isScrolling) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    const direction = e.deltaY > 0 ? 1 : -1;
    const nextSlide = currentSlide + direction;

    if (nextSlide >= 0 && nextSlide < totalSlides) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      scrollToSlide(nextSlide);
    }
  }, [currentSlide, isScrolling, scrollToSlide, totalSlides]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current || isScrolling) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isInViewport = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

    if (!isInViewport) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        scrollToSlide(currentSlide + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        scrollToSlide(currentSlide - 1);
        break;
    }
  }, [currentSlide, isScrolling, scrollToSlide]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  const slideIndicators = useMemo(() => (
    [...Array(totalSlides)].map((_, index) => (
      <button
        key={index}
        onClick={() => scrollToSlide(index)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          currentSlide === index 
            ? 'bg-white w-8' 
            : 'bg-white/30 hover:bg-white/50'
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))
  ), [currentSlide, scrollToSlide, totalSlides]);

  const renderSection = useCallback((index: number) => {
    if (!loadedSlides.has(index)) {
      return <SectionLoader key={index} />;
    }

    const Section = [PantrySection, HouseholdSection, RecipeSection][index];
    
    return (
      <Suspense fallback={<SectionLoader />} key={index}>
        <Section />
      </Suspense>
    );
  }, [loadedSlides]);

  if (!isVisible) {
    return (
      <div 
        id="feature-section" 
        ref={containerRef}
        className="relative z-10 overflow-hidden h-screen"
        style={{ contain: 'layout style paint' }}
      >
        <SectionLoader />
      </div>
    );
  }

  return (
    <div 
      id="feature-section" 
      ref={containerRef}
      className="relative z-10 overflow-hidden h-screen"
      style={{ contain: 'layout style paint' }}
    >
      <div className="absolute top-10 right-10 z-30">
        <Suspense fallback={<div className="w-48 h-12 bg-white/10 rounded animate-pulse" />}>
          <ShinyText
            className="text-4xl font-bold"
            text="Pento Features"
          />
        </Suspense>
      </div>

      <div className="absolute bottom-14 right-14 z-20 flex gap-3">
        {slideIndicators}
      </div>

      <div 
        ref={sectionsRef}
        className="flex h-screen will-change-transform"
        style={{ 
          backfaceVisibility: 'hidden',
          perspective: 1000,
          transform: 'translateZ(0)'
        }}
      >
        {[0, 1, 2].map(index => renderSection(index))}
      </div>
    </div>
  );
}
