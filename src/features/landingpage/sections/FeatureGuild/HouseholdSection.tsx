"use client";

import { AnimatedBeamMultipleOutputDemo } from "../../components/MultiBeam";
import { ColorTheme } from "@/constants/color";
import { memo } from "react";

function HouseholdSection() {
  return (
    <div 
      className="min-h-screen w-screen flex-shrink-0 flex items-center justify-center px-12 relative"
      style={{ contain: 'layout style paint' }}
    >
      <div 
        className="absolute inset-0 pointer-events-none "
        style={{
          background: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
      
      <div className="w-full h-full grid grid-cols-[35%_65%] items-center relative z-0">
        <div 
          className="p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: `0 8px 32px 0 ${ColorTheme.powderBlue}`,
            backdropFilter: 'blur(21px)',
            WebkitBackdropFilter: 'blur(21px)',
          }}
        >
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-100 rounded-full text-sm font-semibold">
              Smart Household Management
            </div>
            <h3 className="text-5xl font-bold text-white">
              Organize Your Home Effortlessly
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Coordinate family tasks, manage household schedules, and track essential supplies 
              in one intelligent platform. Keep everyone connected with shared calendars, 
              automated reminders, and collaborative task management.
            </p>
          
          </div>
        </div>

        <div className="relative px-2 w-full h-full flex items-center justify-center">
          <AnimatedBeamMultipleOutputDemo />
        </div>
      </div>
    </div>
  );
}

export default memo(HouseholdSection);
