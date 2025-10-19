"use client";
import { useEffect, useState, useCallback } from "react";
import { WhiteCard } from "@/components/decoration/WhiteCard";
import Image from "next/image";
import { weatherService } from "@/services/weatherService";
import { ColorTheme } from "@/constants/color";

// Update the WeatherData type to match the service
type WeatherData = {
    cod: number;
    message?: string;
    name: string;
    dt: number;
    sys: { country: string };
    main: {
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
    wind: { speed: number; deg: number };
    visibility: number;
};

// Update the ForecastItem type to match the service
type ForecastItem = {
    dt: number;
    dt_txt: string;
    main: {
        temp: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
};

interface WeatherCardProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

export default function WeatherCard({ width = 500, height = 300, className = "", style = {} }: WeatherCardProps) {

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastItem[]>([]);

    const fetchWeather = useCallback(async () => {
        try {
            const data = await weatherService.getCurrentWeather();
            if (data && 'cod' in data) {
                setWeather(data as WeatherData);
            } else {
                setWeather(null);
            }
        } catch (error) {
            console.error(error);
            setWeather(null);
        }
    }, []);

    const fetchForecast = useCallback(async () => {
        try {
            const data = await weatherService.getForecast();
            setForecast(data);
        } catch (error) {
            console.error(error);
            setForecast([]);
        }
    }, []);


    useEffect(() => {
        fetchWeather();
        fetchForecast();
    }, [fetchWeather, fetchForecast]);


    return (
        <WhiteCard width={width} height={height} className={className} style={style}>
            <div className="h-full flex flex-col justify-center space-y-3 mb-3">
                {/* Weather Info */}
                {weather ? (
                    <>
                        <div className="flex items-baseline justify-between">
                            <h2 className="text-2xl font-semibold">{weather.name}</h2>
                        </div>
                        <p className="text-5xl font-bold"
                            style={{
                                color: ColorTheme.darkBlue,
                            }}>{Math.round(weather.main.temp)}°C
                            <span className="ml-2 text-base text-gray-600"></span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Image
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt="weather icon"
                                width={50}
                                height={50}
                                priority
                            />
                            <span className="capitalize text-xl"
                                style={{
                                    color: ColorTheme.darkBlue
                                }}>{weather.weather[0].description}</span>
                        </div>
                        {/* Forecast */}
                        {forecast.length > 0 && (
                            <div className="mt-0">
                                <h3 className="text-md font-semibold">Forecast</h3>
                                <div className="grid grid-cols-4 gap-5 text-center">
                                    {forecast.map((item, i) => {
                                        const date = new Date(item.dt * 1000);
                                        const day = date.toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'short'
                                        });
                                        return (
                                            <div
                                                key={i}
                                                className="p-2 rounded-lg transition-transform hover:scale-105"
                                            >
                                                <p className="text-sm text-gray-600">{day}</p>
                                                <Image
                                                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                                    alt={item.weather[0].description}
                                                    width={35}
                                                    height={35}
                                                />
                                                <p className="font-medium text-sm">
                                                    {Math.round(item.main.temp)}°C
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 text-center">No data found.</p>
                )}
            </div>
        </WhiteCard>
    );
}
