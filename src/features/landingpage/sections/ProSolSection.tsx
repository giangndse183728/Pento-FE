 'use client';

 import Magnet from '@/components/animation/Magnet';
import CircularText from '@/components/decoration/CircularText';
import { CheckCircle } from 'lucide-react';
import ReadonlyChat from '@/components/decoration/ReadonlyChat';
import TextType from '@/components/animation/TextType';
import Carousel from '@/features/landingpage/components/Carousel';
import StyledCard from '@/components/decoration/StyledCard';

export default function Home() {

 return (
    <>
 <div id="prosol-section" className="relative z-10  snap-start h-screen">
 <div className="max-w-8xl mx-auto px-12 py-8 flex items-center">
  <div className="w-full grid grid-cols-[60%_40%] gap-12">
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 mt-6 px-4">
      <div className="flex flex-row items-stretch justify-between gap-6 my-6">
        <Magnet magnetStrength={3}>
          <StyledCard
            title="The Solution"
            icon={<CheckCircle className="w-4 h-4" />}
            variant="solution"
          >
            Pento provides <span className="font-semibold">smart expiration tracking</span> and
            <span className="font-semibold"> intelligent alerts</span> for real-time inventory management.
            Never waste food again.
          </StyledCard>
        </Magnet>
        <div className="flex-shrink-0 mt-15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/30 backdrop-blur-xl rounded-3xl p-2  ">
         
          <Carousel
            baseWidth={350}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
 
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

     <div className="flex items-center justify-center">
       <CircularText
         text="PENTO*SAVING*FOOD*"
         onHover="speedUp"
         spinDuration={20}
         className=""
       />
     </div>
   </div>
 </div>
</div>
</>
 );
}

