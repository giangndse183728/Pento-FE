"use client"

import React, { forwardRef, useRef } from "react"
import Image from "next/image"
import { Home, Calendar, Users, ShoppingCart, CheckCircle, Clock, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; title?: string; label?: string }
>(({ className, children, title, label }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 relative flex flex-row items-center justify-center rounded-full ring-1 backdrop-blur-sm p-3 hover:scale-105 transition-transform duration-200 min-w-32 gap-2 circle-breath",
        className
      )}
      style={{
        background: "linear-gradient(180deg, rgba(185,215,234,0.9) 0%, rgba(214,230,242,0.9) 100%)",
        color: "#0b1220",
        borderColor: "#B9D7EA",
        boxShadow: "0 10px 30px rgba(185,215,234,0.45)",
      }}
      title={title}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full" aria-hidden="true"></span>
      {children}
      {label && (
        <span className="text-xs text-gray-700 leading-tight font-medium whitespace-nowrap">
          {label}
        </span>
      )}
      <style jsx>{`
        .circle-breath { overflow: visible; }
        .circle-breath:after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          pointer-events: none;
          box-shadow: inset 0 0 8px 3px rgba(118, 159, 205, 0.18),
                      inset 0 0 4px 1px rgba(118, 159, 205, 0.12);
          animation: circle-breathe-outer 3.2s ease-in-out infinite;
        }
        @keyframes circle-breathe-outer {
          0% {
            box-shadow: inset 0 0 6px 3px rgba(118, 159, 205, 0.16),
                        inset 0 0 2px 1px rgba(118, 159, 205, 0.10);
            filter: saturate(0.95);
          }
          50% {
            box-shadow: inset 0 0 16px 8px rgba(118, 159, 205, 0.45),
                        inset 0 0 8px 2px rgba(118, 159, 205, 0.30);
            filter: saturate(1.05);
          }
          100% {
            box-shadow: inset 0 0 6px 3px rgba(118, 159, 205, 0.16),
                        inset 0 0 2px 1px rgba(118, 159, 205, 0.10);
            filter: saturate(0.95);
          }
        }
      `}</style>
    </div>
  )
})

Circle.displayName = "Circle"

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const choreRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const shoppingRef = useRef<HTMLDivElement>(null)
  const shoppingListRef = useRef<HTMLDivElement>(null)
  const taskRef = useRef<HTMLDivElement>(null)
  const reminderRef = useRef<HTMLDivElement>(null)
  const centralRef = useRef<HTMLDivElement>(null)
  const familyRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-xl flex-row items-stretch justify-between gap-20">
        
        <div className="flex flex-col justify-center">
          <Circle ref={centralRef} className="min-w-32" title="Central control for all household food operations">
            <Home className="w-6 h-6 text-blue-600" />
          </Circle>
        </div>
        
        <div className="flex flex-col justify-center">
        <Circle ref={familyRef}  title="Track who's responsible for food management tasks">
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <Image src="/assets/img/logo2.png" alt="Family Food Management" width={72} height={72} className="rounded" objectFit="contain" />
            
            </div>
           
          </Circle>
        </div>
        
        <div className="flex flex-col justify-center gap-14">
          <Circle ref={choreRef} label="Kitchen Chores & Task Assignment" className="ml-12">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </Circle>
          <Circle ref={calendarRef} label="Meal Planning & Schedule Coordination" className="mr-12">
            <Calendar className="w-4 h-4 text-purple-600" />
          </Circle>
          <Circle ref={shoppingListRef} label="Smart Grocery Lists & Inventory">
            <ShoppingCart className="w-4 h-4 text-orange-600" />
          </Circle>
          <Circle ref={taskRef} label="Food Safety & Storage Monitoring" className="mr-12">
            <Settings className="w-4 h-4 text-gray-600" />
          </Circle>
          <Circle ref={reminderRef} label="Waste Prevention & Expiry Alerts" className="ml-12">
            <Clock className="w-4 h-4 text-red-600" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={choreRef}
        toRef={familyRef}
        duration={3}
        gradientStartColor="#10b981"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={calendarRef}
        toRef={familyRef}
        duration={3}
        gradientStartColor="#8b5cf6"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={shoppingRef}
        toRef={familyRef}
        duration={3}
        gradientStartColor="#f97316"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={taskRef}
        toRef={familyRef}
        duration={3}
        gradientStartColor="#6b7280"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={reminderRef}
        toRef={familyRef}
        duration={3}
        gradientStartColor="#ef4444"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={shoppingListRef}
        toRef={familyRef}
        duration={3}
        gradientStartColor="#f97316"
        gradientStopColor="#3b82f6"
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centralRef}
        toRef={familyRef}
        duration={4}
        gradientStartColor="#3b82f6"
        gradientStopColor="#1d4ed8"
      />


    </div>
  )
}

