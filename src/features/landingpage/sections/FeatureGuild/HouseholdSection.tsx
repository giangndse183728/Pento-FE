"use client";

import StyledCard from "@/components/decoration/StyledCard";
import { Snowflake } from "lucide-react";
import { lazy, useRef, memo } from "react";

const Beam = lazy(() => import("../../components/LaserFlow"));
const MagicBento = lazy(() => import("../../components/MagicBento"));

function HouseholdSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

 

  return (
    <div 
      ref={sectionRef} 
      className="min-h-screen w-screen flex-shrink-0 flex px-12">

      <div className="w-full h-full grid grid-cols-[40%_15%_45%] gap-6 items-center z-10">      
        <div className="flex flex-col h-full relative items-center justify-center">
          
            <Beam
              fogIntensity={0.2}
              color="#B9D7EA"
            />
          
         <div className="relative">
                <StyledCard
                  title="Household Food Management"
                  icon={<Snowflake className="w-6 h-6 text-white bg-blue-500/20 rounded-full p-1" />}
                  variant="solution"
                 fullWidth={true}
                >
                  <h3 className="text-4xl font-primary text-white my-5">
                    Collaborate Household
                  </h3>
                  <p className="text-md text-black/60 leading-relaxed">
                    Manage food together with household members through different routes. 
                    Each member contributes their way—scans, manual entries, or smart suggestions. Stay synchronized as a team.
                  </p>
                </StyledCard>
      </div>          
        </div>

        <div className="h-full flex items-center justify-center">
          <div className="w-px h-3/4 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>
        </div>

                <div className="relative px-2 w-full h-full flex items-center justify-center">
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={10}
            glowColor="185, 215, 234"
          />
        </div>
       
        </div>
      </div>
  );
}

export default memo(HouseholdSection);

