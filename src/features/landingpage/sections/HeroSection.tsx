'use client';

import Image from 'next/image';
import TextRevealParallax from '@/components/animation/TextRevealParallax';
import PhoneModel from '@/features/landingpage/components/PhoneModel';; 
import { Snowflake} from 'lucide-react';
import WeatherTime from '@/components/decoration/WeatherTime';
import ShinyText from '@/components/decoration/ShinyText';
import ProgressBar from '@/components/decoration/ProgressBar';



export default function Home() {
 
  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <PhoneModel />
        </div>
      </div>

      <div id="hero-section" className="min-h-screen relative overflow-hidden z-10 snap-start">
        <div className="relative z-20 min-h-screen px-6">
          <div className="absolute top-6 right-6 z-30">
            <TextRevealParallax direction="right" delay={600} duration={800}>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-3 px-6 py-3 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-black/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Download on</div>
                    <div className="text-sm font-semibold text-white">App Store</div>
                  </div>
                </button>
                <button className="flex items-center space-x-3 px-6 py-3 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-black/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Get it on</div>
                    <div className="text-sm font-semibold text-white">Google Play</div>
                  </div>
                </button>
              </div>
            </TextRevealParallax>
          </div>

          <div className="absolute bottom-6 left-6 z-30">
            <TextRevealParallax direction="left" delay={800} duration={800}>
              <WeatherTime />
            </TextRevealParallax>
          </div>

          <div className="max-w-8xl mx-auto w-full h-screen grid grid-cols-[1fr_2fr_1fr] gap-4 py-6">

            
              <TextRevealParallax direction="left" delay={400} duration={800}>
                <div className="backdrop-blur-sm  p-4  w-[80%]  rounded-3xl">
           
                    <Image 
                      src="/assets/img/pento.png" 
                      alt="Quote" 
                      width={200}
                      height={200}
                      className="w-2/3 h-2/3 ml-2 filter invert" 
                    />
               
                </div>
              </TextRevealParallax>


            <div className="flex flex-col items-center h-full">
              <div className="flex flex-col items-center justify-start pointer-events-none mb-4">
                <TextRevealParallax direction="up" delay={200} duration={1200}>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className="backdrop-blur-sm bg-white/10 rounded-4xl p-4 border border-white/20">
                        <h2 className="text-xs md:text-sm font-semibold text-white/80 select-none">
                          The Smart Household Food Management System
                        </h2>
                      </div>
                    </div>

                    <h1 className="text-[20vw] md:text-[15vw] font-black leading-none text-white/50 select-none">
                      <ShinyText
                        text="PENTO"
                        disabled={false}
                        speed={3}
                        className=''
                      />
                    </h1>

                  </div>
                </TextRevealParallax>
              </div>

              <div className="w-full max-w-4xl px-8 mb-6">
                <TextRevealParallax direction="up" delay={800} duration={800}>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 group">
                        <div className="relative w-4 h-4 flex-shrink-0">
                          <Snowflake className="w-4 h-4 text-white group-hover:text-emerald-300 transition-all duration-300 group-hover:scale-125 drop-shadow-lg" />
                          <div className="absolute inset-0 w-4 h-4 bg-white rounded-full opacity-20 animate-ping"></div>
                        </div>
                        <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors duration-300">Smart food management at home</span>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <div className="relative w-4 h-4 flex-shrink-0">
                          <Snowflake className="w-4 h-4 text-blue-300 group-hover:text-cyan-300 transition-all duration-300 group-hover:scale-125 drop-shadow-lg" />
                          <div className="absolute inset-0 w-4 h-4 bg-blue-300 rounded-full opacity-20 animate-ping"></div>
                        </div>
                        <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors duration-300">No more wasted food</span>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <div className="relative w-4 h-4 flex-shrink-0">
                          <Snowflake className="w-4 h-4 text-white group-hover:text-violet-300 transition-all duration-300 group-hover:scale-125 drop-shadow-lg" />
                          <div className="absolute inset-0 w-4 h-4 bg-white rounded-full opacity-20 animate-ping"></div>
                        </div>
                        <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors duration-300">Meals from what you have</span>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <div className="relative w-4 h-4 flex-shrink-0">
                          <Snowflake className="w-4 h-4 text-blue-300 group-hover:text-orange-300 transition-all duration-300 group-hover:scale-125 drop-shadow-lg" />
                          <div className="absolute inset-0 w-4 h-4 bg-blue-300 rounded-full opacity-20 animate-ping"></div>
                        </div>
                        <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors duration-300">Share your fridge easily</span>
                      </div>
                    </div>

                    <div className="space-y-6 text-right pl-8">
                      <TextRevealParallax direction="right" delay={1400} duration={800}>
                        <div className="backdrop-blur-sm bg-white/10 rounded-2xl pt-8 pb-6 pl-16 pr-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                          <h3 className="text-lg font-primary text-white mb-4 text-center">Impact</h3>
                          <div className="grid grid-cols-1 gap-4 text-center">
                            <ProgressBar 
                              label="Reduce Waste" 
                              percentage={80}
                              progressColor="bg-emerald-500"
                              labelColor="text-gray-300"
                              percentageColor="text-white"
                            />
                            <ProgressBar 
                              label="Save Times" 
                              percentage={50}
                              progressColor="bg-violet-500"
                              labelColor="text-gray-300"
                              percentageColor="text-white"
                            />
                            <ProgressBar 
                              label="Boost Efficiency" 
                              percentage={60}
                              progressColor="bg-blue-500"
                              labelColor="text-gray-300"
                              percentageColor="text-white"
                            />
                          </div>
                          
                          <div className="flex justify-center space-x-3 mt-4">
                           
                          </div>
                        </div>
                      </TextRevealParallax>

                    </div>
                  </div>
                </TextRevealParallax>
              </div>
            </div>
            <div className="flex flex-col h-full relative">
              <div className="absolute inset-0 w-full h-full ">
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
  );
}