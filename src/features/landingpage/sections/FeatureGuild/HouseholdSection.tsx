"use client";

import StyledCard from "@/components/decoration/StyledCard";
import { Snowflake, Trophy, ChefHat, BookOpen } from "lucide-react";
import { lazy, useRef, memo, useState } from "react";
import { ColorTheme } from "@/constants/color";
import Image from "next/image";
import HouseholdMap from "@/features/landingpage/components/Map";
import TicketCard, { TicketClipPath } from "@/features/landingpage/components/TicketCard";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type MealStatus = "pending" | "fulfilled" | "canceled";

interface FakeMeal {
  id: number;
  type: MealType;
  title: string;
  time: string;
  status: MealStatus;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const FAKE_MEALS_BY_DAY: Record<number, FakeMeal[]> = {
  0: [
    { id: 1, type: "breakfast", title: "Overnight Oats with Berries", time: "08:00", status: "fulfilled" },
    { id: 2, type: "dinner", title: "Baked Salmon & Roasted Veggies", time: "19:00", status: "pending" },
  ],
  1: [
    { id: 3, type: "lunch", title: "Champurrado", time: "12:30", status: "pending" },
    { id: 4, type: "snack", title: "Fruit & Yogurt Parfait", time: "16:00", status: "fulfilled" },
  ],
  2: [
    { id: 5, type: "breakfast", title: "Greek Yogurt & Granola", time: "07:45", status: "fulfilled" },
    { id: 6, type: "snack", title: "Apple & Peanut Butter", time: "16:00", status: "canceled" },
  ],
  3: [
    { id: 7, type: "breakfast", title: "Avocado Toast", time: "08:15", status: "pending" },
    { id: 8, type: "dinner", title: "Grilled Chicken", time: "19:30", status: "pending" },
  ],
  4: [
    { id: 9, type: "dinner", title: "Tempura - 天ぷら", time: "18:45", status: "pending" },
    { id: 10, type: "snack", title: "Yakitori - 焼き鳥", time: "15:30", status: "fulfilled" },
  ],
  5: [
    { id: 11, type: "breakfast", title: "Okonomiyaki - お好み焼き", time: "09:00", status: "fulfilled" },
    { id: 12, type: "lunch", title: "Soba Noodles - そば", time: "12:45", status: "pending" },
  ],
  6: [
    { id: 13, type: "lunch", title: "Miso Ramen - ラーメン", time: "13:00", status: "fulfilled" },
    { id: 14, type: "dinner", title: "Shabu shabu - しゃぶしゃぶ", time: "19:00", status: "pending" },
  ],
};

function getMealTypeLabel(type: MealType) {
  switch (type) {
    case "breakfast":
      return "Breakfast";
    case "lunch":
      return "Lunch";
    case "dinner":
      return "Dinner";
    case "snack":
      return "Snack";
  }
}

function getMealTypeIcon(type: MealType) {
  switch (type) {
    case "breakfast":
      return { src: "/assets/icon/sun.png", alt: "Breakfast" };
    case "lunch":
      return { src: "/assets/icon/lunch.png", alt: "Lunch" };
    case "dinner":
      return { src: "/assets/icon/full-moon.png", alt: "Dinner" };
    case "snack":
    default:
      return { src: "/assets/icon/lunch.png", alt: "Snack" };
  }
}

function getMealStatusChip(status: MealStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        style: {
          backgroundColor: `${ColorTheme.powderBlue}55`,
          color: ColorTheme.darkBlue,
          borderColor: `${ColorTheme.blueGray}55`,
        },
      };
    case "fulfilled":
      return {
        label: "Fulfilled",
        style: {
          backgroundColor: "rgba(34, 197, 94, 0.18)",
          color: "rgba(21, 128, 61, 1)",
          borderColor: "rgba(34, 197, 94, 0.35)",
        },
      };
    case "canceled":
      return {
        label: "Canceled",
        style: {
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: "rgba(185, 28, 28, 1)",
          borderColor: "rgba(239, 68, 68, 0.35)",
        },
      };
  }
}

function HouseholdSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Always default to Pento (Sunday) - index 6
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6);
  const [isSwitchingDay, setIsSwitchingDay] = useState(false);

  const todayLabel = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const mealsForSelectedDay = FAKE_MEALS_BY_DAY[selectedDayIndex] ?? [];

  const handleSelectDay = (idx: number) => {
    if (idx === selectedDayIndex || isSwitchingDay) return;

    // Trigger a small fade/slide-out, then swap data and fade-in
    setIsSwitchingDay(true);
    setTimeout(() => {
      setSelectedDayIndex(idx);
      // allow next paint before turning animation off
      requestAnimationFrame(() => setIsSwitchingDay(false));
    }, 150);
  };

  return (
    <div
      ref={sectionRef}
      className="min-h-screen w-screen flex-shrink-0 flex px-12"
    >
      <TicketClipPath />
      <div className="w-full h-full grid grid-cols-[40%_15%_45%] gap-6 items-center z-10">
        <div className="flex flex-col h-full relative items-center justify-center overflow-visible">
          <div className="relative w-full max-w-xl">
            <StyledCard
              title="Household Food Management"
              icon={
                <Snowflake className="w-6 h-6 text-white bg-blue-500/20 rounded-full p-1 " />
              }
              variant="solution"
              fullWidth={true}
            >
              <h3 className="text-4xl font-primary text-white">
                Collaborate Household
              </h3>
              <p className="text-md text-black/80 leading-relaxed pb-14">
                Manage food together with household members through different
                routes. Stay synchronized as a team.
              </p>
            </StyledCard>
          </div>

          {/* Meal plan preview */}
          <div className="translate-y-[-50px] w-full max-w-md mb-5 overflow-visible">
            <div
              className="rounded-2xl border shadow-xl px-4 py-3 space-y-3 backdrop-blur-xl overflow-visible"
              style={{
                backgroundColor: `${ColorTheme.iceberg}CC`,
                borderColor: `${ColorTheme.babyBlue}80`,
                boxShadow: `0 14px 40px ${ColorTheme.darkBlue}26`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    This week
                  </p>
                  <p className="text-sm font-primary text-slate-800">
                    Household meal plan
                  </p>
                </div>
                <span
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${ColorTheme.powderBlue}40`,
                    color: ColorTheme.darkBlue,
                  }}
                >
                  {todayLabel}
                </span>
              </div>

              {/* Mini week calendar */}
              <div className="flex items-center justify-center gap-2 pt-1 relative z-50 overflow-visible px-2 pr-4">
                {WEEK_DAYS.map((label, idx) => {
                  const isSelected = idx === selectedDayIndex;

                  // Calculate date for each day based on current week
                  const today = new Date();
                  const jsDay = today.getDay(); // 0 (Sun) - 6 (Sat)
                  const mondayIndex = (jsDay + 6) % 7; // index of today in Mon–Sun
                  const dateForDay = new Date(today);
                  const diff = idx - mondayIndex;
                  dateForDay.setDate(today.getDate() + diff);
                  const dayOfMonth = dateForDay.getDate();

                    return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleSelectDay(idx)}
                      className={`relative z-50 flex flex-col items-center justify-center rounded-xl px-2 py-1.5 transition-all text-[11px] pointer-events-auto ${
                        isSelected
                          ? "scale-105 shadow-md"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? ColorTheme.blueGray
                          : `${ColorTheme.babyBlue}60`,
                        color: isSelected ? ColorTheme.iceberg : ColorTheme.darkBlue,
                        position: 'relative',
                      }}
                       >
                       <span className="font-semibold">
                         {label === "Sun" ? "Pento" : label}
                       </span>
                      <span className="text-[10px] opacity-80">
                        {dayOfMonth}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Meals list for selected day with soft transition on change */}
              <div
                className={`mt-2 space-y-2 max-h-44 overflow-y-auto pr-2 pl-2 py-2 custom-scrollbar transform transition-all duration-200 ease-out border-2 border-dashed border-white/60 rounded-xl ${
                  isSwitchingDay ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                }`}
              >
                {mealsForSelectedDay.length === 0 ? (
                  <div className="flex flex-col items-start justify-center py-3 text-xs text-slate-500">
                    <span className="font-medium">
                      No meals planned for this day.
                    </span>
                    <span>Add a breakfast, lunch, or dinner to sync everyone.</span>
                  </div>
                ) : (
                  mealsForSelectedDay.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between rounded-xl px-3 py-2 bg-white/80 border border-white/70 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                          <Image
                            src={getMealTypeIcon(meal.type).src}
                            alt={getMealTypeIcon(meal.type).alt}
                            fill
                            sizes="36px"
                            className="object-contain p-1.5"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-semibold text-slate-500">
                            {getMealTypeLabel(meal.type)} · {meal.time}
                          </span>
                          <span className="text-sm font-medium text-slate-800">
                            {meal.title}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[11px] font-semibold px-2 py-1 rounded-full border"
                        style={getMealStatusChip(meal.status).style}
                      >
                        {getMealStatusChip(meal.status).label}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle divider */}
        <div className="h-full flex items-center justify-center">
          <div className="w-px h-3/4 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>
        </div>

        <div className=" relative">
          <div className="flex flex-col px-8">
            <div className="flex flex-row items-stretch justify-between gap-2 ">
              <div className="flex-1 flex items-start">
                <div className="flex items-center justify-center w-full max-w-lg">
                  <HouseholdMap />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-stretch justify-between gap-6 my-6">
                  {/* Recipe Card */}
                  <div className="flex-1">
                <div
                  className="ticket-card cursor-pointer hover:scale-105 transition-transform relative flex flex-col justify-between h-full"
                  style={{
                    background: "#ffffff",
                    border: "6px solid #B9D7EA",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                   
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

                  <div className="flex flex-col gap-3">
                    <h3
                      className="text-lg font-primary"
                      style={{ color: ColorTheme.blueGray }}
                    >
                      Another Feature
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(0,0,0,0.7)" }}
                    >
                      Discover smart tools that make manage more fun and smart.
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievement Card */}
              <div className="flex-1">
                <TicketCard
                  icon="/assets/icon/award.png"
                  title="Achievement"
                />
              </div>

              {/* AI Chef Card */}
              <div className="flex-1">
                <TicketCard
                  icon="/assets/icon/chef-hat.png"
                  title="AI Chef"
                />
              </div>

          
            </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default memo(HouseholdSection);
