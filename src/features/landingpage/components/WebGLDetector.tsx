'use client';

import { useEffect, useState } from 'react';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

export default function WebGLDetector({ children }: { children: React.ReactNode }) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(detectWebGL());
  }, []);

  if (webglSupported === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-center">
         
        </div>
      </div>
    );
  }

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-center p-6 bg-white/10 rounded-2xl border border-white/20">
          <h3 className="text-xl mb-2">3D Content Unavailable</h3>
          <p className="text-sm opacity-70 mb-4">
            WebGL is not supported or has been blocked by your browser.
          </p>
          <div className="text-xs opacity-60">
            <p>Try:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Refreshing the page</li>
              <li>Enabling hardware acceleration</li>
              <li>Using a different browser</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
