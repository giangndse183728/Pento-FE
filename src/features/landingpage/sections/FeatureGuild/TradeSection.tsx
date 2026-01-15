"use client";

import { memo } from "react";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { ColorTheme } from "@/constants/color";
import PlaneTicketCard from "@/features/landingpage/components/PlaneTicketCard";

function TradeSection() {
  return (
    <div className="min-h-screen w-screen flex-shrink-0 flex px-12 py-12">
      <div className="w-full h-full grid grid-cols-[40%_15%_45%] gap-6 items-center z-10">
        {/* Left Column - Text Content & Ticket Card */}
        <div className="flex flex-col h-full relative items-center justify-start overflow-visible">
          <div className="relative w-full max-w-xl flex flex-col items-center gap-8">
            <div className="flex flex-col gap-4 w-full mb-10">
              <div 
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold w-fit"
                style={{
                  backgroundColor: `${ColorTheme.blueGray}33`,
                  color: ColorTheme.iceberg,
                }}
              >
                Trade System
              </div>
              <h3 
                className="text-4xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.powderBlue}, ${ColorTheme.babyBlue}, ${ColorTheme.blueGray})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Real-Time Trade Sessions
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Join live trade sessions to chat and manage items in real time, 
                and quickly swap what you have for what you need.
              </p>
            </div>
            
            {/* Plane Ticket Card - Centered and Bigger */}
            <div className="flex items-center justify-center w-full transform scale-150 gap-12">
              <PlaneTicketCard
                from="Your Pantry"
                fromCode="PENTO"
                fromTime="10:00"
                to="Neighbor"
                toCode="FPT"
                toTime="14:00"
                date="2025-12-25"
                passenger="Food Items"
                flight="PLANE"
                gate="Today"
                seat="1A"
              />
            </div>
          </div>
        </div>

        <div className="h-full flex items-center justify-center">
          <div className="w-px h-3/4 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>
        </div>

        <div className="relative">
          <div className="flex flex-col px-12 gap-6">
            {/* Title & Description */}
            <div className="flex flex-col gap-3">
              <h3 
                className="text-3xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.powderBlue}, ${ColorTheme.babyBlue})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Real-Time Communication
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Chat instantly with other users to negotiate trades, 
                discuss item details, and arrange meetups seamlessly.
              </p>
            </div>

            {/* Compact Chat Widget - Glass Style */}
            <div 
              className="w-full rounded-3xl overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(247, 251, 252, 0.4) 0%, 
                  rgba(214, 230, 242, 0.35) 30%,
                  rgba(185, 215, 234, 0.3) 60%,
                  rgba(214, 230, 242, 0.35) 100%)`,
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: `
                  0 8px 32px rgba(17, 63, 103, 0.2),
                  0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                  0 0 80px rgba(118, 159, 205, 0.15),
                  inset 0 2px 4px rgba(255, 255, 255, 0.8),
                  inset 0 -1px 2px rgba(255, 255, 255, 0.3)`,
              }}
            >
              {/* Glass overlay gradient for shine */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.25) 0%, 
                    rgba(255, 255, 255, 0.15) 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.1) 75%,
                    rgba(255, 255, 255, 0.2) 100%)`,
                  mixBlendMode: 'overlay'
                }}
              />
              {/* Additional shine layer */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background: `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
                  mixBlendMode: 'soft-light'
                }}
              />

              {/* Chat Header */}
              <div 
                className="px-4 py-3 flex items-center gap-3 relative z-10"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(17, 63, 103, 0.5) 0%, 
                    rgba(118, 159, 205, 0.4) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="flex -space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white/50 shadow-lg"
                    style={{ backgroundColor: ColorTheme.powderBlue, color: '#0a0a0f' }}
                  >
                    A
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white/50 shadow-lg"
                    style={{ backgroundColor: ColorTheme.babyBlue, color: '#0a0a0f' }}
                  >
                    M
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: ColorTheme.iceberg }}>Trade Session</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              </div>

              {/* Status Indicators */}
              <div className="px-4 py-2.5 flex items-center justify-center gap-3 relative z-10 border-b"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Ready Status */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs font-medium" style={{ color: ColorTheme.darkBlue }}>Ready</span>
                </div>
                
                {/* Trade Icon */}
                <div className="flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{
                    background: 'rgba(118, 159, 205, 0.2)',
                    border: '1px solid rgba(118, 159, 205, 0.4)',
                  }}
                >
                  <ArrowLeftRight className="w-4 h-4" style={{ color: ColorTheme.powderBlue }} />
                </div>
                
               
                {/* Pending Status */}
                <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0"></div>
                  <span className="text-xs font-medium" style={{ color: ColorTheme.darkBlue }}>Pending</span>
                </div>
              </div>

              {/* Chat Messages - Only 3 */}
              <div className="px-4 py-4 space-y-3 relative z-10">
                {/* Maria's message 1 */}
                <div className="flex gap-2 items-end">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-md"
                    style={{ backgroundColor: ColorTheme.babyBlue, color: '#0a0a0f' }}
                  >
                    M
                  </div>
                  <div 
                    className="max-w-[80%] px-3 py-2 rounded-xl rounded-bl-sm"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.4) 0%, 
                        rgba(255, 255, 255, 0.25) 100%)`,
                      backdropFilter: 'blur(30px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                      boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.2)`,
                    }}
                  >
                    <p className="text-sm" style={{ color: ColorTheme.darkBlue }}>Hey! Are your tomatoes still available? 🍅</p>
                  </div>
                </div>

                {/* Alex's message */}
                <div className="flex gap-2 items-end justify-end">
                  <div 
                    className="max-w-[80%] px-3 py-2 rounded-xl rounded-br-sm"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        rgba(118, 159, 205, 0.85) 0%, 
                        rgba(17, 63, 103, 0.9) 100%)`,
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      boxShadow: `0 4px 16px rgba(17, 63, 103, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.1)`,
                    }}
                  >
                    <p className="text-sm" style={{ color: ColorTheme.iceberg }}>Yes! Want to trade for your bread? 🍞</p>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-md"
                    style={{ backgroundColor: ColorTheme.powderBlue, color: '#0a0a0f' }}
                  >
                    A
                  </div>
                </div>

                {/* Maria's message 2 */}
                <div className="flex gap-2 items-end">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-md"
                    style={{ backgroundColor: ColorTheme.babyBlue, color: '#0a0a0f' }}
                  >
                    M
                  </div>
                  <div 
                    className="max-w-[80%] px-3 py-2 rounded-xl rounded-bl-sm"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.4) 0%, 
                        rgba(255, 255, 255, 0.25) 100%)`,
                      backdropFilter: 'blur(30px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                      boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.2)`,
                    }}
                  >
                    <p className="text-sm" style={{ color: ColorTheme.darkBlue }}>Deal! Let's meet at 3pm 📍</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TradeSection);
