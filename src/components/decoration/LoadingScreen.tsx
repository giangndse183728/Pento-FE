'use client';

import * as React from 'react';
import { useProgress } from '@react-three/drei';
import './LoadingScreen.css';

interface LoadingScreenProps {
  className?: string;
  onDone?: () => void;
  autoHideDelayMs?: number;
  background?: string; // css color
  spinnerColors?: { ring: string; top: string };
  textColor?: string;
  blur?: boolean;
  fadeDurationMs?: number;
}

export default function LoadingScreen({
  className,
  onDone,
  autoHideDelayMs = 250,
  background = 'rgba(0,0,0,0.6)',
  spinnerColors = { ring: '#B9D7EA', top: '#769FCD' },
  textColor = 'rgba(255,255,255,0.9)',
  blur = true,
  fadeDurationMs = 300,
}: LoadingScreenProps) {
  const { active, progress } = useProgress();
  const [visible, setVisible] = React.useState(true);
  const [isFading, setIsFading] = React.useState(false);

  React.useEffect(() => {
    if (!active && progress >= 100) {
      // Start fade-out
      setIsFading(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone && onDone();
      }, autoHideDelayMs + fadeDurationMs);
      return () => clearTimeout(t);
    }
  }, [active, progress, autoHideDelayMs, fadeDurationMs, onDone]);

  if (!visible) return null;

  return (
    <div
      className={"fixed inset-0 z-[1000] flex items-center justify-center " + (className ?? '')}
      aria-live="polite"
      aria-busy={true}
      style={{
        opacity: isFading ? 0 : 1,
        transition: `opacity ${fadeDurationMs}ms ease`,
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="cube-loader">
          <div className="cube-top"></div>
          <div className="cube-wrapper">
            <span style={{ ['--i' as any]: 0 }} className="cube-span"></span>
            <span style={{ ['--i' as any]: 1 }} className="cube-span"></span>
            <span style={{ ['--i' as any]: 2 }} className="cube-span"></span>
            <span style={{ ['--i' as any]: 3 }} className="cube-span"></span>
          </div>
        </div>
      </div>
    </div>
  );
}


