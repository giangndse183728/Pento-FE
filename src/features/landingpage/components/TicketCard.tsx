"use client";

import { ColorTheme } from "@/constants/color";
import Image from "next/image";

interface TicketCardProps {
  icon: string; // Path to icon image
  title: string;
  onClick?: () => void;
  className?: string;
}

function TicketCard({
  icon,
  title,
  onClick,
  className = "",
}: TicketCardProps) {
  const radius = 38; // Increased radius
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`ticket-card cursor-pointer hover:scale-105 transition-transform relative ${className}`}
      onClick={onClick}
      style={{
        background: "#ffffff",
        border: "1.5px solid rgba(0,0,0,0.1)",
        borderRadius: "12px",
        padding: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        clipPath: "url(#ticketClip)",
      }}
    >
      {/* Notch shadow decorations */}
      <div
        className="absolute left-0 top-[60%] -translate-y-1/2 w-2 h-4 rounded-r-full"
        style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
      />
      <div
        className="absolute right-0 top-[60%] -translate-y-1/2 w-2 h-4 rounded-l-full"
        style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
      />

      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 mb-2 mt-2">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#f0f0f0"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={ColorTheme.blueGray}
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <Image
                src={icon}
                alt={title}
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </div>
          {/* Checkmark badge */}
          <div
            className="absolute -top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: ColorTheme.blueGray,
              border: "1.5px solid white",
            }}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="w-full flex justify-center gap-2 my-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-3 h-0.5 bg-black/20" />
          ))}
        </div>

        {/* Title */}
        <p
          className="text-xs  text-center font-primary"
          style={{ color: "rgba(0,0,0,0.7)" }}
        >
          {title}
        </p>
        <p
          className="text-xs font-semibold"
          style={{ color: ColorTheme.blueGray }}
        >
          100%
        </p>
      </div>
    </div>
  );
}

// SVG ClipPath component - include once in parent
export function TicketClipPath() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <clipPath id="ticketClip" clipPathUnits="objectBoundingBox">
          <path
            d="M 0 0 
               L 1 0 
               L 1 0.55 
               A 0.05 0.05 0 0 0 1 0.65 
               L 1 1 
               L 0 1 
               L 0 0.65 
               A 0.05 0.05 0 0 0 0 0.55 
               Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default TicketCard;
