"use client";

import type { CSSProperties } from "react";
import { Navigation } from "lucide-react";
import "./Map.css";

const cityPosition = (x: number, y: number): CSSProperties =>
({
  "--x": x,
  "--y": y,
} as CSSProperties);

interface Store {
  name: string;
  distance: string;
  icon: string;
}

const nearbyStores: Store[] = [
  { name: "Fresh Market", distance: "0.8 km away", icon: "🏪" },
  { name: "Super Grocer", distance: "1.6 km away", icon: "🛒" },
  { name: "Local Mart", distance: "2.0 km away", icon: "🏬" },
];

function HouseholdMap() {
  return (
    <div className="rounded-2xl px-4 py-3 space-y-4 w-full bg-white/20 backdrop-blur-md border border-white/40 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Nearby
          </p>
          <p className="text-sm text-white font-primary">
            Grocery stores — <span className="text-white/60 font-normal font-sans">Find nearby stores with the ingredients you need.</span>
          </p>
        </div>
      </div>

      {/* Map and stores side by side */}
      <div className="flex gap-4 items-start">
        {/* Smaller map */}
        <div className="map-container map-container--small flex-shrink-0" aria-label="Household locations map">
          <svg viewBox="0 0 500 500" className="map-background" role="img">
            <rect style={{ fill: "#f5f0e5" }} width="500" height="500" />
            <path
              style={{ fill: "#90daee" }}
              d="M0,367.82c5.83-4.39,14.42-10.16,25.59-15.34,4.52-2.09,43.19-19.51,79.55-11.93,36.1,7.52,35.75,32.55,78.41,60.23,46.34,30.06,109.47,41.21,123.32,22.1,11.95-16.49-22.61-41.92-13.66-84.6,4.85-23.1,22.33-50.71,47.73-58.52,42.42-13.05,78.83,39.45,102.84,23.86,15.81-10.26.01-32.87,22.73-74.43,5.8-10.62,11.65-21.15,11.93-36.93.28-15.69-5.63-26.64-7.95-32.39-6.66-16.45-6.21-45.15,28.84-98.55.23,146.23.46,292.46.69,438.69H0v-132.18Z"
            />
          </svg>
          <div className="map-cities">
            {/* Current position marker at center */}
            <div style={cityPosition(50, 50)} className="map-city map-city--current">
              <div className="map-city__current-pin"></div>
            </div>
            {/* Grocery store markers */}
            <div style={cityPosition(70, 55)} className="map-city">
              <div className="map-city__label">
                <span data-icon="🏪" className="map-city__sign anim anim-grow">
                  Fresh Market
                </span>
              </div>
            </div>
            <div style={cityPosition(25, 30)} className="map-city">
              <div className="map-city__label">
                <span data-icon="🛒" className="map-city__sign">
                  Super Grocer
                </span>
              </div>
            </div>
            <div style={cityPosition(80, 25)} className="map-city">
              <div className="map-city__label">
                <span className="map-city__sign anim anim-slidein" data-icon="🏬">
                  Local Mart
                </span>
              </div>
            </div>
            <div style={cityPosition(20, 85)} className="map-city">
              <div className="map-city__label">
                <span className="map-city__sign anim anim-slidein" data-icon="🐧">
                  Pento House
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store items list */}
        <div className="flex-1 space-y-2 min-w-0">
          {nearbyStores.map((store, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/80 border border-white/70 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                {store.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{store.name}</p>
                <p className="text-xs text-slate-500">{store.distance}</p>
              </div>
              <button
                className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label={`Get directions to ${store.name}`}
                title="Get directions"
              >
                <Navigation className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HouseholdMap;

