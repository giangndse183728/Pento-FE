"use client";

import { memo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LayoutGroup, motion } from "framer-motion";
import { ArrowLeftRight, Image, Camera, Menu } from "lucide-react";
import { useGLTF } from "@react-three/drei";
import ShinyText from "@/components/decoration/ShinyText";
import { ColorTheme } from "@/constants/color";
import AppleModel from "@/features/landingpage/components/AppleModel";
import TextRevealParallax from "@/components/animation/TextRevealParallax";

interface FoodItem {
  id: string;
  name: string;
  image: string;
  expirationDate: string;
  compartmentId: string;
}

const ITEM_TYPE = "FOOD_ITEM";

interface FoodItemCardProps {
  item: FoodItem;
}

function FoodItemCard({ item }: FoodItemCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: item.id, compartmentId: item.compartmentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag as any} className="w-full">
      <motion.div
        layout
        layoutId={item.id}
        initial={false}
        animate={{ opacity: isDragging ? 0.5 : 1, scale: isDragging ? 0.95 : 1 }}
        transition={{ duration: 0.18, ease: "easeOut", layout: { duration: 0.25, ease: "easeOut" } }}
        style={{
          backgroundColor: `${ColorTheme.iceberg}15`,
          borderColor: `${ColorTheme.powderBlue}50`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        className="backdrop-blur-md rounded-xl p-3 hover:shadow-xl transition-all border-2 shadow-lg w-full"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"
            style={{
              background: `linear-gradient(to bottom right, ${ColorTheme.powderBlue}40, ${ColorTheme.blueGray}40)`,
            }}
          >
            {item.image}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <h4 className="font-semibold text-sm truncate" style={{ color: ColorTheme.iceberg }}>{item.name}</h4>
            <p className="text-xs mt-0.5 truncate" style={{ color: `${ColorTheme.babyBlue}DD` }}>Expires: {item.expirationDate}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface CompartmentProps {
  id: string;
  title: string;
  items: FoodItem[];
  onDrop: (itemId: string, targetCompartment: string) => void;
}

function Compartment({ id, title, items, onDrop }: CompartmentProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem: { id: string; compartmentId: string }) => {
      if (draggedItem.compartmentId !== id) {
        onDrop(draggedItem.id, id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as any}
      className={`flex-1 rounded-3xl backdrop-blur-xl border-2 shadow-2xl transition-all flex flex-col overflow-hidden ${
        isOver ? "scale-[1.02]" : ""
      }`}
      style={{
        backgroundColor: isOver ? `${ColorTheme.powderBlue}30` : `${ColorTheme.iceberg}15`,
        borderColor: isOver ? `${ColorTheme.blueGray}80` : `${ColorTheme.babyBlue}40`,
        maxHeight: '600px',
      }}
    >
      <div 
        className="flex items-center justify-between py-2 px-6 flex-shrink-0 mb-4"
        style={{ backgroundColor: `${ColorTheme.blueGray}60` }}
      >
        <h3 
          className="font-primary text-lg" 
          style={{ color: ColorTheme.iceberg }}
        >
          {title}
        </h3>
        <button
          className="p-1.5 rounded-lg hover:bg-opacity-20 transition-colors"
          style={{ 
            color: ColorTheme.iceberg,
            backgroundColor: `${ColorTheme.blueGray}20`,
          }}
        >
          <Menu size={20} />
        </button>
      </div>
      <div 
        className="space-y-3 px-6 pb-6 overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{ 
          flex: '1 1 0',
          minHeight: '0',
        }}
      >
        {items.map((item) => (
          <FoodItemCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <div className="text-sm text-center py-12" style={{ color: `${ColorTheme.babyBlue}80` }}>
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

function PantrySectionContent() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: "1",
      name: "Fresh Milk",
      image: "🥛",
      expirationDate: "Nov 15",
      compartmentId: "fridge",
    },
    {
      id: "2",
      name: "Cheese",
      image: "🧀",
      expirationDate: "Nov 20",
      compartmentId: "fridge",
    },
    {
      id: "3",
      name: "Bread",
      image: "🍞",
      expirationDate: "Nov 14",
      compartmentId: "pantry",
    },
  ]);

  const handleDrop = (itemId: string, targetCompartment: string) => {
    setFoodItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, compartmentId: targetCompartment } : item
      )
    );
  };

  const fridgeItems = foodItems.filter((item) => item.compartmentId === "fridge");
  const pantryItems = foodItems.filter((item) => item.compartmentId === "pantry");

  return (
    <>
      <style jsx>{`
        .camera-frame::before {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0.2) 100%);
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .camera-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 36px;
          background: radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 55%), linear-gradient(220deg, rgba(33, 150, 243, 0.18), rgba(0, 0, 0, 0) 60%);
          pointer-events: none;
          opacity: 0.75;
        }
        .camera-display {
          background: linear-gradient(200deg, rgba(255, 255, 255, 0.22), rgba(3, 27, 52, 0.55));
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: inset 0 22px 65px rgba(3, 27, 52, 0.35), inset 0 -35px 75px rgba(16, 93, 168, 0.25);
          backdrop-filter: blur(12px);
        }
        .camera-corner {
          position: absolute;
          width: 54px;
          height: 54px;
          border: 4px solid currentColor;
        
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .camera-corner-tl {
          top: 60px;
          left: 60px;
          border-right: none;
          border-bottom: none;
        }
        .camera-corner-tr {
          top: 60px;
          right: 60px;
          border-left: none;
          border-bottom: none;
        }
        .camera-corner-bl {
          bottom: 60px;
          left: 60px;
          border-right: none;
          border-top: none;
        }
        .camera-corner-br {
          bottom: 60px;
          right: 60px;
          border-left: none;
          border-top: none;
        }
        .wave-scan-container {
          mix-blend-mode: screen;
        }
        .wave-scan-line {
          position: absolute;
          width: 120%;
          left: -10%;
          height: 160px;
          filter: blur(28px);
          transform: translateY(-50%) rotate(-2deg);
          animation: waveScan 2.4s ease-in-out infinite;
          mix-blend-mode: screen;
          opacity: 0.85;
        }
        .wave-scan-line-secondary {
          animation-delay: 1.1s;
          opacity: 0.6;
          height: 110px;
          filter: blur(16px);
        }
        @keyframes waveScan {
          0% {
            top: -10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }
        .camera-footer-button {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .camera-footer-button:hover {
          transform: scale(1.08);
          filter: brightness(1.15);
        }
        .camera-footer-button:active {
          transform: scale(0.95);
        }
      `}</style>
      <div className="min-h-screen w-screen flex-shrink-0 flex px-12 py-12">
        <div className="w-full h-full grid grid-cols-[40%_15%_45%] gap-6 z-10">      
          <div className="flex flex-col items-center gap-6 h-[80%]">
            <div className="flex-1 flex items-center w-full px-4">
              <LayoutGroup id="pantry-fridge">
                <div className="flex flex-row relative items-stretch gap-2 py-8 w-full h-full">
                <Compartment
                  id="fridge"
                  title="Fridge"
                  items={fridgeItems}
                  onDrop={handleDrop}
                />
                
                <div className="flex flex-col items-center justify-center px-2">
                  <div className="flex flex-col items-center gap-3">
                    <ArrowLeftRight className="w-8 h-8" style={{ color: ColorTheme.powderBlue }} />
                    <ShinyText
                      text="Drag & Drop"
                      className="text-xs font-medium text-center whitespace-nowrap rotate-0"
                    />
                  </div>
                </div>
                
                <Compartment
                  id="pantry"
                  title="Pantry"
                  items={pantryItems}
                  onDrop={handleDrop}
                />
                </div>
              </LayoutGroup>
            </div>

            {/* Title and Description */}
            <div className="w-full max-w-xl text-center flex-shrink-0">
              <TextRevealParallax direction="up" delay={0} duration={800}>
                <h2 
                  className="text-3xl mb-3 font-primary"
                  style={{ color: ColorTheme.iceberg }}
                >
                  Manage Food with Kanban Board
                </h2>
              </TextRevealParallax>
              <TextRevealParallax direction="up" delay={200} duration={800}>
                <p 
                  className="text-lg leading-relaxed"
                  style={{ color: `${ColorTheme.babyBlue}DD` }}
                >
                  Effortlessly organize your pantry by dragging and dropping items between compartments to track your food.
                </p>
              </TextRevealParallax>
            </div>
          </div>

          <div className="h-full flex items-center justify-center">
            <div className="w-px h-3/4 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>
          </div>

          <div className="relative px-2 w-full h-full flex items-center justify-center">
            <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8">
              {/* Title and Description */}
              <div className="w-full max-w-2xl text-center mb-2">
                <TextRevealParallax direction="up" delay={100} duration={800}>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: `${ColorTheme.babyBlue}DD` }}
                  >
                    Use AI-powered vision to quickly scan and recognize your pantry items, receipts, and barcodes — all in just seconds.
                  </p>
                </TextRevealParallax>
              </div>

              <div className="w-full max-w-5xl flex items-center justify-center gap-6">
              <div className="flex flex-col items-center justify-center gap-6">
                <div
                  className="camera-frame relative w-full max-w-sm aspect-square rounded-[36px] border-2 shadow-2xl overflow-hidden backdrop-blur-xl"
                  style={{
                    borderColor: `${ColorTheme.powderBlue}A0`,        
                    boxShadow: `0 45px 110px ${ColorTheme.darkBlue}35`,
                  }}
                >
                  <div
                    className="absolute top-6 left-8 h-3 w-28 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${ColorTheme.iceberg}EE 0%, ${ColorTheme.powderBlue}A0 100%)`,
                      boxShadow: `0 4px 18px ${ColorTheme.powderBlue}55`,
                      border: `1px solid ${ColorTheme.iceberg}55`,
                    }}
                  />
                  <div
                    className="absolute top-6 right-12 h-4 w-4 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, #FF4444FF 0%, #CC0000AA 55%, transparent 100%)`,
                      boxShadow: `0 0 16px #FF4444AA`,
                      border: `1px solid #FF666655`,
                    }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: `#FF0000EE`, boxShadow: `0 0 6px #FF0000AA` }}
                    />
                  </div>
                  <div className="camera-corner camera-corner-tl" style={{ color: `${ColorTheme.powderBlue}A0` }} />
                  <div className="camera-corner camera-corner-tr" style={{ color: `${ColorTheme.powderBlue}A0` }} />
                  <div className="camera-corner camera-corner-bl" style={{ color: `${ColorTheme.powderBlue}A0` }} />
                  <div className="camera-corner camera-corner-br" style={{ color: `${ColorTheme.powderBlue}A0` }} />

                  <div className="camera-display relative z-10 w-full h-full rounded-[28px] overflow-hidden">
                    <AppleModel />
                    {/* Wave Scan Effect */}
                    <div 
                      className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px] wave-scan-container"
                      style={{
                        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.35) 82%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.35) 82%, transparent 100%)',
                      }}
                    >
                      <div 
                        className="wave-scan-line"
                        style={{
                          background: `linear-gradient(180deg, 
                            transparent 0%, 
                            ${ColorTheme.powderBlue}60 25%, 
                            ${ColorTheme.powderBlue}A0 50%, 
                            ${ColorTheme.powderBlue}70 75%, 
                            transparent 100%
                          )`,
                        }}
                      />
                      <div 
                        className="wave-scan-line wave-scan-line-secondary"
                        style={{
                          background: `linear-gradient(180deg, 
                            transparent 0%, 
                            ${ColorTheme.powderBlue}55 35%, 
                            ${ColorTheme.powderBlue}B5 55%, 
                            ${ColorTheme.powderBlue}70 75%, 
                            transparent 100%
                          )`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8">
                  {/* Gallery Icon */}
                  <button
                    className="camera-footer-button flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${ColorTheme.powderBlue}40, ${ColorTheme.blueGray}30)`,
                      border: `1px solid ${ColorTheme.iceberg}40`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: `0 4px 16px ${ColorTheme.darkBlue}30`,
                    }}
                  >
                    <Image size={18} style={{ color: ColorTheme.iceberg }} />
                  </button>

                  {/* Center Circle Button */}
                  <button
                    className="camera-footer-button flex items-center justify-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${ColorTheme.iceberg}F0, ${ColorTheme.powderBlue}CC)`,
                      border: `2px solid ${ColorTheme.iceberg}80`,
                      backdropFilter: 'blur(14px)',
                      boxShadow: `0 10px 26px ${ColorTheme.powderBlue}60, inset 0 2px 8px rgba(255, 255, 255, 0.3)`,
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${ColorTheme.powderBlue}AA, ${ColorTheme.babyBlue}AA)`,
                        border: `2px solid ${ColorTheme.iceberg}AA`,
                      }}
                    />
                  </button>

                  {/* Camera Icon */}
                  <button
                    className="camera-footer-button flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${ColorTheme.powderBlue}40, ${ColorTheme.blueGray}30)`,
                      border: `1px solid ${ColorTheme.iceberg}40`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: `0 4px 16px ${ColorTheme.darkBlue}30`,
                    }}
                  >
                    <Camera size={18} style={{ color: ColorTheme.iceberg }} />
                  </button>
                </div>
              </div>

              {/* Connector Line */}
              <div className="relative flex items-center justify-center -translate-y-10">
                <div 
                  className="w-px h-32"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${ColorTheme.powderBlue}60 20%, ${ColorTheme.powderBlue}80 50%, ${ColorTheme.powderBlue}60 80%, transparent 100%)`,
                    boxShadow: `0 0 20px ${ColorTheme.powderBlue}40`,
                  }}
                />
                <div 
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: `${ColorTheme.powderBlue}AA`,
                    border: `2px solid ${ColorTheme.iceberg}80`,
                    boxShadow: `0 0 12px ${ColorTheme.powderBlue}60`,
                  }}
                />
              </div>

              {/* Apple Food Item Card */}
              <div className="flex flex-col items-center justify-center -translate-y-10">
                <motion.div
                  initial={false}
                  style={{
                    backgroundColor: `${ColorTheme.iceberg}15`,
                    borderColor: `${ColorTheme.powderBlue}50`,
                  }}
                  className="backdrop-blur-md rounded-xl p-4 hover:shadow-xl transition-all border-2 shadow-lg w-52"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner"
                      style={{
                        background: `linear-gradient(to bottom right, ${ColorTheme.powderBlue}40, ${ColorTheme.blueGray}40)`,
                      }}
                    >
                      🍎
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base" style={{ color: ColorTheme.iceberg }}>Apple</h4>
                      <p className="text-sm mt-1" style={{ color: `${ColorTheme.babyBlue}DD` }}>Expires: Nov 20</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PantrySection() {
  return (
    <DndProvider backend={HTML5Backend}>
      <PantrySectionContent />
    </DndProvider>
  );
}

export default memo(PantrySection);

// Preload the apple model
useGLTF.preload('/assets/3d/apple.glb');
