'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export default function WeatherTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Set fake winter weather data
  useEffect(() => {
    // Simulate loading delay for realistic feel
    const timer = setTimeout(() => {
      // Winter weather scenarios
      const winterWeatherOptions = [
        {
          location: 'Winterfell',
          temperature: -8,
          condition: 'heavy snow',
          humidity: 85,
          windSpeed: 12.3,
          icon: '13d'
        },
        {
          location: 'Frostburg',
          temperature: -3,
          condition: 'light snow',
          humidity: 78,
          windSpeed: 8.5,
          icon: '13d'
        },
        {
          location: 'Ice Valley',
          temperature: -12,
          condition: 'blizzard',
          humidity: 92,
          windSpeed: 18.7,
          icon: '13d'
        },
        {
          location: 'Snowpeak',
          temperature: -5,
          condition: 'overcast',
          humidity: 71,
          windSpeed: 6.2,
          icon: '04d'
        },
        {
          location: 'Crystal Bay',
          temperature: 2,
          condition: 'freezing rain',
          humidity: 88,
          windSpeed: 9.8,
          icon: '09d'
        }
      ];

      // Randomly select a winter weather scenario
      const randomWeather = winterWeatherOptions[Math.floor(Math.random() * winterWeatherOptions.length)];
      setWeather(randomWeather);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getWeatherIcon = (condition: string, iconCode: string) => {
    const iconSize = "w-6 h-6";
    
    if (iconCode.includes('01')) return <Sun className={`${iconSize} text-yellow-400`} />;
    if (iconCode.includes('02') || iconCode.includes('03')) return <Cloud className={`${iconSize} text-gray-300`} />;
    if (iconCode.includes('04')) return <Cloud className={`${iconSize} text-gray-400`} />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className={`${iconSize} text-blue-400`} />;
    if (iconCode.includes('13')) return <CloudSnow className={`${iconSize} text-white`} />;
    
    // Default
    return <Cloud className={`${iconSize} text-gray-300`} />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="backdrop-blur-sm bg-black/30 p-4 rounded-2xl border border-white/20">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-6 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-white/20 hover:bg-black/40 transition-all duration-300 min-w-[280px]">
      {/* Time Section */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-white font-mono">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-300">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Weather Section */}
      {weather && (
        <div className="space-y-3">
          {/* Location and Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getWeatherIcon(weather.condition, weather.icon)}
              <span className="text-xl font-semibold text-white">
                {weather.temperature}°C
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {weather.location}
              </div>
              <div className="text-xs text-gray-300 capitalize">
                {weather.condition}
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 text-blue-300" />
              <span className="text-gray-300">Humidity</span>
              <span className="text-white font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wind className="w-3 h-3 text-blue-300" />
              <span className="text-gray-300">Wind</span>
              <span className="text-white font-medium">{weather.windSpeed} m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
