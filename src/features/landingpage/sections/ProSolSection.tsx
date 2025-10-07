 'use client';


import Magnet from '@/components/animation/Magnet';
 import CircularText from '@/components/decoration/CircularText';
import { CheckCircle } from 'lucide-react';
import ReadonlyChat from '@/components/decoration/ReadonlyChat';
import TextType from '@/components/animation/TextType';
import Carousel from '@/features/landingpage/components/Carousel';
import GlassSurface from '@/components/decoration/Liquidglass';

export default function Home() {

 return (
    <>
 {/* Features Section */}
 <div id="features-section" className="relative z-10 bg-black/70 snap-start">
 <div className="max-w-8xl mx-auto px-12 py-8 flex items-center">
  <div className="w-full grid grid-cols-[60%_40%] gap-12">
     {/* Left Side - All Content */}
    <div className="space-y-6 relative">
      {/* Two readonly chat cards stacked, alternating left/right alignment */}
      <div className="flex flex-col gap-4 mt-6 px-4">
      <div className="flex flex-row items-stretch justify-between gap-6 my-6">
        <Magnet magnetStrength={3}>
          <div
            className="relative max-w-sm rounded-2xl px-5 py-4 shadow-lg ring-1 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(180deg, rgba(185,215,234,0.9) 0%, rgba(214,230,242,0.9) 100%)',
              color: '#0b1220',
              borderColor: '#B9D7EA',
              boxShadow: '0 10px 30px rgba(185,215,234,0.45)'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4" style={{ color: '#769FCD' }} />
              <span className="text-sm font-bold tracking-wide" style={{ color: '#769FCD' }}>The Solution</span>
            </div>
            <p className="text-md leading-relaxed" style={{ color: '#0b1220' }}>
              Pento provides <span className="font-semibold">smart expiration tracking</span> and
              <span className="font-semibold"> intelligent alerts</span> for real-time inventory management.
              Never waste food again.
            </p>
          </div>
        </Magnet>
        <div className="flex-shrink-0 mt-15">
          <GlassSurface
            width={360}
            height={260}
            style={{
              border: '1px solid rgba(255, 255, 255, 0.3)',    
            }}
          >
          <Carousel
            baseWidth={350}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
          </GlassSurface>
        </div>
      </div>
    
        <div className="flex justify-center mt-4">
          <ReadonlyChat 
            placeholderNode={
              <TextType
                text={["Households throw away $1,500+ worth of food annually because they lose track of what's in their fridge. Food expires unnoticed, and you constantly buy duplicate items."]}
                typingSpeed={50}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                startOnVisible={true}
              />
            }
            tags={["Problem", "Solution", "Pento", "Smart Pantry", "Foods", "More..."]}
            width="95%"
            height={82}
          />
        </div>
      </div>
    </div>

     {/* Right Side - Empty */}
     <div className="flex items-center justify-center">

       <CircularText
         text="ICEIFY*SAVING*FOOD*"
         onHover="speedUp"
         spinDuration={20}
         className=""
       />
     </div>
   </div>
 </div>
</div>

{/* Contact Section */}
<div id="contact-section" className="relative z-10 bg-gradient-to-b from-black/70 to-purple-900/50 min-h-screen snap-start">
 <div className="max-w-4xl mx-auto px-6 py-8 h-screen flex items-center">
   <div className="w-full text-center">
     <h2 className="text-4xl font-bold text-white mb-8">Ready to Get Started?</h2>
     <p className="text-xl text-gray-300 mb-12">
       Join the smart food management revolution today
     </p>

     <div className="flex justify-center space-x-6">
       <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors text-lg">
         Download App
       </button>
       <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black font-bold rounded-full transition-colors text-lg">
         Learn More
       </button>
     </div>
   </div>
 </div>
</div>
</>
 );
}

