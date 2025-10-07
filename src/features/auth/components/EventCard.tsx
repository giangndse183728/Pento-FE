"use client";
import * as React from "react"
import { BlurCard } from "@/components/decoration/BlurCard"

export interface EventCardProps {
    width?: number | string
    height?: number | string
    className?: string
    style?: React.CSSProperties
}

export function EventCard({ width = 500, height = 250, className = "", style = {} }: EventCardProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [time, setTime] = React.useState<string>("")

    React.useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setDate(now)

            // Format hours/minutes/seconds with AM/PM
            let hours = now.getHours()
            const minutes = String(now.getMinutes()).padStart(2, "0")
            const ampm = hours >= 12 ? "PM" : "AM"

            // Convert to 12-hour format
            hours = hours % 12
            hours = hours ? hours : 12 // 0 becomes 12
            const hourStr = String(hours).padStart(2, "0")

            setTime(`${hourStr}:${minutes}:${ampm}`)
        }

        updateTime()
        const interval = setInterval(updateTime, 60000)
        return () => clearInterval(interval)
    }, [])

    const formatWeekdayWithOrdinal = (d?: Date): string => {
        if (!d) return "";
        const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
        const n = d.getDate();
        const s: string[] = ["th", "st", "nd", "rd"]; // 0th fallback
        const v = n % 100;
        const idx = (v - 20) % 10;
        const suffix = (idx >= 1 && idx <= 3 ? s[idx] : s[v] || s[0]);
        return `${weekday} ${n}${suffix}`;
    }

    const resolvedStyle: React.CSSProperties = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
    }

    return (
        <div className={className} style={resolvedStyle}>
            <BlurCard className="relative w-full h-full flex items-center justify-center">

                {/* Centered Content */}
                <div className="flex flex-col items-center text-center gap-3 p-6">
                    {/* Clock */}
                    <p
                        className="text-5xl font-bold font-mono tracking-widest tabular-nums leading-none"
                        style={{
                            fontFamily: "var(--font-orbitron), 'Courier New', monospace",
                            textShadow:
                                "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)",
                            color: "#B9D7EA",
                        }}
                    >
                        {time}
                    </p>
                    <p className=" text-white text-2sm font-medium tracking-wide opacity-80 mt-0">
                        {formatWeekdayWithOrdinal(date)}
                    </p>
                </div>
            </BlurCard>
        </div>
    );

}
