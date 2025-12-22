'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function SmoothSectionScroll() {
  useEffect(() => {
    const sections = ['#hero-section', '#prosol-section', '#feature-section', '#feedback-section'];
    let currentSection = 0;
    let isScrolling = false;

    const scrollToSection = (index: number, options?: { immediate?: boolean }) => {
      if (index < 0 || index >= sections.length || isScrolling) return;
      
      isScrolling = true;
      currentSection = index;
      
      if (options?.immediate) {
        const selector = sections[index];
        const element = document.querySelector(selector) as HTMLElement | null;
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
        isScrolling = false;
        return;
      }

      const target = sections[index];

      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: target,
          offsetY: 0
        },
        ease: "power2.inOut",
        onComplete: () => {
          setTimeout(() => {
            isScrolling = false;
          }, 500); 
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      
      const featureSection = document.querySelector('#feature-section') as HTMLElement;
      if (featureSection) {
        const rect = featureSection.getBoundingClientRect();
        const isFeatureInView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
        
        if (isFeatureInView) {
          const atStart = featureSection.getAttribute('data-at-start') === 'true';
          const atEnd = featureSection.getAttribute('data-at-end') === 'true';
          
          if (!(atStart && direction < 0) && !(atEnd && direction > 0)) {
            return; 
          }
        }
      }
      
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      sections.forEach((selector, index) => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollTop >= elementTop - windowHeight/2 && scrollTop < elementBottom - windowHeight/2) {
            currentSection = index;
          }
        }
      });

      const nextSection = currentSection + direction;
      if (nextSection >= 0 && nextSection < sections.length) {
        e.preventDefault();
        scrollToSection(nextSection);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          scrollToSection(currentSection + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(currentSection - 1);
          break;
        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToSection(sections.length - 1);
          break;
      }
    };

    // Always start at the first (hero) section on load
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Ensure we are at the top/hero when the component mounts
    setTimeout(() => {
      scrollToSection(0, { immediate: true });
    }, 0);

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; 
}
