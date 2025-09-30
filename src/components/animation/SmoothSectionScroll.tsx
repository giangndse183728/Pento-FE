'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

export default function SmoothSectionScroll() {
  useEffect(() => {
    const sections = ['#hero-section', '#features-section', '#contact-section'];
    let currentSection = 0;
    let isScrolling = false;

    const scrollToSection = (index: number) => {
      if (index < 0 || index >= sections.length || isScrolling) return;
      
      isScrolling = true;
      currentSection = index;
      
      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: sections[index],
          offsetY: 0
        },
        ease: "power2.inOut",
        onComplete: () => {
          setTimeout(() => {
            isScrolling = false;
          }, 500); // Delay to prevent rapid scrolling
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      
      // Find current section based on scroll position
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

      // Scroll to next or previous section
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

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // This component doesn't render anything
}
