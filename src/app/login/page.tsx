import Silk from '@/features/auth/components/Silk';
import GlassSurface from '@/components/decoration/Liquidglass';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { EventCard } from '@/features/auth/components/EventCard';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import WeatherCard from '@/features/auth/components/WeatherCard';

export default function Login() {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: "#D4EBF8" }}>

                <Silk />
            </div>
            <div className="absolute inset-0 z-10 font-sans flex items-center justify-center p-8 sm:p-20">
                <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                    <GlassSurface
                        width={500}
                        height={500}
                        borderRadius={24}
                        backgroundOpacity={0.20}
                        className="p-6"
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        <div className="w-full h-full flex items-start justify-center pt-8">
                            <LoginForm className="w-[100%]" />
                        </div>
                    </GlassSurface>

                    <div className="flex flex-col gap-7">
                        <EventCard width={"100%"} height={"35%"}></EventCard>
                        <WeatherCard width={"100%"} height={"60%"}></WeatherCard>
                    </div>

                </div>
            </div>
        </div>
    );
}

