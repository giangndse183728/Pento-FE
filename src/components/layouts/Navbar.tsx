'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GlassSurface from '../decoration/Liquidglass';
import './Navbar.css';
import Magnet from '../animation/Magnet';
import { ROUTES } from '@/constants/routes';


interface NavItem {
  id: string;
  name: string;
  iconSrc: string;
  href?: string;
  onClick?: () => void;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [bouncingItem, setBouncingItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { id: 'game', name: 'Game', iconSrc: '/assets/icon/joystick.png', href: ROUTES.SUBSCRIPTIONS_VIEW },
    { id: 'news', name: 'News', iconSrc: '/assets/img/nutrition.png', href: ROUTES.ARTICLES },
    { id: 'home', name: 'Home', iconSrc: '/assets/img/igloo.png', href: ROUTES.HOME },
    { id: 'recipe', name: 'Recipes', iconSrc: '/assets/img/recipe-book.png', href: ROUTES.RECIPESVIEW },
    { id: 'subscriptions', name: 'Subscriptions', iconSrc: '/assets/img/admin-subscription.png', href: ROUTES.SUBSCRIPTIONS_VIEW },
  ];

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.id);
    setBouncingItem(item.id);

    // Reset bounce animation after it completes
    setTimeout(() => {
      setBouncingItem(null);
    }, 600);

    // Navigate to the href if it exists
    if (item.href) {
      router.push(item.href);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Magnet magnetStrength={5}>
        <GlassSurface
          width={450}
          height={80}
          borderRadius={50}
          borderWidth={0.07}
          brightness={50}
          backgroundOpacity={0.1}
          opacity={0.93}
          displace={0.5}
          distortionScale={-180}
          blur={10}
          saturation={1}
          blueOffset={20}
          greenOffset={10}
          redOffset={0}
          style={{
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="flex items-center justify-center space-x-2 px-4">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item relative cursor-pointer transition-all duration-300 ease-out ${activeItem === item.id ? 'active' : ''
                  } ${bouncingItem === item.id ? 'bounce' : ''}`}
                onClick={() => handleItemClick(item)}

              >
                <div className="nav-content">
                  <div className="nav-icon-container">
                    <div className="nav-icon">
                      <Image
                        src={item.iconSrc}
                        alt={item.name}
                        width={36}
                        height={36}
                        className="w-10 h-10 object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Label - appears on hover */}
                  <div className="nav-label">
                    <span className="label-text">{item.name}</span>
                  </div>
                </div>

                {/* Tooltip */}
                <div className="tooltip">
                  <span className="tooltip-text">{item.name}</span>
                  <div className="tooltip-arrow"></div>
                </div>
              </div>
            ))}
          </div>
        </GlassSurface>
      </Magnet>

    </div>
  );
};

export default Navbar;
