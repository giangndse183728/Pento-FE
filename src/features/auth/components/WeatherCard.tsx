"use client";
import { useEffect, useState, useCallback } from "react";
import { WhiteCard } from "@/components/decoration/WhiteCard";

type WeatherData = {
    dt: number;
    sys: { country: string };
    main: { temp: number; feels_like: number; pressure: number; humidity: number };
    weather: { description: string; icon: string }[];
    wind: { speed: number; deg: number };
    visibility: number;
    name: string;
};

interface WeatherCardProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

export default function WeatherCard({ width = 500, height = 300, className = "", style = {} }: WeatherCardProps) {

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_WEATHER_BASE_URL;
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const defaultCity = "Ho Chi Minh City";

    const fetchWeather = useCallback(async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/weather?q=${defaultCity}&appid=${API_KEY}&units=metric`
            );
            const data = await res.json();
            if (data.cod === 200) {
                setWeather(data);
            } else {
                setWeather(null);
            }
        } catch (error) {
            console.error(error);
        }
    }, [BASE_URL, API_KEY]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const formattedDate = weather
        ? (() => {
            const d = new Date(weather.dt * 1000);
            const day = d.getDate();
            const month = d.toLocaleString(undefined, { month: 'short' });
            const year = d.getFullYear();
            return `${day} ${month} ${year}`;
        })()
        : '';

    return (
        <WhiteCard width={width} height={height} className={className} style={style}>
            <div className="space-y-3">
                {/* Weather Info */}
                {weather ? (
                    <>
                        <div className="flex items-baseline justify-between">
                            <h2 className="text-xl font-semibold">{weather.name}</h2>
                            <span className="text-sm text-gray-500">{weather.sys?.country} • {formattedDate}</span>
                        </div>
                        <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C
                            <span className="ml-2 text-base text-gray-600">feels like {Math.round(weather.main.feels_like)}°C</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                                alt="weather-icon"
                            />
                            <span className="capitalize">{weather.weather[0].description}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mt-2">
                            <div>Wind: {weather.wind?.speed} m/s @ {weather.wind?.deg}°</div>
                            <div>Pressure: {weather.main.pressure} hPa</div>
                            <div>Humidity: {weather.main.humidity}%</div>
                            <div>Visibility: {(weather.visibility / 1000).toFixed(1)} km</div>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">No data found.</p>
                )}
            </div>
        </WhiteCard>
    );
}
