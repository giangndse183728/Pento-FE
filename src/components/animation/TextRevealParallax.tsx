'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TextRevealParallaxProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

const TextRevealParallax: React.FC<TextRevealParallaxProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 1000
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if element is in viewport
    const isInViewport = rect.top < windowHeight && rect.bottom > 0;
    
    if (isInViewport && !isVisible) {
      setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }
  }, [scrollY, delay, isVisible]);

  const getInitialTransform = () => {
    const distance = 100;
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(${-distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(${-distance}px)`;
      default:
        return `translateY(${distance}px)`;
    }
  };

  const getFinalTransform = () => {
    return 'translate(0, 0)';
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: isVisible ? getFinalTransform() : getInitialTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-out`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

export default TextRevealParallax;

















