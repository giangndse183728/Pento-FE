interface WeatherConfig {
    BASE_URL: string;
    API_KEY: string;
    defaultCity: string;
}

interface WeatherData {
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
}
// ...existing code...

interface ForecastItem {
    dt: number;
    dt_txt: string;
    main: {
        temp: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
}

interface ForecastData {
    cod: string;
    message?: string;
    list: ForecastItem[];
}

export class WeatherService {
    private config: WeatherConfig;

    constructor() {
        this.config = {
            BASE_URL: process.env.NEXT_PUBLIC_WEATHER_BASE_URL || '',
            API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
            defaultCity: "Ho Chi Minh City"
        };
    }

    async getCurrentWeather(): Promise<WeatherData> {
        try {
            const res = await fetch(
                `${this.config.BASE_URL}/weather?q=${this.config.defaultCity}&appid=${this.config.API_KEY}&units=metric`
            );
            const data: WeatherData = await res.json();
            if (data.cod === 200) {
                return data;
            }
            throw new Error(data.message || 'Failed to fetch weather data');
        } catch (error) {
            console.error('Weather fetch error:', error);
            throw error;
        }
    }

    async getForecast(): Promise<ForecastItem[]> {
        try {
            const res = await fetch(
                `${this.config.BASE_URL}/forecast?q=${this.config.defaultCity}&appid=${this.config.API_KEY}&units=metric`
            );
            const data: ForecastData = await res.json();
            if (data.cod === "200") {
                const daily = data.list.filter((item: ForecastItem) =>
                    item.dt_txt.includes("12:00:00")
                );
                return daily.slice(0, 4);
            }
            throw new Error(data.message || 'Failed to fetch forecast data');
        } catch (error) {
            console.error('Forecast fetch error:', error);
            throw error;
        }
    }
}

export const weatherService = new WeatherService();