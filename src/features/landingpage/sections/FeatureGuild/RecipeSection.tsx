"use client";

import { memo, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ColorTheme } from "@/constants/color";
import { CheckCircle2, Star, Clock, ArrowLeftRight, Users, Timer, Droplets, ShoppingCart, Network, Shield, Trash2, Heart, Share2, Zap, UserCheck, TrendingUp } from "lucide-react";

const recipeFeatures = [
  "Instant recipe matching",
  "Nutritional information",
  "Step-by-step instructions",
  "Ingredient substitution",
  "Dietary preferences",
  "Cooking time estimates",
  "Calorie tracking",
  "Shopping list generation",
];

const recipeIcons = [
  CheckCircle2,
  Star,
  Clock,
  ArrowLeftRight,
  Users,
  Timer,
  Droplets,
  ShoppingCart,
];

const foodGiveawayFeatures = [
  "Local food network",
  "Safe exchanges",
  "Reduce waste",
  "Help community",
  "Easy sharing",
  "Real-time updates",
  "Trusted users",
  "Impact tracking",
];

const foodGiveawayIcons = [
  Network,
  Shield,
  Trash2,
  Heart,
  Share2,
  Zap,
  UserCheck,
  TrendingUp,
];

function RecipeSection() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const giveawayRow1Ref = useRef<HTMLDivElement>(null);
  const giveawayRow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    const giveawayRow2 = giveawayRow2Ref.current;

    if (!row1 || !row2 || !giveawayRow2) return;

    const items1 = row1.querySelectorAll('.marquee-item');
    const items2 = row2.querySelectorAll('.marquee-item');

    const singleSetWidth1 = Array.from(items1).slice(0, recipeFeatures.length).reduce((sum, item) => {
      return sum + (item as HTMLElement).offsetWidth + 12; 
    }, 0);

    const singleSetWidth2 = Array.from(items2).slice(0, recipeFeatures.length).reduce((sum, item) => {
      return sum + (item as HTMLElement).offsetWidth + 12; 
    }, 0);

    gsap.to(row1, {
      x: -singleSetWidth1,
      duration: 15,
      ease: 'none',
      repeat: -1,
    });

    gsap.fromTo(row2, 
      { x: -singleSetWidth2 },
      {
        x: 0,
        duration: 18,
        ease: 'none',
        repeat: -1,
      }
    );

    const giveawayItems2 = giveawayRow2.querySelectorAll('.giveaway-marquee-item');

    const giveawaySingleSetWidth2 = Array.from(giveawayItems2).slice(0, foodGiveawayFeatures.length).reduce((sum, item) => {
      return sum + (item as HTMLElement).offsetWidth + 12;
    }, 0);

    gsap.set(giveawayRow2, { x: -giveawaySingleSetWidth2 });
    gsap.to(giveawayRow2, {
      x: 0,
      duration: 16,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  return (
    <div 
      className="w-full h-full flex-shrink-0 flex items-center "
    >
       <div className="w-full h-full grid grid-cols-[45%_55%] gap-24 "
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
      >
        <div className="space-y-6 mt-20 px-14">
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${ColorTheme.powderBlue}40, ${ColorTheme.babyBlue}40, ${ColorTheme.iceberg}40)`,
              color: ColorTheme.blueGray,
            }}
          >
            🎨 Creative Recipes
          </div>
          <h3 
            className="text-5xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${ColorTheme.powderBlue}, ${ColorTheme.babyBlue}, ${ColorTheme.blueGray})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Discover Your Perfect Meal Match!
          </h3>
          <p className="text-xl text-gray-300 leading-relaxed">
            Turn your pantry into a treasure trove of possibilities! 
            Get personalized recipe recommendations based on what you have, and whip up something amazing right now. 🎉
          </p>
          
          <div className="space-y-4 mt-8">
            <div className="relative overflow-hidden h-10">
              <div 
                ref={row1Ref}
                className="flex gap-3 absolute whitespace-nowrap"
              >
                {[...recipeFeatures, ...recipeFeatures].map((feature, index) => {
                  const Icon = recipeIcons[index % recipeFeatures.length];
                  return (
                    <span
                      key={`row1-${index}`}
                      className="marquee-item inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: ColorTheme.powderBlue,
                        color: ColorTheme.darkBlue,
                      }}
                    >
                      <Icon className="w-3 h-3 mr-2" style={{ color: ColorTheme.blueGray }} />
                      {feature}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden h-10">
              <div 
                ref={row2Ref}
                className="flex gap-3 absolute whitespace-nowrap"
              >
                {[...recipeFeatures, ...recipeFeatures].map((feature, index) => {
                  const Icon = recipeIcons[index % recipeFeatures.length];
                  return (
                    <span
                      key={`row2-${index}`}
                      className="marquee-item inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: ColorTheme.babyBlue,
                        color: ColorTheme.darkBlue,
                      }}
                    >
                      <Icon className="w-3 h-3 mr-2" style={{ color: ColorTheme.blueGray }} />
                      {feature}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      

        <div className="relative w-full h-full flex items-center justify-center ">
          <div 
            className="w-full h-full backdrop-blur-xl border-white/80"
            style={{
              backdropFilter: 'blur(21px)',
              WebkitBackdropFilter: 'blur(21px)',
            }}
          >
            <div className="h-full flex flex-col space-y-6">
              <div className="relative  w-full h-[45%]  border-b-4 border-white/80 overflow-hidden">
                <Image 
                  src="/assets/img/giveaway.png" 
                  alt="Trade Food Items Feature" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            
              <div className="space-y-4 px-32 mt-6">
                <div 
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: `${ColorTheme.blueGray}33`,
                    color: ColorTheme.blueGray,
                  }}
                >
                  Trade Food Items
                </div>
                <h3 className="text-4xl font-bold text-white">
                  Swap & Share, Build Community
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Connect with your community to trade food items. 
                  Exchange what you have for what you need and reduce waste.
                </p>

                <div className="space-y-4 mt-6">
                  <div className="relative overflow-hidden h-10">
                    <div 
                      ref={giveawayRow2Ref}
                      className="flex gap-3 absolute whitespace-nowrap"
                    >
                      {[...foodGiveawayFeatures, ...foodGiveawayFeatures].map((feature, index) => {
                        const Icon = foodGiveawayIcons[index % foodGiveawayFeatures.length];
                        return (
                          <span
                            key={`giveaway-row2-${index}`}
                            className="giveaway-marquee-item inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: ColorTheme.iceberg,
                              color: ColorTheme.darkBlue,
                            }}
                          >
                            <Icon className="w-3 h-3 mr-2" style={{ color: ColorTheme.blueGray }} />
                            {feature}
                          </span>
                        );
                      })}
                    </div>
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

export default memo(RecipeSection);
