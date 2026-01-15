'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export default function SmoothSectionScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const wheelDeltaQueueRef = useRef<Array<{ delta: number; time: number }>>([]);

  useEffect(() => {
    // Start at the top of the page on load
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Initialize Lenis smooth scroll with reduced wheel multiplier
    const lenis = new Lenis({
      duration: 1.5, // Increased duration for smoother, slower scrolling
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.4, // Reduced wheel sensitivity to prevent fast scrolling
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Custom wheel handler to throttle fast scrolling
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const timeDelta = now - lastWheelTimeRef.current;
      const absDelta = Math.abs(e.deltaY);
      
      // Minimum time between wheel events to process (throttle rate)
      const minTimeBetweenEvents = 8; // ~120fps max processing rate
      
      // If events are coming too fast, throttle them
      if (timeDelta < minTimeBetweenEvents) {
        // For very fast scrolling (large deltas in quick succession), skip some events
        if (absDelta > 80 && timeDelta < 4) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
      
      // Track wheel events for rate limiting
      wheelDeltaQueueRef.current.push({ delta: absDelta, time: now });
      
      // Keep only recent events (last 100ms)
      wheelDeltaQueueRef.current = wheelDeltaQueueRef.current.filter(
        item => now - item.time < 100
      );
      
      // If too many large deltas in short time, throttle more aggressively
      const recentLargeDeltas = wheelDeltaQueueRef.current.filter(item => item.delta > 60).length;
      if (recentLargeDeltas > 5) {
        // Skip every other event when scrolling very fast
        if (wheelDeltaQueueRef.current.length % 2 === 0) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
      
      lastWheelTimeRef.current = now;
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('wheel', handleWheel, true);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return null;
}
